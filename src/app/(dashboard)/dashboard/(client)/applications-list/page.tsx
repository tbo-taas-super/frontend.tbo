"use client";

import type React from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Description as AllIcon,
  Send as AppliedIcon,
  Mail as InvitedIcon,
  Recommend as RecommendedIcon,
  Search as SearchIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { StatsCard } from "@/@core/component/common/stats-card";
import { CustomPagination } from "@/@core/component/common/custom-pagination";
import { usePagination } from "@/@core/component/hooks/use-pagination";
import { ApplicationViewModal, ApplicationActionModal } from "@/@core/component/modals/application-action-modals";
import { fetchClientApplications } from "@/@core/services/jobService";

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  applicant_id: number;
  applicant_name: string;
  email: string;
  status: string;
  applied_date: string;
  cv_upload: string | null;
  cover_letter_upload: string | null;
  skills: string[];
  years_experience: number | null;
  location: string | null;
  category: string;
}

interface Interest {
  id: number;
  talent_id: number;
  talent_name: string;
  designation: string | null;
  location: string | null;
  years_experience: number | null;
  status: string;
  job_title: string;
  request_type: string;
  notes: string | null;
  request_date: string;
  skills: string[];
  category: string;
}

interface Recommendation {
  job_id: number;
  job_title: string;
  talent_id: number;
  name: string;
  email: string;
  designation: string | null;
  location: string | null;
  years_experience: number | null;
  skills: string[];
  professional_summary: string | null;
  cv_upload: string | null;
  profile_image: string | null;
  category: string;
}

interface UnifiedApplication {
  id: number;
  companyName: string;
  roleAppliedFor: string;
  dateOfApplication: string;
  applicationType: string;
  status: string;
  location: string | null;
  category: string;
  skills?: string[];
  years_experience?: number | null;
  cv_upload?: string | null;
  cover_letter_upload?: string | null;
  notes?: string | null;
  professional_summary?: string | null;
  profile_image?: string | null;
  designation?: string | null;
  email?: string;
  companyLogo?: string;
  jobDescription?: string;
  salary?: string;
  companyEmail?: string;
  companyPhone?: string;
  applicationNotes?: string;
  job_id?: number;
  talent_id?: number;
  name?: string;
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState<UnifiedApplication | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalData, setActionModalData] = useState<{
    title: string;
    message: string;
    confirmText: string;
    confirmColor: "primary" | "success" | "error";
    action: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApplicationIndex, setSelectedApplicationIndex] = useState<number | null>(null);
  const [data, setData] = useState<{
    applicants: Application[];
    interests: Interest[];
    recommendations: Recommendation[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["All", "Applied", "Invited", "Recommended"];
// Replace the existing statusFilters array with this:
const statusFilters = ["All", "Pending", "Shortlisted", "Interviewed", "Hired", "Rejected"];

  // Fetch data from API
  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const response = await fetchClientApplications();
        if (response.status) {
          const applicants = response.data.applicants.map((item: Application) => ({
            ...item,
            category: "Applied",
          }));
          const interests = response.data.interests.map((item: Interest) => ({
            ...item,
            category: "Invited",
          }));
          const recommendations = response.data.recommendations.map((item: Recommendation) => ({
            ...item,
            category: "Recommended",
          }));
          setData({
            applicants,
            interests,
            recommendations,
          });
        } else {
          setError("Failed to load applications");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  // Combine all data for filtering
  const allData = useMemo(() => {
    if (!data) return [];
    return [
      ...data.applicants.map((applicant) => ({
        ...applicant,
        companyName: applicant.job_title,
        roleAppliedFor: applicant.job_title,
        dateOfApplication: applicant.applied_date,
        applicationType: "Applied", // Changed from "Direct Application"
        status: applicant.status, // "PENDING" remains as is
        companyLogo: "",
        jobDescription: "No description available",
        salary: "Not specified",
        companyEmail: applicant.email,
        companyPhone: "Not specified",
        applicationNotes: "No notes available",
      })),
      ...data.interests.map((interest) => ({
        ...interest,
        id: interest.id,
        companyName: interest.job_title,
        roleAppliedFor: interest.job_title,
        dateOfApplication: interest.request_date,
        applicationType: interest.request_type === "Direct Hire" ? "Invited" : interest.request_type, // Changed "Direct Hire" to "Invited"
        status: interest.status === "Processing" ? "Pending" : interest.status, // Map "Processing" to "Pending"
        companyLogo: "",
        jobDescription: interest.notes || "No description available",
        salary: "Not specified",
        companyEmail: "",
        companyPhone: "Not specified",
        applicationNotes: interest.notes || "No notes available",
      })),
      ...data.recommendations.map((recommendation) => ({
        ...recommendation,
        id: recommendation.talent_id,
        companyName: recommendation.job_title,
        roleAppliedFor: recommendation.job_title,
        dateOfApplication: "N/A", // No date provided in JSON
        applicationType: "Recommended",
        status: "Pending", // Map "Recommended" to "Pending"
        companyLogo: recommendation.profile_image || "",
        jobDescription: recommendation.professional_summary || "No description available",
        salary: "Not specified",
        companyEmail: recommendation.email,
        companyPhone: "Not specified",
        applicationNotes: recommendation.professional_summary || "No notes available",
      })),
    ];
  }, [data]);

  // Calculate stats
  const stats = useMemo(
    () => [
      {
        title: "All",
        value: allData.length.toString(),
        icon: AllIcon,
        color: "#3B82F6",
        bgcolor: "#EFF6FF",
      },
      {
        title: "Applied",
        value: data?.applicants.length.toString() || "0",
        icon: AppliedIcon,
        color: "#10B981",
        bgcolor: "#ECFDF5",
      },
      {
        title: "Invited",
        value: data?.interests.length.toString() || "0",
        icon: InvitedIcon,
        color: "#F59E0B",
        bgcolor: "#FFFBEB",
      },
      {
        title: "Recommended",
        value: data?.recommendations.length.toString() || "0",
        icon: RecommendedIcon,
        color: "#8B5CF6",
        bgcolor: "#F3E8FF",
      },
    ],
    [allData, data],
  );

  // Filter data based on tab, search, and status
  const filteredApplications = useMemo(() => {
    const filtered = allData.filter((application) => {
      const matchesTab = activeTab === 0 || application.category === tabs[activeTab];
      const matchesSearch =
        (application.companyName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (application.roleAppliedFor?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || application.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesTab && matchesSearch && matchesStatus;
    });
    console.log("Filtered Applications:", filtered, { activeTab, searchQuery, statusFilter });
    return filtered;
  }, [activeTab, searchQuery, statusFilter, allData, tabs]);

  const { currentPage, totalPages, paginatedData, handlePrevious, handleNext } = usePagination({
    data: filteredApplications,
    itemsPerPage: 10,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplicationIndex(index);
    setSelectedApplication(paginatedData[index]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplicationIndex(null);
  };

  const handleViewApplication = () => {
    setViewModalOpen(true);
    handleMenuClose();
  };

  const handleAcceptApplication = () => {
    setActionModalData({
      title: "Accept Application",
      message: "Are you sure you want to accept this application? This will move it to the next stage.",
      confirmText: "Accept",
      confirmColor: "success",
      action: "accept",
    });
    setActionModalOpen(true);
    handleMenuClose();
  };

  const handleRejectApplication = () => {
    setActionModalData({
      title: "Reject Application",
      message: "Are you sure you want to reject this application? This action cannot be undone.",
      confirmText: "Reject",
      confirmColor: "error",
      action: "reject",
    });
    setActionModalOpen(true);
    handleMenuClose();
  };

  const handleCancelApplication = () => {
    setActionModalData({
      title: "Cancel Application",
      message: "Are you sure you want to cancel this application?",
      confirmText: "Cancel Application",
      confirmColor: "error",
      action: "cancel",
    });
    setActionModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmAction = () => {
    if (selectedApplication && actionModalData) {
      console.log(`${actionModalData.action} application:`, selectedApplication.id);
      // TODO: Implement API call to update application status
    }
    setActionModalOpen(false);
    setActionModalData(null);
    setSelectedApplication(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hired":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "Interviewed":
        return { bgcolor: "#F0F9FF", color: "#0C4A6E" };
      case "Shortlisted":
        return { bgcolor: "#FFFBEB", color: "#92400E" };
      case "Pending":
        return { bgcolor: "#F3F4F6", color: "#374151" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Applied": // Changed from "Direct Application"
        return { bgcolor: "#EFF6FF", color: "#1E40AF" };
      case "Invited": // Changed from "Direct Hire"
        return { bgcolor: "#FEF3C7", color: "#92400E" };
      case "Recommended":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "Contract":
      case "Interest":
        return { bgcolor: "#FEF3C7", color: "#92400E" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your job applications
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: "flex" }}>
            <Box sx={{ width: "100%" }}>
              <StatsCard {...stat} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Applications Table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Tab Filters */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab} />
              ))}
            </Tabs>
          </Box>

          {/* Search and Filters */}
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
              <Typography variant="h3">Applications</Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredApplications.length}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
              <TextField
                placeholder="Search by company or role..."
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

          {/* Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Role Applied For</TableCell>
                  <TableCell>Date of Application</TableCell>
                  <TableCell>Application Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((application, index) => (
                    <TableRow key={`${application.category}-${application.id}`} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{application.companyName}</TableCell>
                      <TableCell>{application.roleAppliedFor}</TableCell>
                      <TableCell>{application.dateOfApplication}</TableCell>
                      <TableCell>
                        <Chip
                          label={application.applicationType}
                          size="small"
                          sx={getTypeColor(application.applicationType)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={application.status} size="small" sx={getStatusColor(application.status)} />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => handleMenuClick(e, index)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredApplications.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            itemName="applications"
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItemComponent onClick={handleViewApplication}>View</MenuItemComponent>
        {selectedApplication?.category === "Applied" && (
          <>
            {/* <MenuItemComponent onClick={handleAcceptApplication} sx={{ color: "success.main" }}>
              Accept
            <MenuItemComponent onClick={handleRejectApplication} sx={{ color: "error.main" }}>
              Reject
            </MenuItemComponent>
            <MenuItemComponent onClick={handleCancelApplication} sx={{ color: "error.main" }}>
              Cancel
            </MenuItemComponent> */}
          </>
        )}
      </Menu>

      {/* Modals */}
      {selectedApplication && (
        <>
          <ApplicationViewModal
            application={selectedApplication}
            open={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedApplication(null);
            }}
          />
          {actionModalData && (
            <ApplicationActionModal
              open={actionModalOpen}
              onClose={() => {
                setActionModalOpen(false);
                setActionModalData(null);
                setSelectedApplication(null);
              }}
              onConfirm={handleConfirmAction}
              title={actionModalData.title}
              message={actionModalData.message}
              confirmText={actionModalData.confirmText}
              confirmColor={actionModalData.confirmColor}
              application={selectedApplication}
            />
          )}
        </>
      )}
    </Box>
  );
}