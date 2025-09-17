// *React Imports
import React, { useState, useEffect } from "react";

// *Icon Imports
import Icon from "@/@core/component/icon";

// *Custom Component Imports
import StyledImage from "@/@core/component/mui/image";
import CustomChip from "@/@core/component/mui/chip";

import Google from "../../../../../../public/google.png";

// *MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { fetchJobsById } from "@/@core/services/jobService"; 
interface Props {
  open: boolean;
  close: () => void;
  jobId: string; // Pass the job ID
}


const JobDialog = ({ open, close, jobId }: Props) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchJobDetails = async () => {
      if (open && jobId) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchJobsById(jobId); // Pass jobId to fetch function
          setJob(data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch job details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobDetails();
  }, [open, jobId]);

    // Log the job details to the console here to check its structure
    console.log("Job Details:", job);


  if (loading) {
    return (
      <Dialog open={open}>
        <DialogContent>Loading...</DialogContent>
      </Dialog>
    );
  }
  if (error) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <Typography color="error">{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          minWidth: { md: 800 },
          borderRadius: "8px",
          mx: "auto",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", p: 3 }}>
        <Button onClick={close} sx={{ color: "#111" }}>
          <Icon icon="basil:caret-left-solid" fontSize={25} />
        </Button>
  
        <Typography
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: 600,
            fontSize: { xs: "1rem", md: "1.2rem" },
            mr: "4rem",
          }}
        >
          Job Details
        </Typography>
      </Box>
  
      <DialogContent>
        {job && job.job ? (
          <Box>
            {/* Job Title */}
            <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: 500 }}>
              {job.job.title || "Job Title"}
            </Typography>
  
            {/* Job Description */}
            <Typography sx={{ fontSize: "0.85rem", mt: 2 }}>
              {job.job.description || "No description available"}
            </Typography>
  
            {/* Job Details (Grid layout) */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={6} md={3}>
                <Typography>Salary Range</Typography>
                <Typography>
                  {job.job.minimum_salary && job.job.maximum_salary
                    ? `${job.job.currency} ${job.job.minimum_salary} - ${job.job.currency} ${job.job.maximum_salary}`
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>Location</Typography>
                <Typography>{job.job.location || "N/A"}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>Application Deadline</Typography>
                <Typography>{job.job.application_deadline || "N/A"}</Typography>
              </Grid>
            </Grid>
  
            {/* Additional Info and Requirements */}
            <Typography sx={{ mt: 2 }}>
              Requirements: {job.job.requirements || "N/A"}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Additional Info: {job.job.additional_info || "N/A"}
            </Typography>
          </Box>
        ) : (
          // If job or job details are missing
          <Typography sx={{ fontSize: "1rem", color: "gray" }}>
            No job details available.
          </Typography>
        )}
      </DialogContent>
  
      {/* Actions (Edit and Deactivate) */}
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          type="button"
          variant="contained"
          sx={{ textTransform: "capitalize", width: 100 }}
          onClick={() => {/* Handle Edit action */}}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="outlined"
          sx={{ textTransform: "capitalize", width: 100 }}
          onClick={() => {/* Handle Deactivate action */}}
        >
          Deactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
  
};
export default JobDialog;
