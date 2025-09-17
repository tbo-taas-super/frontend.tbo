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
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { InterestModal, NewJobMessageModal } from "@/@core/component/modals/interest-modal";
import { JobSelectionModal } from "@/@core/component/modals/job-selection-modal";
import { SuccessModal } from "@/@core/component/modals/success-modal";
import type { TalentDetailsData } from "@/@core/services/clientTalent";

// Define interface for education data
interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface JobData {
  id: string;
  title: string;
  department: string;
}

interface TalentProfileProps {
  talent: TalentDetailsData["talent"];
  open: boolean;
  onClose: () => void;
  onInterested: (data: any) => void;
  onNotInterested: () => void;
  jobs: JobData[];
}

export function TalentProfile({
  talent,
  open,
  onClose,
  onInterested,
  onNotInterested,
  jobs,
}: TalentProfileProps) {
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [newJobMessageModalOpen, setNewJobMessageModalOpen] = useState(false);
  const [jobSelectionModalOpen, setJobSelectionModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Helper function to get the first name
  const getFirstName = (name: string | undefined): string => {
    if (!name || name.trim() === "") return "Unnamed Talent";
    return name.split(" ")[0].trim() || "Unnamed Talent";
  };

  // Helper function to get the second name (if any) for blurring
  const getSecondName = (name: string | undefined): string | null => {
    if (!name || name.trim() === "") return null;
    const parts = name.split(" ");
    return parts.length > 1 ? parts.slice(1).join(" ").trim() : null;
  };

  // Helper function to get the avatar initial
  const getAvatarInitial = (name: string | undefined): string => {
    if (!name || name.trim() === "") return "T";
    return name.split(" ")[0].charAt(0).toUpperCase() || "T";
  };

  const handleInterestedClick = () => {
    setInterestModalOpen(true);
  };

  const handleNewJobClick = () => {
    setInterestModalOpen(false);
    setNewJobMessageModalOpen(true);
  };

  const handleExistingJobClick = () => {
    setInterestModalOpen(false);
    setJobSelectionModalOpen(true);
  };

  const handleJobSelectionContinue = () => {
    if (selectedJob) {
      onInterested({
        interested: true,
        interest_type: "existing_job",
        job_id: selectedJob,
      });
      setJobSelectionModalOpen(false);
      setShowSuccessMessage(true);
      toast.success(`Successfully added ${getFirstName(talent.name)} to an existing job`, { toastId: "add-existing-job" });
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 3000);
    }
  };

  const handleNewJobContinue = () => {
    onInterested({
      interested: true,
      interest_type: "new_job",
      job_title: "New Job Title",
    });
    setNewJobMessageModalOpen(false);
    setShowSuccessMessage(true);
    toast.success(`Successfully expressed interest in ${getFirstName(talent.name)} for a new job`, { toastId: "add-new-job" });
    setTimeout(() => {
      setShowSuccessMessage(false);
      onClose();
    }, 3000);
  };

  const handleCloseAll = () => {
    setInterestModalOpen(false);
    setNewJobMessageModalOpen(false);
    setJobSelectionModalOpen(false);
    setSelectedJob("");
    setShowSuccessMessage(false);
    onClose();
  };

  // Parse education JSON string
  let educationData: Education[] = [];
  try {
    educationData = JSON.parse(talent.education || "[]");
  } catch (error) {
    console.error("Failed to parse education JSON:", error);
  }

  return (
    <>
      <Dialog open={open} onClose={handleCloseAll} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Talent Profile</span>
            <Button onClick={handleCloseAll} sx={{ minWidth: "auto", p: 1 }}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64 }}>
                {getAvatarInitial(talent.name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {getFirstName(talent.name)}
                  {getSecondName(talent.name) && (
                    <span style={{ filter: "blur(5px)", marginLeft: "8px" }}>
                      {getSecondName(talent.name)}
                    </span>
                  )}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {talent.designation}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {talent.location?.split(", ")[1] || talent.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {talent.years_experience} years experience
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={talent.status}
                  color={talent.status === "open_to_work" ? "success" : "default"}
                  size="small"
                />
              </Box>
            </Box>

            <Card sx={{ bgcolor: "#F9FAFB", mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        filter: "blur(2px)",
                        color: "text.disabled",
                      }}
                    >
                      {talent.contact_email || "████████@email.com"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        filter: "blur(2px)",
                        color: "text.disabled",
                      }}
                    >
                      {talent.contact_phone || "+1 (███) ███-████"}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Contact information available after expressing interest
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Professional Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {talent.professional_summary}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Skills
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {talent.skills?.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" size="small" />
                  )) || <Typography>No skills listed</Typography>}
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Current Company
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {talent.current_company}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Education
                    </Typography>
                    {educationData.length > 0 ? (
                      educationData.map((edu: Education, index: number) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {edu.degree} - {edu.institution} ({edu.year})
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No education listed
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            startIcon={<FavoriteIcon />}
            onClick={handleInterestedClick}
            sx={{ flex: 1 }}
          >
            Interested
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onNotInterested}
            sx={{ flex: 1 }}
          >
            Not Interested
          </Button>
        </DialogActions>
      </Dialog>

      <InterestModal
        open={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        onNewJob={handleNewJobClick}
        onExistingJob={handleExistingJobClick}
        talentName={getFirstName(talent.name)}
      />

      <NewJobMessageModal
        open={newJobMessageModalOpen}
        onClose={() => {
          setNewJobMessageModalOpen(false);
          handleCloseAll();
        }}
        onContinue={handleNewJobContinue}
      />

      <JobSelectionModal
        open={jobSelectionModalOpen}
        onClose={() => setJobSelectionModalOpen(false)}
        onContinue={handleJobSelectionContinue}
        selectedJob={selectedJob}
        onJobChange={setSelectedJob}
        jobs={jobs}
        talentName={getFirstName(talent.name)}
      />

      <SuccessModal open={showSuccessMessage} talentName={getFirstName(talent.name)} />
    </>
  );
}