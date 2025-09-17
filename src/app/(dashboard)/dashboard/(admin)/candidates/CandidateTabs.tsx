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

import Talents from "./TalentsTable";
import Unreviewed from "./UnreviewedTalents";
import Reviewed from "./ReviewedTalents";
import Shortlisted from "./ShortlistedTalents";
import Interviewed from "./InterviewedTalents";
import Hired from "./HiredTalents";
import { sendApplicationToClient } from "@/@core/services/jobVanciesService";
import { getAppliedJob } from "@/@core/services/jobVanciesService"; // Adjust path to your service file

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
};

interface Application {
  id: number;
  candidateName: string;
}

const TalentsTabs = ({ tab }: TabProps) => {
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const handleChange = (e: SyntheticEvent, value: string) => {
    setActiveTab(value);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    fetchApplications();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedApplications([]);
    setError(null);
    setSuccess(null);
  };
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const applicationsData = await getAppliedJob();
  
      const shortlistedApplications = applicationsData
        .filter((app) => app.status === "INTERVIEWED")
        .map((app) => ({
          id: app.id,
          candidateName: app.user.name,
          job: app.job, // Include the job object
        }));
  
      setApplications(shortlistedApplications);
    } catch (err: any) {
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSendToClient = async () => {
    if (selectedApplications.length === 0) {
      setError("Please select at least one application");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      // Find the first selected application object
      const selectedAppData = applications.find(app => selectedApplications.includes(app.id));
  
      if (!selectedAppData || !('job' in selectedAppData)) {
        setError("Invalid application selection");
        setLoading(false);
        return;
      }
  
      const { id: job_id, client_id } = (selectedAppData as any).job;
  
      const data = {
        job_id,
        client_id,
        applications: selectedApplications,
      };
  
      await sendApplicationToClient(data);
      setSuccess("Applications sent successfully");
      setSelectedApplications([]);
      setTimeout(handleCloseModal, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send applications");
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
    all: <Unreviewed />,
    // underReview: <Unreviewed />,
    // reviewed: <Reviewed />,
    // interviewed: <Interviewed />,
    // shortlisted: <Shortlisted />,
    // hired: <Hired />,
  };

  return (
    <Grid container spacing={6}>
      {activeTab === undefined ? null : (
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
                      {/* <Tab
                        value="underReview"
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ...(!hideText && { "& svg": { mr: 2 } }),
                              textTransform: "capitalize",
                            }}
                          >
                            <Icon fontSize="1.5rem" icon="basil:search-solid" />
                            {!hideText && "Under Review"}
                          </Box>
                        }
                      /> */}
                     
{/*                      
                      <Tab
                        value="interviewed"
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ...(!hideText && { "& svg": { mr: 2 } }),
                              textTransform: "capitalize",
                            }}
                          >
                            <Icon fontSize="1.125rem" icon="fluent:mic-28-regular" />
                            {!hideText && "shortlisted"}
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
                            {!hideText && "Interviewed"}
                          </Box>
                        }
                      />
                       <Tab
                        value="reviewed"
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ...(!hideText && { "& svg": { mr: 2 } }),
                              textTransform: "capitalize",
                            }}
                          >
                            <Icon fontSize="1.575rem" icon="ph:eye" />
                            {!hideText && "Rejected"}
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
                      /> */}
                    </TabList>
                  </Grid>
                </Box>

                <Box sx={{ mt: { xs: 4, lg: 0 } }}>
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
                      Send to Client
                    </Button>
                  )}
                </Box>
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

      <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="send-to-client-modal">
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
          <Typography id="send-to-client-modal" variant="h6" sx={{ mb: 4 }}>
            Send Applications to Client
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
            <InputLabel id="applications-select-label">Select Applications</InputLabel>
            <Select
              labelId="applications-select-label"
              multiple
              value={selectedApplications}
              onChange={(e) => setSelectedApplications(e.target.value as number[])}
              label="Select Applications"
              disabled={loading}
            >
              {applications.map((app) => (
                <MenuItem key={app.id} value={app.id}>
                  {app.candidateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendToClient}
              disabled={loading}
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

export default TalentsTabs;