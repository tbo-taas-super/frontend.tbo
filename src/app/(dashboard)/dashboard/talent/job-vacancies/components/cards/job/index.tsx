"use client";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { saveJob } from "@/@core/services/jobVanciesService";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import axios from "axios";

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 12px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }
`;

const DialogTitleStyled = styled(DialogTitle)`
  text-align: center;
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
`;

const DialogContentStyled = styled(DialogContent)`
  padding: 20px;
  text-align: center;
`;

const DialogActionsStyled = styled(DialogActions)`
  justify-content: center;
  padding-bottom: 20px;
`;

const ButtonStyled = styled(Button)`
  text-transform: none;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin: 0 8px;
  &.MuiButton-contained {
    background-color: #E61C31;
    color: white;
    &:hover {
      background-color: #C8102E;
    }
  }
  &.MuiButton-outlined {
    background-color: #f8f9fa;
    color: #E61C31;
    border: 1px solid #E61C31;
    &:hover {
      background-color: #d9d9d9;
    }
  }
`;

const ViewMoreButton = styled(Button)`
  text-transform: none;
  font-size: 14px;
  color: #E61C31;
  padding: 4px 8px;
  &:hover {
    background-color: #f8f9fa;
  }
`;

interface JobCardProps {
  id: number;
  logo: string;
  name: string;
  location: string;
  title: string;
  commitment: string;
  salary: string;
  description: string;
  noOfApplied: string;
  postedAt: string;
  daysLeft: string;
  setOpenApplicationFormModal: (jobId: number) => void;
  hideSaveButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  logo,
  name,
  location,
  title,
  commitment,
  salary,
  description,
  noOfApplied,
  postedAt,
  daysLeft,
  setOpenApplicationFormModal,
  hideSaveButton = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("error");
  const [openDialog, setOpenDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const DESCRIPTION_LIMIT = 200;
  const truncatedDescription =
    description.length > DESCRIPTION_LIMIT
      ? `${description.slice(0, DESCRIPTION_LIMIT)}...`
      : description;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openSnackbar) {
      timer = setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [openSnackbar]);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmSave = async () => {
    if (!id) {
      setSnackbarMessage("Job ID is missing");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setOpenDialog(false);
      return;
    }

    try {
      setIsSaving(true);
      await saveJob(id);
      setSaved(true);
      setSnackbarMessage("Job saved successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setSnackbarMessage("You have already saved this job.");
        setSnackbarSeverity("info");
        setSaved(true);
      } else {
        setSnackbarMessage("Could not save job. Please try again.");
        setSnackbarSeverity("error");
      }
      setOpenSnackbar(true);
    } finally {
      setIsSaving(false);
      setOpenDialog(false);
    }
  };

  const handleApplyJob = () => {
    if (!id) {
      setSnackbarMessage("Job ID is missing");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    setOpenApplicationFormModal(id);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      sx={{
        border: "1px solid #E4E5E8",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#fff",
        maxWidth: "600px",
        minHeight: "450px", // Increased height to accommodate description
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Box
          sx={{
            backgroundColor: "#EDEFF5",
            padding: "8px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={logo || "/unknown.png"}
            width={24}
            height={24}
            alt={`${name} Logo`}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            {location}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Image
            src="/icons/bookmark.svg"
            width={18}
            height={18}
            alt="Bookmark Icon"
          />
          <Typography variant="body2" sx={{ color: "#666" }}>
            {postedAt}
          </Typography>
        </Box>
      </Box>

      {/* Job Title */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
        {title}
      </Typography>

      {/* Job Details */}
      <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {commitment}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Salary: {salary}
        </Typography>
      </Box>

      {/* Description */}
      <Box sx={{ flex: 1, minHeight: "120px" }}> {/* Added flex and minHeight for description space */}
        <Typography
          variant="body1"
          sx={{ color: "#333", lineHeight: 1.6, marginBottom: "8px" }}
        >
          {isExpanded ? description : truncatedDescription}
        </Typography>
        {description.length > DESCRIPTION_LIMIT && (
          <ViewMoreButton onClick={toggleDescription} aria-label={isExpanded ? "View less" : "View more"}>
            {isExpanded ? "View Less" : "View More"}
          </ViewMoreButton>
        )}
      </Box>

      {/* Metadata */}
      <Box sx={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {[
          { icon: "/icons/location_marker.svg", text: commitment },
          { icon: "/icons/location_marker.svg", text: `${noOfApplied} Applied` },
          { icon: "/icons/location_marker.svg", text: `${daysLeft} Days Left` },
        ].map((item, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Image
              src={item.icon}
              width={18}
              height={18}
              alt="Icon"
            />
            <Typography variant="body2" sx={{ color: "#666" }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
        {!hideSaveButton && (
          <ButtonStyled
            variant="contained" // Changed to contained for consistency with Apply Now
            onClick={handleDialogOpen}
            disabled={saved || isSaving}
            aria-label="Save job"
          >
            {saved ? "Saved" : isSaving ? "Saving..." : "Save Job"}
          </ButtonStyled>
        )}
        <ButtonStyled
          variant="contained"
          onClick={handleApplyJob}
          aria-label="Apply for job"
        >
          Apply Now
        </ButtonStyled>
      </Box>



      {/* Confirmation Dialog */}
      <StyledDialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitleStyled>Confirm Action</DialogTitleStyled>
        <DialogContentStyled>
          <Typography variant="body1">
            Are you sure you want to save this job?
          </Typography>
        </DialogContentStyled>
        <DialogActionsStyled>
          <ButtonStyled
            onClick={handleDialogClose}
            variant="outlined"
            aria-label="Cancel save"
          >
            Cancel
          </ButtonStyled>
          <ButtonStyled
            onClick={handleConfirmSave}
            variant="contained"
            aria-label="Confirm save"
          >
            Confirm
          </ButtonStyled>
        </DialogActionsStyled>
      </StyledDialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobCard;