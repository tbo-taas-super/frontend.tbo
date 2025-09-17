"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close, ContentCopy, Favorite } from "@mui/icons-material";
import Link from "next/link";
import { toast } from "react-toastify";
import { Job } from "@/@core/utils/job";

// Reuse getStatusColor function for consistency
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return { bgcolor: "#ECFDF5", color: "#065F46" };
    case "inactive":
      return { bgcolor: "#FEF2F2", color: "#991B1B" };
    case "rejected":
      return { bgcolor: "#FFFBEB", color: "#92400E" };
    default:
      return { bgcolor: "#F3F4F6", color: "#374151" };
  }
};

// Format salary with currency
const formatSalary = (min: number | string, max: number | string, currency: string, salaryType?: string) => {
  const minNum = typeof min === "string" ? parseFloat(min) : min;
  const maxNum = typeof max === "string" ? parseFloat(max) : max;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
  });
  return `${formatter.format(minNum)} - ${formatter.format(maxNum)} ${salaryType || "per year"}`;
};

// Format date
const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

// Check if application deadline has passed
const isDeadlinePassed = (deadline: string) => new Date(deadline) < new Date();

interface JobDetailsModalProps {
  open: boolean;
  job: Job | null;
  close: () => void;
  onApply?: (jobId: number) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ open, job, close, onApply }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (open && job) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open, job]);

  const handleCopy = () => {
    if (!job) return;
    const text = `
      Title: ${job.title}
      Type: ${job.job_type}
      Location: ${job.location}
      Salary: ${formatSalary(job.minimum_salary, job.maximum_salary, job.currency, job.salary_type)}
      Posting Date: ${job.postingDate}
      Expiration Date: ${job.expirationDate}
      Status: ${job.status}
      Applicants: ${job.applicant_count}
      Description: ${job.description}
      Requirements: ${job.requirements}
      Skills: ${job.skills.join(", ")}
      Additional Info: ${job.additional_info || "N/A"}
    `;
    navigator.clipboard.writeText(text.trim());
    setCopySuccess(true);
    toast.success("Job details copied to clipboard!");
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleApply = () => {
    if (job && onApply) {
      onApply(job.id);
      toast.info("Application process started!");
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!job) {
    return (
      <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">No job details available.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} variant="outlined" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="md"
      fullWidth
      aria-labelledby="job-details-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        },
      }}
    >
      <DialogTitle
        id="job-details-title"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: "#f5f5f5" }}
      >
        <Typography variant="h6" fontWeight="bold">
          Job Details
        </Typography>
        <IconButton aria-label="Close" onClick={close} sx={{ color: "#E61C31" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Profile Header */}
          <Box sx={{ bgcolor: "#f9f9f9", borderRadius: 1, p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {job.title.charAt(0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.job_type} • {job.applicant_count} Applicants
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span style={{ width: 6, height: 6, backgroundColor: "#10B981", borderRadius: "50%" }} />
                  Active
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Contact Information */}
          <Box sx={{ bgcolor: "#f9f9f9", borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Job Details
            </Typography>
            <Typography variant="body2">
              <strong>Location:</strong> {job.location}
            </Typography>
            <Typography variant="body2">
              <strong>Salary:</strong> {formatSalary(job.minimum_salary, job.maximum_salary, job.currency, job.salary_type)}
            </Typography>
            <Typography variant="body2">
              <strong>Posting Date:</strong> {job.postingDate}
            </Typography>
            <Typography variant="body2">
              <strong>Expiration Date:</strong> {job.expirationDate}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              More details available after applying
            </Typography>
          </Box>

          {/* Professional Summary */}
          <Box sx={{ bgcolor: "#f9f9f9", borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {job.description || "No description provided."}
            </Typography>
          </Box>

          {/* Skills */}
          <Box sx={{ bgcolor: "#f9f9f9", borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" sx={{ bgcolor: "#f0f0f0" }} />
                ))
              ) : (
                <Typography variant="body2">No skills listed.</Typography>
              )}
            </Box>
          </Box>

          {/* Additional Info */}
          <Box sx={{ bgcolor: "#f9f9f9", borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Additional Info
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {job.additional_info || "No additional information provided."}
            </Typography>
          </Box>
        </Box>

        {/* Copy Button */}
        {/* <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton aria-label="Copy job details" onClick={handleCopy} sx={{ color: "text.secondary" }}>
            <ContentCopy />
          </IconButton>
          {copySuccess && (
            <Alert severity="success" sx={{ ml: 1 }}>
              Copied to clipboard!
            </Alert>
          )}
        </Box> */}
      </DialogContent>
     
    </Dialog>
  );
};

export default JobDetailsModal;