"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { applyJob } from "@/@core/services/jobVanciesService";
import axios from "axios";

interface ApplicationFormModalProps {
  open: boolean;
  onClose: () => void;
  newApplication: boolean;
  jobId?: number;
}

export default function ApplicationFormModal({
  open,
  onClose,
  newApplication,
  jobId,
}: ApplicationFormModalProps) {
  const [step, setStep] = useState<"choice" | "submitting" | "submitted" | "alreadyApplied">("choice");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Auto-close modal after 3 seconds for submitted or alreadyApplied steps
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "submitted" || step === "alreadyApplied") {
      timer = setTimeout(() => {
        handleClose();
      }, 3000);
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [step]);

  const submitApplication = async () => {
    if (!jobId) {
      setError("Job ID is missing");
      setStep("choice");
      return;
    }

    setStep("submitting");
    try {
      await applyJob(jobId); // Call the provided applyJob service
      setStep("submitted");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setStep("alreadyApplied");
      } else {
        setError("Failed to submit application. Please try again.");
        setStep("choice");
      }
    }
  };

  const handleUseCurrentProfile = () => {
    submitApplication();
  };

  const handleEditProfile = () => {
    router.push("/dashboard/talent/profile"); // Redirect to profile page
    onClose(); // Close the modal
  };

  const handleClose = () => {
    setStep("choice");
    setError(null);
    onClose();
  };

  return (
  <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  {step === "choice" && (
    <>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
        Apply for Job
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body1" sx={{ textAlign: "center", mb: 3 }}>
          Would you like to use your current profile or edit your profile before applying?
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <Button
            onClick={handleUseCurrentProfile}
            variant="contained"
            size="large"
            sx={{
              width: "100%",
              maxWidth: 300,
              backgroundColor: "#E61C31",
              textTransform: "none",
              "&:hover": { backgroundColor: "#C8102E" },
            }}
          >
            Use Current Profile
          </Button>
          <Button
            onClick={handleEditProfile}
            variant="outlined"
            size="large"
            sx={{
              width: "100%",
              maxWidth: 300,
              color: "#E61C31",
              borderColor: "#E61C31",
              textTransform: "none",
              "&:hover": {
                borderColor: "#C8102E",
                backgroundColor: "#FFF5F5",
              },
            }}
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleClose}
            variant="text"
            size="small"
            sx={{ color: "text.secondary", mt: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </>
  )}

  {step === "submitting" && (
    <>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
        Submitting Application
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#E61C31" }} />
        </Box>
      </DialogContent>
    </>
  )}

  {step === "submitted" && (
    <>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
        Application Submitted
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", py: 3 }}>
        <Alert severity="success" icon={false}>
          <Typography variant="body1">
            🎉 Your profile has been successfully sent to the employer!
          </Typography>
        </Alert>
      </DialogContent>
    </>
  )}

  {step === "alreadyApplied" && (
    <>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
        Already Applied
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", py: 3 }}>
        <Alert severity="info" icon={false}>
          <Typography variant="body1">
            📩 You have already applied. Please wait to be contacted by the employer.
          </Typography>
        </Alert>
      </DialogContent>
    </>
  )}
</Dialog>

  );
}