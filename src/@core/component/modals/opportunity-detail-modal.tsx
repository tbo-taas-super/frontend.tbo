"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchJobsClientsById } from "@/@core/services/jobService";
import { applyJob, saveJob } from "@/@core/services/jobVanciesService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Job } from "@/@core/services/jobVanciesService";

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
  applicant_count?: number;
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

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
  onOpenApplyModal: (open: boolean) => void;
  setSelectedJobId: (jobId: number | null) => void;
}

export function OpportunityDetailModal({
  opportunity: initialOpportunity,
  open,
  onClose,
  onOpenApplyModal,
  setSelectedJobId,
}: OpportunityDetailModalProps) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (initialOpportunity?.id) {
        try {
          setLoading(true);
          const data = await fetchJobsClientsById(initialOpportunity.id);
          const job: Job = data.job;
          const mappedOpportunity: Opportunity = {
            id: job.id.toString(),
            title: job.title,
            job_type: job.job_type,
            location: job.location,
            currency: job.currency,
            minimum_salary: parseFloat(job.minimum_salary),
            maximum_salary: parseFloat(job.maximum_salary),
            created_at: job.created_at,
            application_deadline: job.application_deadline,
            applicant_count: job.applicant_count,
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
          };
          setOpportunity(mappedOpportunity);
        } catch (error) {
          console.error("Failed to fetch job details:", error);
          toast.error("Failed to load job details.");
        } finally {
          setLoading(false);
        }
      } else {
        setOpportunity(initialOpportunity);
      }
    };
    fetchJobDetails();
  }, [initialOpportunity]);

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography>Loading job details...</Typography>
        </DialogContent>
        <ToastContainer />
      </Dialog>
    );
  }

  if (!opportunity) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography>No job details available.</Typography>
        </DialogContent>
        <ToastContainer />
      </Dialog>
    );
  }

  const requirements = opportunity.requirements?.split("\n").filter((req: string) => req.trim()) || [];
  const responsibilities = opportunity.responsibilities?.split("\n").filter((resp: string) => resp.trim()) || [];
  const benefits = opportunity.benefits?.split("\n").filter((ben: string) => ben.trim()) || [];

  const handleSaveJob = async () => {
    if (opportunity.id) {
      try {
        const id = parseInt(opportunity.id, 10);
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
    }
  };

  const handleApplyJob = () => {
    if (opportunity.id) {
      const id = parseInt(opportunity.id, 10);
      if (isNaN(id)) {
        toast.error("Invalid job ID");
        return;
      }
      setSelectedJobId(id);
      onOpenApplyModal(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Job Details
          </Typography>
          <Button onClick={onClose} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Card sx={{ mb: 3, bgcolor: "#FEF2F2" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                <Avatar src={opportunity.client?.company_logo || ""} sx={{ width: 80, height: 80 }}>
                  {opportunity.client?.company_name?.[0] || "C"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: "#E61C31" }}>
                    {opportunity.title}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WorkIcon sx={{ fontSize: 20, color: "#E61C31" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Job Type
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {opportunity.job_type}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 20, color: "#E61C31" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {opportunity.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SalaryIcon sx={{ fontSize: 20, color: "#E61C31" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Salary
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {opportunity.currency} {opportunity.minimum_salary} - {opportunity.maximum_salary}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 20, color: "#E61C31" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Posted
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {new Date(opportunity.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#E61C31" }}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, color: "text.secondary" }}>
                {opportunity.description}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, color: "text.secondary", mt: 2 }}>
                {opportunity.additional_info || "No additional information provided."}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#E61C31" }}>
                Skills Required
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {JSON.parse(opportunity.skill || "[]").map((skill: string, index: number) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="outlined"
                    sx={{
                      borderColor: "#E61C31",
                      color: "#E61C31",
                      "&:hover": {
                        bgcolor: "#FEF2F2",
                      },
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#E61C31" }}>
                Requirements
              </Typography>
              <List dense>
                {requirements.map((requirement, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: "#10B981" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={requirement}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#E61C31" }}>
                Responsibilities
              </Typography>
              <List dense>
                {responsibilities.map((responsibility, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: "#3B82F6" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={responsibility}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#E61C31" }}>
                Benefits
              </Typography>
              <List dense>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#E61C31" }}>
                About the Role
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <BusinessIcon sx={{ color: "#E61C31" }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {opportunity.client?.industry || "Unknown Department"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Professional Development Opportunity
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {opportunity.additional_info || "No additional information provided."}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Button
            variant="outlined"
            startIcon={<BookmarkIcon />}
            onClick={handleSaveJob}
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
            Save Job
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyJob}
            sx={{
              flex: 1,
              bgcolor: "#E61C31",
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Apply Now
          </Button>
        </Box>
      </DialogActions>
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
    </Dialog>
  );
}