"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
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
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchJobsClients,
  fetchJobsclinetsById,
  deleteJobById,
  editJobClient,
} from "@/@core/services/jobService";
import PostJobModal from "./PostJobModal";
import EditJobModal from "./EditJobModal";
import JobDetailsModal from "./JobDetailsModal";
import ConfirmDialog from "./ConfirmDialog";
import { Job } from "@/@core/utils/job"


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


const JobListTable = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [openPostJobModal, setOpenPostJobModal] = useState(false);
  const [openEditJobModal, setOpenEditJobModal] = useState(false);
  const [openJobDetailsModal, setOpenJobDetailsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);

const stats = [
  {
    title: "Total Openings",
    value: jobs.length.toString(),
    icon: WorkIcon,
    color: "#10B981",
    bgcolor: "#ECFDF5",
  },
  {
    title: "Applications",
    value: jobs.reduce((sum, job) => sum + job.applicant_count, 0).toString(),
    icon: DescriptionIcon,
    color: "#8B5CF6",
    bgcolor: "#F3E8FF",
  },
  {
    title: "Active Jobs",
    value: jobs.filter((job) => job.status.toLowerCase() === "active").length.toString(),
    icon: ActiveIcon,
    color: "#F59E0B",
    bgcolor: "#FFFBEB",
  },
  {
    title: "Pending Jobs",
    value: jobs.filter((job) => job.status.toLowerCase() === "pending").length.toString(),
    icon: InactiveIcon, // You can replace with a more suitable icon if needed
    color: "#3B82F6",
    bgcolor: "#EFF6FF",
  },
  {
    title: "Rejected Jobs",
    value: jobs.filter((job) => job.status.toLowerCase() === "rejected").length.toString(),
    icon: InactiveIcon, // You can replace with a more suitable icon if needed
    color: "#EF4444",
    bgcolor: "#FEF2F2",
  },
];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobsClients();
        if (response.status && Array.isArray(response.jobs)) {
          const jobsWithDates = response.jobs.map((job: Job) => ({
            ...job,
            postingDate: new Date(job.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            expirationDate: new Date(job.application_deadline).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }));
          setJobs(jobsWithDates);
        } else {
          setJobs([]);
          toast.error("No jobs found");
        }
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
        toast.error("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const { currentPage, totalPages, paginatedData, handlePrevious, handleNext } = usePagination({
    data: filteredJobs,
    itemsPerPage: 10,
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, jobId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJobId(null);
  };

  const handleOpenDeleteDialog = (jobId: number) => {
    setJobToDelete(jobId);
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete !== null) {
      try {
        const response = await deleteJobById(jobToDelete);
        if (response.status) {
          toast.success("Job deleted successfully!");
          const updatedJobs = jobs.filter((job) => job.id !== jobToDelete);
          setJobs(updatedJobs);
        }
      } catch (error) {
        toast.error("Failed to delete job. Please try again.");
      }
      setConfirmDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleOpenModal = () => setOpenPostJobModal(true);
  const handleCloseModal = () => setOpenPostJobModal(false);

  const handleOpenEditModal = (job: Job) => {
    setSelectedJob(job);
    setOpenEditJobModal(true);
    handleMenuClose();
  };

  const handleOpenJobDetailsModal = (job: Job) => {
    setSelectedJob(job);
    setOpenJobDetailsModal(true);
    handleMenuClose();
  };

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? { ...updatedJob, postingDate: new Date(updatedJob.created_at).toLocaleDateString("en-GB"), expirationDate: new Date(updatedJob.application_deadline).toLocaleDateString("en-GB") } : job))
    );
    toast.success("Job updated successfully!");
  };

 const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return { bgcolor: "#ECFDF5", color: "#065F46" };
    case "pending":
      return { bgcolor: "#EFF6FF", color: "#1E40AF" };
    case "rejected":
      return { bgcolor: "#FEF2F2", color: "#991B1B" };
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Job List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See the openings you have
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Job List Section */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Search and Filters */}
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
              <Typography variant="h5">Job List</Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredJobs.length}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder="Search by job title, type, or location..."
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
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                sx={{ bgcolor: "primary.main" }}
                onClick={handleOpenModal}
              >
                Post a Job
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                <TableRow>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Posting Date</TableCell>
                  <TableCell>Expiration Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No jobs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((job: Job) => (
                    <TableRow key={job.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{job.id}</TableCell>
                      <TableCell>
                        {/* <Link
                          href={`/dashboard/applications/${job.id}`}
                          style={{
                            textDecoration: "none",
                            color: "#E61C31",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        > */}
                          {job.title}
                        {/* </Link> */}
                      </TableCell>
                      <TableCell>{job.applicant_count}</TableCell>
                      <TableCell>{job.postingDate}</TableCell>
                      <TableCell>{job.expirationDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          size="small"
                          sx={getStatusColor(job.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => handleMenuClick(e, job.id)}>
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
            totalItems={filteredJobs.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            itemName="jobs"
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {
          const job = jobs.find((j) => j.id === selectedJobId);
          if (job) handleOpenJobDetailsModal(job);
        }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          const job = jobs.find((j) => j.id === selectedJobId);
          if (job) handleOpenEditModal(job);
        }}>
          Edit Job
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedJobId !== null) handleOpenDeleteDialog(selectedJobId);
        }}>
          Delete Job
        </MenuItem>
        {/* <MenuItem>
          <Link href={`/dashboard/applications/${selectedJobId}`} style={{ textDecoration: "none", color: "inherit" }}>
            View Applications
          </Link>
        </MenuItem> */}
      </Menu>

      {/* Modals */}
      <PostJobModal
        open={openPostJobModal}
        close={handleCloseModal}
        onJobCreated={async () => {
          try {
            const response = await fetchJobsClients();
            if (response.status && Array.isArray(response.jobs)) {
              const jobsWithDates = response.jobs.map((job: Job) => ({
                ...job,
                postingDate: new Date(job.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                expirationDate: new Date(job.application_deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
              }));
              setJobs(jobsWithDates);
              toast.success("Job posted successfully!");
            }
          } catch (error) {
            toast.error("Failed to refresh job list.");
          }
        }}
      />
      <EditJobModal
        open={openEditJobModal}
        job={selectedJob}
        close={() => {
          setOpenEditJobModal(false);
          setSelectedJob(null);
        }}
        onJobUpdated={handleJobUpdated}
      />
      <JobDetailsModal
        open={openJobDetailsModal}
        job={selectedJob}
        close={() => {
          setOpenJobDetailsModal(false);
          setSelectedJob(null);
        }}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Job?"
        description="Are you sure you want to delete this job? This action cannot be undone."
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default JobListTable;