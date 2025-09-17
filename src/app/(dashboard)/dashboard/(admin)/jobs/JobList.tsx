"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
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
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fetchJobs, activateJob, rejectJob, deleteJob } from "@/@core/services/jobService"
import JobDetailsModal from "./JobDetailsModal"
import NewJob from "./NewJob"

interface Job {
  id: number
  title: string
  job_type: string
  description: string
  requirements: string
  skill: string
  currency: string
  salary_type: string
  minimum_salary: string
  maximum_salary: string
  location: string
  application_deadline: string
  additional_info: string | null
  created_by: number
  client_id: number
  created_at: string
  updated_at: string
  status: string
  applicant_count: number
  applications: { id: number; name: string; status: string }[]
  postingDate?: string
  expirationDate?: string
}

const stats = [
  {
    title: "Total Openings",
    value: "0", // Will be updated dynamically
    icon: WorkIcon,
    color: "#10B981",
    bgcolor: "#ECFDF5",
  },
  {
    title: "Applications",
    value: "0", // Will be updated dynamically
    icon: DescriptionIcon,
    color: "#8B5CF6",
    bgcolor: "#F3E8FF",
  },
  {
    title: "Shortlisted",
    value: "0", // Will be updated dynamically
    icon: PeopleIcon,
    color: "#F59E0B",
    bgcolor: "#FFFBEB",
  },
  {
    title: "Hired",
    value: "0", 
    icon: PersonAddIcon,
    color: "#EF4444",
    bgcolor: "#FEF2F2",
  },
]

export default function JobApplications() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<number | null>(null)
  const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [postJobModalOpen, setPostJobModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(5)

  // Fetch jobs on mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const response = await fetchJobs()
        if (response && Array.isArray(response.jobs)) {
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
          }))
          setJobs(jobsWithDates)
          setFilteredJobs(jobsWithDates)
        } else {
          setJobs([])
          setFilteredJobs([])
          toast.error("No jobs found")
        }
      } catch (err) {
        setError("Failed to load jobs. Please try again.")
        toast.error("Failed to load jobs. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  // Update stats based on jobs
  useEffect(() => {
    stats[0].value = jobs.length.toString()
    stats[1].value = jobs.reduce((sum, job) => sum + job.applicant_count, 0).toString()
    stats[2].value = jobs
      .flatMap((job) => job.applications)
      .filter((app) => app.status === "Shortlisted").length.toString()
    stats[3].value = jobs
      .flatMap((job) => job.applications)
      .filter((app) => app.status === "Hired").length.toString()
  }, [jobs])

  // Filter jobs based on search query
  useEffect(() => {
    const result = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredJobs(result)
  }, [searchQuery, jobs])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(filteredJobs.map((job) => job.id.toString()))
    } else {
      setSelectedJobs([])
    }
  }

  const handleSelectJob = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs([...selectedJobs, id])
    } else {
      setSelectedJobs(selectedJobs.filter((jobId) => jobId !== id))
    }
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, jobId: number) => {
    setAnchorEl(event.currentTarget)
    setSelectedJobId(jobId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedJobId(null)
  }

  const handleOpenDeleteDialog = (jobId: number) => {
    setJobToDelete(jobId)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setJobToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (jobToDelete !== null) {
      try {
        await deleteJob(jobToDelete)
        toast.success("Job deleted successfully!")
        const updatedJobs = jobs.filter((job) => job.id !== jobToDelete)
        setJobs(updatedJobs)
        setFilteredJobs(updatedJobs)
      } catch (error) {
        toast.error("Failed to delete job. Please try again.")
      }
    }
    handleCloseDeleteDialog()
  }

  const handleApproveJob = async (jobId: number) => {
    try {
      await activateJob(jobId)
      toast.success("Job approved successfully!")
      const updatedJobs = jobs.map((job) =>
        job.id === jobId ? { ...job, status: "active" } : job
      )
      setJobs(updatedJobs)
      setFilteredJobs(updatedJobs)
      handleMenuClose()
    } catch (error) {
      toast.error("Failed to approve job. Please try again.")
    }
  }

  const handleRejectJob = async (jobId: number) => {
    try {
      await rejectJob(jobId)
      toast.success("Job rejected successfully!")
      const updatedJobs = jobs.map((job) =>
        job.id === jobId ? { ...job, status: "rejected" } : job
      )
      setJobs(updatedJobs)
      setFilteredJobs(updatedJobs)
      handleMenuClose()
    } catch (error) {
      toast.error("Failed to reject job. Please try again.")
    }
  }

  const toggleJobDetailsModal = (job: Job | null) => {
    setSelectedJob(job)
    setJobDetailsModalOpen(!jobDetailsModalOpen)
    handleMenuClose()
  }

  const togglePostJobModal = () => {
    setPostJobModalOpen(!postJobModalOpen)
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  if (loading) return <Typography>Loading...</Typography>
  if (error) return <Typography>{error}</Typography>

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
            <Card sx={{ bgcolor: stat.bgcolor, border: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      color: stat.color,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Job List Section */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Search and Actions */}
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
                placeholder="Job Title, Company name or Anything"
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
              <Button variant="outlined" startIcon={<FilterIcon />} size="small">
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                sx={{ bgcolor: "primary.main" }}
                onClick={togglePostJobModal}
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedJobs.length === filteredJobs.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Posting Date</TableCell>
                  <TableCell>Expiring Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedJobs.includes(job.id.toString())}
                          onChange={(e) => handleSelectJob(job.id.toString(), e.target.checked)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{job.id}</TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          style={{
                            textDecoration: "none",
                            color: "#E61C31",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>{job.applicant_count}</TableCell>
                      <TableCell>{job.postingDate}</TableCell>
                      <TableCell>{job.expirationDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          color={
                            job.status === "active"
                              ? "success"
                              : job.status === "pending"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                          sx={{
                            bgcolor:
                              job.status === "active"
                                ? "#ECFDF5"
                                : job.status === "pending"
                                ? "#FFFBEB"
                                : "#FEF2F2",
                            color:
                              job.status === "active"
                                ? "#065F46"
                                : job.status === "pending"
                                ? "#92400E"
                                : "#991B1B",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => handleMenuClick(e, job.id)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Pagination
              count={Math.ceil(filteredJobs.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(filteredJobs.length / rowsPerPage)))}
              disabled={page === Math.ceil(filteredJobs.length / rowsPerPage)}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            const job = jobs.find((j) => j.id === selectedJobId)
            if (job) toggleJobDetailsModal(job)
          }}
        >
          View Details
        </MenuItem>
        <MenuItem onClick={() => alert("Edit Job functionality not implemented")}>Edit Job</MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedJobId !== null) handleOpenDeleteDialog(selectedJobId)
          }}
        >
          Delete Job
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedJobId !== null) handleApproveJob(selectedJobId)
          }}
        >
          Approve
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedJobId !== null) handleRejectJob(selectedJobId)
          }}
        >
          Reject
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          open={jobDetailsModalOpen}
          close={() => toggleJobDetailsModal(null)}
          job={selectedJob}
        />
      )}

      {/* Post Job Modal */}
      <NewJob
        open={postJobModalOpen}
        close={togglePostJobModal}
        onJobCreated={async () => {
          const response = await fetchJobs()
          if (response && Array.isArray(response.jobs)) {
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
            }))
            setJobs(jobsWithDates)
            setFilteredJobs(jobsWithDates)
          }
        }}
      />
    </Box>
  )
}