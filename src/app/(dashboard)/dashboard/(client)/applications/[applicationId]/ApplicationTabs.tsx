import { useState, useEffect, SyntheticEvent } from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiTabList from "@mui/lab/TabList";
import Icon from "@/@core/component/icon";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import ApplicationTable from "./applications/ApplicationTable";
import ClientShortlisted from "./applications/clientShortlisted";
import ClientHired from "./applications/clientHired";
import { sendApplicationToAdmin, getAppliedJob } from "@/@core/services/jobVanciesService";

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: "0 !important",
  "&, & .MuiTabs-scroller": {
    boxSizing: "content-box",
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.up("sm")]: {
      minWidth: 130,
    },
  },
}));

type TabProps = {
  tab: string;
  applicationId: string;
};

interface Candidate {
  id: number;
  name: string;
}

const ApplicationTabs = ({ tab, applicationId }: TabProps) => {
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const handleChange = (e: SyntheticEvent, value: string) => {
    setActiveTab(value);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    fetchCandidates();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCandidates([]);
    setError(null);
    setSuccess(null);
  };

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const applicationsData = await getAppliedJob();
      console.log("getAppliedJob response:", applicationsData); // Debug API response
      if (!Array.isArray(applicationsData)) {
        throw new Error("Expected an array of applications");
      }
      const shortlisted = applicationsData
        .filter(
          (app: any) =>
            app.job_id === parseInt(applicationId, 10) &&
            app.status === "INTERVIEWED"
        )
        .map((app: any) => ({
          id: app.id,
          name: app.user.name,
        }));
      console.log("Shortlisted candidates:", shortlisted); // Debug filtered candidates
      setCandidates(shortlisted);
      if (shortlisted.length === 0) {
        setError("No shortlisted candidates found for this job");
      }
    } catch (err: any) {
      console.error("Error fetching candidates:", err);
      setError(err.message || "Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAdmin = async () => {
    if (selectedCandidates.length === 0) {
      setError("Please select at least one candidate");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = {
        job_id: parseInt(applicationId, 10),
        applications: selectedCandidates,
        selected_candidates: selectedCandidates,
      };
      await sendApplicationToAdmin(data);
      setSuccess("Candidates sent to admin successfully");
      setSelectedCandidates([]);
      setTimeout(handleCloseModal, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send candidates to admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const tabContentList = {

    all: <ApplicationTable jobId={parseInt(applicationId, 10)} />,
    shortlisted: <ClientShortlisted jobId={parseInt(applicationId, 10)}/>,
    hired: <ClientHired jobId={parseInt(applicationId, 10)}  />,
  };

  return (
    <Grid container spacing={6}>
      {activeTab !== undefined && (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Box
                sx={{
                  mt: 4,
                  px: 3,
                  mr: { xs: 2, md: 0 },
                  width: "100%",
                  display: "flex",
                  justifyContent: { xs: "flex-start", lg: "space-between" },
                  alignItems: { xs: "flex-end", lg: "center" },
                  flexDirection: { xs: "column", lg: "row" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", lg: "80%" },
                    maxWidth: "fit-content",
                    overflowX: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#fff",
                    borderRadius: 2,
                    alignSelf: { xs: "flex-start !important" },
                  }}
                >
                  <Grid item xs={12}>
                    <TabList
                      variant="scrollable"
                      scrollButtons="auto"
                      onChange={handleChange}
                      aria-label="applications tabs"
                    >
                      <Tab
                        value="all"
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ...(!hideText && { "& svg": { mr: 2 } }),
                              textTransform: "capitalize",
                            }}
                          >
                            <Icon fontSize="1.5rem" icon="prime:user" />
                            {!hideText && "All"}
                          </Box>
                        }
                      />
                      <Tab
                        value="shortlisted"
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ...(!hideText && { "& svg": { mr: 2 } }),
                              textTransform: "capitalize",
                            }}
                          >
                            <Icon fontSize="1.575rem" icon="prime:users" />
                            {!hideText && "Shortlisted"}
                          </Box>
                        }
                      />
                      <Tab
                        value="hired"
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ...(!hideText && { "& svg": { mr: 2 } }),
                              textTransform: "capitalize",
                            }}
                          >
                            <Icon fontSize="1.4rem" icon="uim:check" />
                            {!hideText && "Hired"}
                          </Box>
                        }
                      />
                    </TabList>
                  </Grid>
                </Box>

                {/* <Box sx={{ mt: { xs: 4, lg: 0 } }}>
                  {activeTab === "shortlisted" && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleOpenModal}
                      sx={{
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: "fit-content",
                      }}
                    >
                      <Icon icon="tabler:send" sx={{ mr: 2 }} />
                      Hire Talents
                    </Button>
                  )}
                </Box> */}
              </Box>

              <Grid item xs={12}>
                <TabPanel sx={{ p: 0 }} value={activeTab}>
                  {tabContentList[activeTab as keyof typeof tabContentList]}
                </TabPanel>
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="hire-talents-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="hire-talents-modal" variant="h6" sx={{ mb: 4 }}>
            Hire Talents
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="candidates-select-label">Select Candidates</InputLabel>
            <Select
              labelId="candidates-select-label"
              multiple
              value={selectedCandidates}
              onChange={(e) => setSelectedCandidates(e.target.value as number[])}
              label="Select Candidates"
              disabled={loading}
            >
              {candidates.length === 0 && !loading ? (
                <MenuItem disabled>No shortlisted candidates available</MenuItem>
              ) : (
                candidates.map((candidate) => (
                  <MenuItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendToAdmin}
              disabled={loading || selectedCandidates.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default ApplicationTabs;