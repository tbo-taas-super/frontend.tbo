import React, { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid } from '@mui/material';
import CustomChip from '@/@core/component/mui/chip';

interface Job {
  id: number;
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  skill: string | string[]; // Handle both string and array
  currency: string;
  salary_type: string;
  minimum_salary: string;
  maximum_salary: string;
  location: string;
  application_deadline: string;
  additional_info: string | null;
  created_by: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  applicant_count: number;
  postingDate?: string; // Optional, as in original interface
  expirationDate?: string; // Optional, as in original interface
}

interface JobDetailsModalProps {
  open: boolean;
  close: () => void;
  job: Job | null;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ open, close, job }) => {
  if (!job) return null;

  // Parse skills: handle both JSON string and comma-separated string
  const skills = useMemo(() => {
    if (Array.isArray(job.skill)) return job.skill;
    if (!job.skill) return [];
    try {
      // Attempt to parse as JSON
      return JSON.parse(job.skill) as string[];
    } catch {
      // Fallback to splitting comma-separated string
      return job.skill.split(',').map((s) => s.trim()).filter((s) => s);
    }
  }, [job.skill]);

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="job-details-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="job-details-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{job.title}</Typography>
          <CustomChip
            label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            color={
              job.status.toLowerCase() === 'active' ? 'success' :
              job.status.toLowerCase() === 'pending' ? 'warning' :
              job.status.toLowerCase() === 'rejected' ? 'error' : 'default'
            }
            skin="light"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Job Type</Typography>
            <Typography variant="body1">{job.job_type}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Posting Date</Typography>
            <Typography variant="body1">{new Date(job.created_at).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
            <Typography variant="body1">{new Date(job.updated_at).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Application Deadline</Typography>
            <Typography variant="body1">{new Date(job.application_deadline).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Applicants</Typography>
            <Typography variant="body1">{job.applicant_count}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Location</Typography>
            <Typography variant="body1">{job.location}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Salary</Typography>
            <Typography variant="body1">
              {job.currency} {job.minimum_salary} - {job.maximum_salary} ({job.salary_type})
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Skills Required</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <CustomChip
                    key={index}
                    label={skill}
                    color="primary"
                    skin="light"
                    size="small"
                  />
                ))
              ) : (
                <Typography variant="body2">No skills specified</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
            <Typography variant="body1">{job.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Requirements</Typography>
            <Typography variant="body1">{job.requirements}</Typography>
          </Grid>
          {job.additional_info && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Additional Information</Typography>
              <Typography variant="body1">{job.additional_info}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobDetailsModal;