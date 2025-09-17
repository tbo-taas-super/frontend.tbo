"use client";

import { useState } from "react";
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
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { expressInterest } from "@/@core/services/clientTalent";

interface UnifiedApplication {
  id: number;
  companyName: string;
  roleAppliedFor: string;
  dateOfApplication: string;
  applicationType: string;
  status: string;
  location: string | null;
  category: string;
  applicant_name?: string | null;
  talent_name?: string | null;
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
  job_title?: string;
  talent_id?: number;
  name?: string;
}

interface ApplicationViewModalProps {
  application: UnifiedApplication;
  open: boolean;
  onClose: () => void;
}

export function ApplicationViewModal({ application, open, onClose }: ApplicationViewModalProps) {
  const [interestNotes, setInterestNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);

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
      case "Recommended":
        return { bgcolor: "#F3E8FF", color: "#6B46C1" };
      case "Processing":
        return { bgcolor: "#FEF3C7", color: "#92400E" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Direct Hire":
      case "Direct Application":
        return { bgcolor: "#EFF6FF", color: "#1E40AF" };
      case "Recommendation":
        return { bgcolor: "#ECFDF5", color: "#065F46" };
      case "Contract":
      case "Interest":
        return { bgcolor: "#FEF3C7", color: "#92400E" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const handleExpressInterest = async () => {
    if (!application.talent_id || !application.job_id || !application.job_title) {
      console.log("Missing required fields:", { talent_id: application.talent_id, job_id: application.job_id, job_title: application.job_title });
      setError("Missing required fields for expressing interest");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await expressInterest(application.talent_id, {
        interested: true,
        interest_type: "existing_job",
        job_id: application.job_id,
        job_title: application.job_title,
        request_type: "Direct Hire",
        notes: interestNotes || application.professional_summary || undefined,
      });
      console.log("Express interest succeeded");
      setSuccessMessage("Interest expressed successfully!");
      setInterestNotes("");
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to express interest";
      console.error("Express interest failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (type: "success" | "error") => {
    console.log("Closing Snackbar:", type);
    if (type === "success") {
      setSuccessMessage(null);
    } else {
      setError(null);
    }
  };

  const toggleCandidateDetails = () => {
    setShowCandidateDetails((prev) => !prev);
  };

  const avatarSrc = application.companyLogo || application.profile_image || undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Application Details</span>
          <Button onClick={onClose} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64 }} src={avatarSrc}>
              {application.companyName[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {application.roleAppliedFor}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {application.companyName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.location || "Not specified"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Applied on {application.dateOfApplication}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Chip label={application.status} size="small" sx={getStatusColor(application.status)} />
                <Chip label={application.applicationType} size="small" sx={getTypeColor(application.applicationType)} />
              </Box>
              {application.skills && application.skills.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {application.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" variant="outlined" />
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Job Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <WorkIcon sx={{ color: "primary.main" }} />
                <Typography variant="subtitle2">Job Details</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {application.jobDescription}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md= {6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SalaryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {application.salary}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {application.location || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              {(application.cv_upload || application.cover_letter_upload) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Documents
                  </Typography>
                  {application.cv_upload && (
                    <Typography variant="body2">
                      <a href={application.cv_upload} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    </Typography>
                  )}
                  {application.cover_letter_upload && (
                    <Typography variant="body2">
                      <a href={application.cover_letter_upload} target="_blank" rel="noopener noreferrer">
                        View Cover Letter
                      </a>
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Candidate Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon sx={{ color: "primary.main" }} />
                  <Typography variant="subtitle2">Candidate Information</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    filter: application.category === "Recommended" && !showCandidateDetails ? "blur(4px)" : "blur(4px)",
                    userSelect: application.category === "Recommended" && !showCandidateDetails ? "none" : "none",
                  }}
                >
                  {application.category === "Applied"
                    ? application.applicant_name
                    : application.talent_name || application.name || "Unknown"}
                </Typography>
                {application.email && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        filter: application.category === "Recommended" && !showCandidateDetails ? "blur(4px)" : "blur(4px)",
                        userSelect: application.category === "Recommended" && !showCandidateDetails ? "none" : "none",
                      }}
                    >
                      {application.email}
                    </Typography>
                  </Box>
                )}
                {application.designation && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        filter: application.category === "Recommended" && !showCandidateDetails ? "blur(4px)" : "none",
                        userSelect: application.category === "Recommended" && !showCandidateDetails ? "none" : "auto",
                      }}
                    >
                      {application.designation}
                    </Typography>
                  </Box>
                )}
                {application.years_experience !== null && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        filter: application.category === "Recommended" && !showCandidateDetails ? "blur(4px)" : "none",
                        userSelect: application.category === "Recommended" && !showCandidateDetails ? "none" : "auto",
                      }}
                    >
                      {application.years_experience} years experience
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Application Notes or Professional Summary */}
          {(application.notes || application.professional_summary || application.applicationNotes) && (
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {application.category === "Recommended" ? "Professional Summary" : "Application Notes"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.notes || application.professional_summary || application.applicationNotes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        {application.category === "Recommended" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleExpressInterest}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "I am Interested"}
          </Button>
        )}
      </DialogActions>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => handleCloseSnackbar("success")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => handleCloseSnackbar("success")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => handleCloseSnackbar("error")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => handleCloseSnackbar("error")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

interface ApplicationActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: "primary" | "success" | "error";
  application: UnifiedApplication;
}

export function ApplicationActionModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = "primary",
  application,
}: ApplicationActionModalProps) {
  const [notes, setNotes] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {message}
          </Typography>
          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {application.roleAppliedFor}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.companyName}
            </Typography>
          </Box>
          <TextField
            label="Additional Notes (Optional)"
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional comments..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color={confirmColor} onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}