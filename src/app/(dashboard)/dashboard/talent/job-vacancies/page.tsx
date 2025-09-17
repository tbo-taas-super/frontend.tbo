"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Avatar,
  Link,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Bookmark as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { getJobs, Job } from "@/@core/services/jobVanciesService";
import { applyJob, saveJob } from "@/@core/services/jobVanciesService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { OpportunityDetailModal } from "@/@core/component/modals/opportunity-detail-modal";

interface Opportunity {
  id: string;
  title: string;
  job_type: string;
  location: string;
  currency: string;
  minimum_salary: number;
  maximum_salary: number;
  created_at: string;
  application_deadline: string;
  applicant_count?: number; // Optional, matches the error context
  description: string;
  additional_info?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  skill?: string;
  client?: {
    company_logo?: string;
    company_name?: string;
    industry?: string;
  };
}
interface ApplyJobModalProps {
  open: boolean;
  onClose: () => void;
  jobId: number | null;
  onApply: (jobId: number) => Promise<void>;
}

function ApplyJobModal({ open, onClose, jobId, onApply }: ApplyJobModalProps) {
  const router = useRouter();

  const handleApplyWithProfile = async () => {
    if (jobId !== null) {
      await onApply(jobId);
      onClose();
    } else {
      toast.error("Invalid job ID");
    }
  };

  const handleEditProfile = () => {
    router.push("/dashboard/talent/profile");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Apply for Job
          </Typography>
          <Button onClick={onClose} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Would you like to apply with your current profile or edit your profile before applying?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Button
            variant="outlined"
            onClick={handleEditProfile}
            sx={{
              flex: 1,
              color: "#E61C31",
              borderColor: "#E61C31",
              "&:hover": {
                borderColor: "#E61C31",
                bgcolor: "#FEF2F2",
              },
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyWithProfile}
            sx={{
              flex: 1,
              bgcolor: "#E61C31",
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Apply with Current Profile
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilters, setJobTypeFilters] = useState<string[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Freelance"];
  const locations = ["Hybrid", "Remote", "Onsite"];

useEffect(() => {
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const jobs: Job[] = await getJobs();
      const opportunities: Opportunity[] = jobs
        .map((job) => {
          const minSalary = parseFloat(job.minimum_salary);
          const maxSalary = parseFloat(job.maximum_salary);
          if (isNaN(minSalary) || isNaN(maxSalary)) {
            console.warn(`Invalid salary for job ${job.id}: min=${job.minimum_salary}, max=${job.maximum_salary}`);
            return null;
          }
          return {
            id: job.id.toString(),
            title: job.title,
            job_type: job.job_type,
            location: job.location,
            currency: job.currency,
            minimum_salary: minSalary,
            maximum_salary: maxSalary,
            created_at: job.created_at,
            application_deadline: job.application_deadline,
            applicant_count: job.applicant_count ?? undefined, // Ensure optional
            description: job.description,
            additional_info: job.additional_info || undefined,
            requirements: job.requirements || undefined,
            responsibilities: job.responsibilities || undefined,
            benefits: job.benefits || undefined,
            skill: job.skill || undefined,
            client: {
              company_logo: job.client.company_logo || undefined,
              company_name: job.client.company_name || undefined,
              industry: job.client.industry || undefined,
            },
          } as Opportunity; // Explicitly cast to Opportunity
        })
        .filter((job): job is Opportunity => job !== null);
      setOpportunities(opportunities);
    } catch (error: any) {
      console.error("Failed to fetch opportunities:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };
  fetchOpportunities();
}, []);

const filteredOpportunities = useMemo(() => {
  return opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.client?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJobType =
      jobTypeFilters.length === 0 ||
      jobTypeFilters.some((filter) => filter.toLowerCase() === opportunity.job_type.toLowerCase());
    const matchesLocation = locationFilters.length === 0 || locationFilters.includes(opportunity.location);

    return matchesSearch && matchesJobType && matchesLocation;
  });
}, [searchQuery, jobTypeFilters, locationFilters, opportunities]);
  const pageCount = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOpportunities, currentPage]);

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    if (checked) {
      setJobTypeFilters([...jobTypeFilters, jobType]);
    } else {
      setJobTypeFilters(jobTypeFilters.filter((type) => type !== jobType));
    }
    setCurrentPage(1);
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setLocationFilters([...locationFilters, location]);
    } else {
      setLocationFilters(locationFilters.filter((loc) => loc !== location));
    }
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setJobTypeFilters([]);
    setLocationFilters([]);
    setCurrentPage(1);
  };

  const clearJobTypes = () => {
    setJobTypeFilters([]);
    setCurrentPage(1);
  };

  const clearLocations = () => {
    setLocationFilters([]);
    setCurrentPage(1);
  };

  const handleCardClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOpportunity(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const id = parseInt(jobId, 10);
      if (isNaN(id)) {
        throw new Error("Invalid job ID");
      }
      await saveJob(id);
      toast.success("Job saved successfully!");
    } catch (error: any) {
      console.error("Failed to save job:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save job. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleApplyJob = (jobId: string) => {
    const id = parseInt(jobId, 10);
    if (isNaN(id)) {
      toast.error("Invalid job ID");
      return;
    }
    setSelectedJobId(id);
    setApplyModalOpen(true);
  };

  const handleApplyWithProfile = async (jobId: number) => {
    try {
      await applyJob(jobId);
      toast.success("Job application submitted successfully!");
    } catch (error: any) {
      console.error("Failed to apply for job:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to apply for job. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Find Your Dream Job
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Job Title, Company name or Anything"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            fullWidth
            sx={{ maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{
              color: "#E61C31",
              borderColor: "#E61C31",
              "&:hover": {
                borderColor: "#E61C31",
                bgcolor: "#FEF2F2",
              },
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#E61C31",
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ width: 280, flexShrink: 0 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Job Type
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={clearJobTypes}
                  sx={{
                    color: "#E61C31",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Clear
                </Link>
              </Box>
              <FormGroup>
                {jobTypes.map((jobType) => (
                  <FormControlLabel
                    key={jobType}
                    control={
                      <Checkbox
                        checked={jobTypeFilters.includes(jobType)}
                        onChange={(e) => handleJobTypeChange(jobType, e.target.checked)}
                        sx={{
                          color: "#E61C31",
                          "&.Mui-checked": {
                            color: "#E61C31",
                          },
                        }}
                      />
                    }
                    label={jobType}
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Location
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={clearLocations}
                  sx={{
                    color: "#E61C31",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Clear
                </Link>
              </Box>
              <FormGroup>
                {locations.map((location) => (
                  <FormControlLabel
                    key={location}
                    control={
                      <Checkbox
                        checked={locationFilters.includes(location)}
                        onChange={(e) => handleLocationChange(location, e.target.checked)}
                        sx={{
                          color: "#E61C31",
                          "&.Mui-checked": {
                            color: "#E61C31",
                          },
                        }}
                      />
                    }
                    label={location}
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 3,
            }}
          >
            {paginatedOpportunities.map((opportunity) => (
              <Card
                key={opportunity.id}
                onClick={() => handleCardClick(opportunity)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={opportunity.client?.company_logo || ""} sx={{ width: 48, height: 48 }}>
                        {opportunity.client?.company_name?.[0] || "C"}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#E61C31" }}>
                          {opportunity.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(opportunity.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {opportunity.title}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Chip
                      label={opportunity.job_type.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: "#FEF2F2",
                        color: "#E61C31",
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Salary: {opportunity.currency} {opportunity.minimum_salary} - {opportunity.maximum_salary}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {JSON.parse(opportunity.skill || "[]").map((skill: string, index: number) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {opportunity.description}
                  </Typography>

                  <Link
                    component="button"
                    variant="body2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(opportunity);
                    }}
                    sx={{
                      color: "#E61C31",
                      textDecoration: "none",
                      alignSelf: "flex-start",
                      mb: 3,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    View More
                  </Link>

                  <Box sx={{ mt: "auto" }}>
                    <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <WorkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {opportunity.job_type.toUpperCase()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <GroupIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {opportunity.applicant_count || 0} Applied
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {Math.ceil(
                            (new Date(opportunity.application_deadline).getTime() - new Date().getTime()) /
                              (1000 * 3600 * 24)
                          )}{" "}
                          Days Left
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<BookmarkIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveJob(opportunity.id);
                        }}
                        sx={{
                          bgcolor: "#E61C31",
                          "&:hover": {
                            bgcolor: "#DC2626",
                          },
                          flex: 1,
                        }}
                      >
                        Save Job
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyJob(opportunity.id);
                        }}
                        sx={{
                          bgcolor: "#E61C31",
                          "&:hover": {
                            bgcolor: "#DC2626",
                          },
                          flex: 1,
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {filteredOpportunities.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No opportunities found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          )}

          {filteredOpportunities.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                sx={{
                  color: "#E61C31",
                  borderColor: "#E61C31",
                  "&:hover": {
                    borderColor: "#E61C31",
                    bgcolor: "#FEF2F2",
                  },
                  "&.Mui-disabled": {
                    color: "#B0B0B0",
                    borderColor: "#B0B0B0",
                  },
                }}
              >
                Previous
              </Button>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#E61C31",
                    "&.Mui-selected": {
                      bgcolor: "#E61C31",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#DC2626",
                      },
                    },
                  },
                }}
              />
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextPage}
                disabled={currentPage === pageCount}
                sx={{
                  color: "#E61C31",
                  borderColor: "#E61C31",
                  "&:hover": {
                    borderColor: "#E61C31",
                    bgcolor: "#FEF2F2",
                  },
                  "&.Mui-disabled": {
                    color: "#B0B0B0",
                    borderColor: "#B0B0B0",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        open={modalOpen}
        onClose={handleCloseModal}
        onOpenApplyModal={setApplyModalOpen}
        setSelectedJobId={setSelectedJobId}
      />
      <ApplyJobModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        jobId={selectedJobId}
        onApply={handleApplyWithProfile}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}