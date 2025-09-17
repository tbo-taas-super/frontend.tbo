"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { fetchJobsClients } from "@/@core/services/jobService";

interface JobData {
  id: string;
  title: string;
  department: string;
}

interface JobSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (jobId: number) => void;
  selectedJob: string;
  onJobChange: (jobId: string) => void;
  talentName: string;
  jobs: JobData[]; // Add the jobs prop
}

export function JobSelectionModal({
  open,
  onClose,
  onContinue,
  selectedJob,
  onJobChange,
  talentName,
}: JobSelectionModalProps) {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const loadJobs = async () => {
        try {
          setLoading(true);
          const jobData = await fetchJobsClients();
          setJobs(jobData.jobs || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch jobs");
        } finally {
          setLoading(false);
        }
      };
      loadJobs();
    }
  }, [open]);

  const handleJobChange = (value: string) => {
    console.log("Job selected:", value);
    onJobChange(value);
  };

  const handleContinue = () => {
    if (selectedJob) {
      onContinue(Number(selectedJob)); // Convert to number
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Job</DialogTitle>
      <DialogContent>
        {loading && <Typography>Loading jobs...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Select the job you want to consider {talentName} for:
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
              Available jobs: {jobs.length}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Job</InputLabel>
              <Select
                value={selectedJob}
                label="Select Job"
                onChange={(e) => handleJobChange(e.target.value as string)}
              >
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <MenuItem key={job.id} value={job.id}>
                      {job.title} - {job.department}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No jobs available</MenuItem>
                )}
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleContinue} disabled={!selectedJob || loading}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}