"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface InterestModalProps {
  open: boolean;
  onClose: () => void;
  onNewJob: () => void;
  onExistingJob: () => void;
  talentName: string;
}

export function InterestModal({ open, onClose, onNewJob, onExistingJob, talentName }: InterestModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Express Interest</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          How would you like to express interest in {talentName}?
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              onNewJob();
              toast.info("Selected interest for a new job", { toastId: "interest-new-job" });
            }}
            sx={{
              p: 2,
              justifyContent: "flex-start",
              textAlign: "left",
              border: "1px solid #E5E7EB",
              "&:hover": {
                bgcolor: "action.hover",
                border: "1px solid #E5E7EB",
              },
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "text.primary" }}>
                For a New Job
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Express general interest for future opportunities
              </Typography>
            </Box>
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              onExistingJob();
              toast.info("Selected interest for an existing job", { toastId: "interest-existing-job" });
            }}
            sx={{
              p: 2,
              justifyContent: "flex-start",
              textAlign: "left",
              border: "1px solid #E5E7EB",
              "&:hover": {
                bgcolor: "action.hover",
                border: "1px solid #E5E7EB",
              },
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "text.primary" }}>
                For an Existing Job
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a specific job opening for this talent
              </Typography>
            </Box>
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

interface NewJobMessageModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function NewJobMessageModal({ open, onClose, onContinue }: NewJobMessageModalProps) {
  const router = useRouter();

  const handleContinue = () => {
    onContinue();
    router.push("/dashboard/applications");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Post a New Job</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please, post a new job
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To express interest for a new position, you'll need to create a job posting first.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleContinue}>
          Go to Job Posting
        </Button>
      </DialogActions>
    </Dialog>
  );
}
