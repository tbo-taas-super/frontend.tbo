"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Description as AllIcon,
  Send as AppliedIcon,
  Mail as InvitedIcon,
  Recommend as RecommendedIcon,
  Search as SearchIcon,
  MoreHoriz as MoreHorizIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchApplicationById, activateJob, rejectJob, deleteJob } from "@/@core/services/jobService";
import DocumentUpload from "../components/document-upload";

interface FileData {
  url: string;
  name: string;
  type: string;
}

interface JobApplication {
  id: number;
  job_id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  job: {
    id: number;
    title: string;
    job_type: string;
    description: string;
    requirements: string;
    skill: string;
    currency: string;
    minimum_salary: string;
    maximum_salary: string;
    location: string;
    application_deadline: string;
    additional_info: string | null;
    status: string;
    client_id: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string | null;
    profile_image: string | null;
    cv_upload: string | null;
    cover_letter_upload: string | null;
    video_url: string | null;
    project_screenshots: string[] | null;
    portfolio_link: string | null;
  };
}

const StatsCard = ({ title, value, icon: Icon, color, bgcolor }: { title: string; value: string; icon: any; color: string; bgcolor: string }) => (
  <Card sx={{ bgcolor, p: 2, border: "none" }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Icon sx={{ color, fontSize: 40 }} />
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const usePagination = ({ data, itemsPerPage }: { data: any[]; itemsPerPage: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePrevious: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    handleNext: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
  };
};

const CustomPagination = ({ currentPage, totalPages, totalItems, onPrevious, onNext, itemName }: any) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
    <Typography variant="body2" color="text.secondary">
      Showing {totalItems > 0 ? (currentPage - 1) * 10 + 1 : 0}-
      {Math.min(currentPage * 10, totalItems)} of {totalItems} {itemName}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton disabled={currentPage === 1} onClick={onPrevious}>
        <ChevronLeft />
      </IconButton>
      <Typography variant="body2">{currentPage}</Typography>
      <IconButton disabled={currentPage === totalPages} onClick={onNext}>
        <ChevronRight />
      </IconButton>
    </Box>
  </Box>
);

const ApplicationViewModal = ({ application, open, onClose }: any) => {
  const extractFileInfo = (url: string | null, defaultName: string, defaultType: string): FileData | null => {
    if (!url) return null;
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    let fileName = lastPart || defaultName;
    let fileType = defaultType;
    if (fileName.includes(".")) {
      const extension = fileName.split(".").pop()?.toLowerCase();
      if (extension === "pdf") {
        fileType = "application/pdf";
      } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
        fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      }
    } else {
      fileName = defaultName;
    }
    return { url, name: fileName, type: fileType };
  };

  const filePreviews = {
    cv_upload: extractFileInfo(application?.user.cv_upload, "CV-Resume.pdf", "application/pdf"),
    cover_letter_upload: extractFileInfo(application?.user.cover_letter_upload, "Cover-Letter.pdf", "application/pdf"),
  };

  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Candidate Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Typography variant="h6">Applicant Information</Typography>
          <Typography><strong>Name:</strong> {application.user.name}</Typography>
          <Typography><strong>Email:</strong> {application.user.email}</Typography>
          <Typography><strong>Phone Number:</strong> {application.user.phone_number || "Not provided"}</Typography>
          <Box>
            <Typography><strong>CV:</strong></Typography>
            {filePreviews.cv_upload ? (
              <DocumentUpload
                label="CV/Resume"
                accept="application/pdf,.doc,.docx"
                fileData={filePreviews.cv_upload}
                onChange={() => {}} 
                onRemove={() => {}}
                description="View CV (PDF, DOC, DOCX)"
              />
            ) : (
              <Typography>Not provided</Typography>
            )}
          </Box>
          <Box>
            <Typography><strong>Cover Letter:</strong></Typography>
            {filePreviews.cover_letter_upload ? (
              <DocumentUpload
                label="Cover Letter"
                accept="application/pdf,.doc,.docx"
                fileData={filePreviews.cover_letter_upload}
                onChange={() => {}}
                onRemove={() => {}}
                description="View Cover Letter (PDF, DOC, DOCX)"
              />
            ) : (
              <Typography>Not provided</Typography>
            )}
          </Box>
          <Typography>
            <strong>Portfolio Link:</strong>{" "}
            {application.user.portfolio_link ? (
              <a href={application.user.portfolio_link} target="_blank" rel="noopener" style={{ color: "#E61C31" }}>
                View Portfolio
              </a>
            ) : (
              "Not provided"
            )}
          </Typography>
          <Typography>
            <strong>Project Screenshots:</strong>
            {application.user.project_screenshots && application.user.project_screenshots.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {application.user.project_screenshots.map((screenshot: string, index: number) => (
                  <a key={index} href={screenshot} target="_blank" rel="noopener">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </a>
                ))}
              </Box>
            ) : (
              " None"
            )}
          </Typography>
          <Typography>
            <strong>Video:</strong>{" "}
            {application.user.video_url ? (
              <a href={application.user.video_url} target="_blank" rel="noopener" style={{ color: "#E61C31" }}>
                View Video
              </a>
            ) : (
              "Not provided"
            )}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Job Information</Typography>
          <Typography><strong>Job Title:</strong> {application.job.title}</Typography>
          <Typography><strong>Job Type:</strong> {application.job.job_type}</Typography>
          <Typography><strong>Description:</strong> {application.job.description}</Typography>
          <Typography><strong>Requirements:</strong> {application.job.requirements}</Typography>
          <Typography>
            <strong>Salary:</strong> {application.job.currency} {application.job.minimum_salary} - {application.job.maximum_salary}
          </Typography>
          <Typography><strong>Location:</strong> {application.job.location}</Typography>
          <Typography><strong>Application Deadline:</strong> {new Date(application.job.application_deadline).toLocaleDateString("en-GB")}</Typography>
          <Typography><strong>Additional Info:</strong> {application.job.additional_info || "Not provided"}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ApplicationActionModal = ({ open, onClose, onConfirm, title, message, confirmText, confirmColor }: any) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color={confirmColor} variant="contained">{confirmText}</Button>
    </DialogActions>
  </Dialog>
);

const JobApplicationsTable = ({ params }: { params: { id?: string } }) => {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
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

  const statusFilters = ["All", "Pending", "Shortlisted", "Interviewed", "Hired"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!params.id || isNaN(parseInt(params.id, 10))) {
          setError("Invalid or missing job ID");
          setData([]);
          toast.error("Invalid or missing job ID");
          return;
        }

        const response = await fetchApplicationById(params.id);
        let applications: JobApplication[] = [];
        if (Array.isArray(response)) {
          applications = response;
        } else if (response?.status && response?.application) {
          applications = [response.application];
        } else if (response) {
          applications = [response];
        }
        setData(applications.map(app => ({
          ...app,
          created_at: new Date(app.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        })));
      } catch (err) {
        setError("Failed to load applications. Please try again.");
        toast.error("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const stats = [
    {
      title: "All Applications",
      value: data.length.toString(),
      icon: AllIcon,
      color: "#3B82F6",
      bgcolor: "#EFF6FF",
    },
    {
      title: "Pending",
      value: data.filter((a) => a.status.toUpperCase() === "PENDING").length.toString(),
      icon: AppliedIcon,
      color: "#10B981",
      bgcolor: "#ECFDF5",
    },
    {
      title: "Interviewed",
      value: data.filter((a) => a.status.toUpperCase() === "INTERVIEWED").length.toString(),
      icon: InvitedIcon,
      color: "#F59E0B",
      bgcolor: "#FFFBEB",
    },
    {
      title: "Hired",
      value: data.filter((a) => a.status.toUpperCase() === "HIRED").length.toString(),
      icon: RecommendedIcon,
      color: "#8B5CF6",
      bgcolor: "#F3E8FF",
    },
  ];

  const filteredApplications = useMemo(() => {
    return data.filter((application) => {
      const matchesSearch =
        `Client ${application.job.client_id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || application.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const { currentPage, totalPages, paginatedData, handlePrevious, handleNext } = usePagination({
    data: filteredApplications,
    itemsPerPage: 10,
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplicationIndex(index);
    setSelectedApplication(paginatedData[index]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplicationIndex(null);
    setSelectedApplication(null);
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

  const handleConfirmAction = async () => {
    if (selectedApplication && actionModalData) {
      try {
        let updatedApplication: JobApplication;
        switch (actionModalData.action) {
          case "accept":
            updatedApplication = await activateJob(selectedApplication.id);
            toast.success("Application accepted successfully!");
            break;
          case "reject":
            updatedApplication = await rejectJob(selectedApplication.id);
            toast.success("Application rejected successfully!");
            break;
          case "cancel":
            updatedApplication = await deleteJob(selectedApplication.id);
            toast.success("Application canceled successfully!");
            break;
          default:
            return;
        }
        setData((prev) =>
          prev.map((app) =>
            app.id === selectedApplication.id ? { ...app, status: updatedApplication.status } : app
          )
        );
      } catch (error) {
        toast.error(`Failed to ${actionModalData.action} application. Please try again.`);
      }
    }
    setActionModalOpen(false);
    setActionModalData(null);
    setSelectedApplication(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "HIRED":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "INTERVIEWED":
        return { bgcolor: "#F0F9FF", color: "#0C4A6E" };
      case "SHORTLISTED":
        return { bgcolor: "#FFFBEB", color: "#92400E" };
      case "PENDING":
        return { bgcolor: "#F3F4F6", color: "#374151" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Direct Application":
        return { bgcolor: "#EFF6FF", color: "#1E40AF" };
      case "Recommendation":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "Interest":
        return { bgcolor: "#FEF3C7", color: "#92400E" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (data.length === 0) {
    return (
      <Card sx={{ my: 2, p: 3, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Applications Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            It looks like no one has applied for this job yet. Check back later.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Job Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage job applications
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder="Search by client, role, or applicant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ width: { xs: "100%", sm: 300 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
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
                  <TableCell>Applicant Name</TableCell>
                  <TableCell>Client</TableCell>
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
                    <TableCell colSpan={7} align="center">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((application: JobApplication, index: number) => (
                    <TableRow key={application.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{application.user.name}</TableCell>
                      <TableCell>Client {application.job.client_id}</TableCell>
                      <TableCell>{application.job.title}</TableCell>
                      <TableCell>{application.created_at}</TableCell>
                      <TableCell>
                        <Chip
                          label="Direct Application"
                          size="small"
                          sx={getTypeColor("Direct Application")}
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItemComponent onClick={handleViewApplication}>View Details</MenuItemComponent>
        <MenuItemComponent onClick={handleAcceptApplication} sx={{ color: "success.main" }}>
          Accept
        </MenuItemComponent>
        <MenuItemComponent onClick={handleRejectApplication} sx={{ color: "error.main" }}>
          Reject
        </MenuItemComponent>
        <MenuItemComponent onClick={handleCancelApplication} sx={{ color: "error.main" }}>
          Cancel
        </MenuItemComponent>
      </Menu>

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
            />
          )}
        </>
      )}
    </Box>
  );
};

export default JobApplicationsTable;