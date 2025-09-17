"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  HourglassEmpty as ProcessingIcon,
  CheckCircle as HiredIcon,
  Cancel as CancelledIcon,
  Search as SearchIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { StatsCard } from "@/@core/component/common/stats-card";
import { CustomPagination } from "@/@core/component/common/custom-pagination";
import { usePagination } from "@/@core/component/hooks/use-pagination";
import {
  RequestViewModal,
  ContactModal,
  ScheduleInterviewModal,
  CancelRequestModal,
} from "@/@core/component/modals/request-action-modals";
import {
  getAdminRequests,
  updateRequestStatus,
  AdminRequestsData,
} from "@/@core/services/AdminPool";

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requests, setRequests] = useState<AdminRequestsData["requests"]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequestsData["requests"][0] | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalData, setContactModalData] = useState<{
    title: string;
    name: string;
    email: string;
    phone: string;
    receiverId: number;
    requestId: number;
    isTalent: boolean;
  } | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const tabs = ["All", "Processing", "Hired", "Cancelled"];
  const statusFilters = ["All", "Processing", "Hired", "Cancelled"];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getAdminRequests();
        setRequests(data.requests || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const stats = [
    {
      title: "Total Requests",
      value: requests.length.toString(),
      icon: AssignmentIcon,
      color: "#3B82F6",
      bgcolor: "#EFF6FF",
    },
    {
      title: "Processing",
      value: requests.filter((r) => r.status === "Processing").length.toString(),
      icon: ProcessingIcon,
      color: "#F59E0B",
      bgcolor: "#FFFBEB",
    },
    {
      title: "Hired",
      value: requests.filter((r) => r.status === "Hired").length.toString(),
      icon: HiredIcon,
      color: "#10B981",
      bgcolor: "#ECFDF5",
    },
    {
      title: "Cancelled",
      value: requests.filter((r) => r.status === "Cancelled").length.toString(),
      icon: CancelledIcon,
      color: "#EF4444",
      bgcolor: "#FEF2F2",
    },
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesTab = activeTab === 0 || request.status === tabs[activeTab];
      const matchesSearch =
        (request.client?.company_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.job_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.talent?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || request.status === statusFilter;

      return matchesTab && matchesSearch && matchesStatus;
    });
  }, [activeTab, searchQuery, statusFilter, requests]);

  const { currentPage, totalPages, paginatedData, handlePrevious, handleNext } = usePagination({
    data: filteredRequests,
    itemsPerPage: 10,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequestIndex(index);
    setSelectedRequest(paginatedData[index]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequestIndex(null);
  };

  const handleViewRequest = () => {
    if (selectedRequest?.id) {
      setViewModalOpen(true);
    }
    handleMenuClose();
  };

  const handleContactCompany = () => {
    if (selectedRequest?.client?.id && selectedRequest.id) {
      setContactModalData({
        title: "Contact Company",
        name: selectedRequest.client.company_name || "N/A",
        email: selectedRequest.client.company_email_address || "N/A",
        phone: selectedRequest.client.company_phone || "N/A",
        receiverId: selectedRequest.client.id,
        requestId: selectedRequest.id,
        isTalent: false,
      });
      setContactModalOpen(true);
    }
    handleMenuClose();
  };

  const handleContactTalent = () => {
    if (selectedRequest?.talent?.id && selectedRequest.id) {
      setContactModalData({
        title: "Contact Talent",
        name: selectedRequest.talent.name || "N/A",
        email: selectedRequest.talent.email || "N/A",
        phone: selectedRequest.talent.phone_number || "N/A",
        receiverId: selectedRequest.talent.id,
        requestId: selectedRequest.id,
        isTalent: true,
      });
      setContactModalOpen(true);
    }
    handleMenuClose();
  };

  const handleScheduleInterview = () => {
    setScheduleModalOpen(true);
    handleMenuClose();
  };

  const handleCancelRequest = () => {
    setCancelModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmCancel = async (reason: string) => {
    if (selectedRequest?.id) {
      try {
        setLoading(true);
        await updateRequestStatus(selectedRequest.id, "Cancelled");
        const data = await getAdminRequests();
        setRequests(data.requests || []);
        setCancelModalOpen(false);
        setSelectedRequest(null);
        setToast({ open: true, message: "Request cancelled successfully", severity: "success" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to cancel request");
        setToast({ open: true, message: "Failed to cancel request", severity: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  const handleMessageSent = (success: boolean, message: string) => {
    setToast({ open: true, message, severity: success ? "success" : "error" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hired":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "Processing":
        return { bgcolor: "#EFF6FF", color: "#1E40AF" };
      case "Cancelled":
        return { bgcolor: "#FEF2F2", color: "#991B1B" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage talent placement requests from companies
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: "flex" }}>
            <Box sx={{ width: "100%" }}>
              <StatsCard {...stat} />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab} />
              ))}
            </Tabs>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h5">Requests</Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredRequests.length}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
              <TextField
                placeholder="Search by company, job title, or talent name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ width: { xs: "100%", md: 400 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  {statusFilters.map((filter) => (
                    <MenuItem key={filter} value={filter}>
                      {filter}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Talent Name</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((request, index) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{request.client?.company_name || "N/A"}</TableCell>
                    <TableCell>{request.job_title || "N/A"}</TableCell>
                    <TableCell>{request.talent?.name || "N/A"}</TableCell>
                    <TableCell>{request.request_date || "N/A"}</TableCell>
                    <TableCell>
                      <Chip label={request.status} size="small" sx={getStatusColor(request.status)} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, index)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRequests.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            itemName="requests"
          />
        </CardContent>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItemComponent onClick={handleViewRequest}>View</MenuItemComponent>
        <MenuItemComponent onClick={handleContactCompany}>Contact Company</MenuItemComponent>
        <MenuItemComponent onClick={handleContactTalent}>Contact Talent</MenuItemComponent>
        {/* <MenuItemComponent onClick={handleScheduleInterview}>Schedule Interview</MenuItemComponent> */}
        {/* <MenuItemComponent onClick={handleCancelRequest} sx={{ color: "error.main" }}>
          Cancel
        </MenuItemComponent> */}
      </Menu>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {selectedRequest && (
        <>
          <RequestViewModal
            request={selectedRequest}
            open={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedRequest(null);
            }}
          />

          {contactModalData && (
            <ContactModal
              open={contactModalOpen}
              onClose={() => {
                setContactModalOpen(false);
                setContactModalData(null);
              }}
              title={contactModalData.title}
              contactName={contactModalData.name}
              contactEmail={contactModalData.email}
              contactPhone={contactModalData.phone}
              receiverId={contactModalData.receiverId}
              requestId={contactModalData.requestId}
              isTalent={contactModalData.isTalent}
              onMessageSent={handleMessageSent} // Pass callback for toast
            />
          )}

          <ScheduleInterviewModal
            request={selectedRequest}
            open={scheduleModalOpen}
            onClose={() => {
              setScheduleModalOpen(false);
              setSelectedRequest(null);
            }}
          />

          <CancelRequestModal
            request={selectedRequest}
            open={cancelModalOpen}
            onClose={() => {
              setCancelModalOpen(false);
              setSelectedRequest(null);
            }}
            onConfirm={handleConfirmCancel}
          />
        </>
      )}
    </Box>
  );
}