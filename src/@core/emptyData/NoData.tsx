import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomChip from "@/@core/component/mui/chip";
import { fetchInterviews, updateInterviewStatus } from "@/@core/services/interviewService";

// Styled Components
const StyledModal = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  outline: "none",
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
}));

const NoDataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "50vh",
  gap: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return { color: "success", label: "Completed" };
    case "scheduled":
      return { color: "info", label: "Scheduled" };
    case "cancelled":
      return { color: "error", label: "Cancelled" };
    default:
      return { color: "warning", label: "Pending" };
  }
};

// Types
interface Interview {
  id: number;
  job: string;
  interview_date: string;
  interview_time: string;
  interview_location: string;
  status: string;
  qualified_user: {
    id: number;
    name: string;
    email: string;
  };
  interviewer: {
    name: string;
    department: string;
    email: string;
    phone: string;
  };
}

// Allowed status values (matches backend)
const allowedStatuses = ["scheduled", "pending", "completed", "cancelled"];

const Interviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInterviews();
      if (data.status && Array.isArray(data.interviews)) {
        const mappedData: Interview[] = data.interviews.map((item: any) => ({
          id: item.id,
          job: item.job,
          interview_date: item.interview_date,
          interview_time: item.interview_time,
          interview_location: item.interview_location,
          status: item.status,
          qualified_user: {
            id: item.qualified_user?.id,
            name: item.qualified_user?.name,
            email: item.qualified_user?.email,
          },
          interviewer: {
            name: item.interviewer?.name,
            department: item.interviewer?.department,
            email: item.interviewer?.email,
            phone: item.interviewer?.phone,
          },
        }));
        setInterviews(mappedData);
      } else {
        setError("Invalid response format from server.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleOpenModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setSelectedStatus(interview.status);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInterview(null);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as string);
  };

  const handleSaveStatus = async () => {
    if (!selectedInterview || !allowedStatuses.includes(selectedStatus)) {
      setError("Invalid status selected.");
      return;
    }

    try {
      await updateInterviewStatus(selectedInterview.id, selectedStatus);
      setInterviews(
        interviews.map((interview) =>
          interview.id === selectedInterview.id
            ? { ...interview, status: selectedStatus }
            : interview
        )
      );
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Failed to update interview status.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography ml={2}>Loading interviews...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <NoDataContainer>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </NoDataContainer>
    );
  }

  if (interviews.length === 0) {
    return (
      <NoDataContainer>
        <Typography variant="h6">No Interviews Yet</Typography>
        <Typography variant="body1">
          There are currently no scheduled interviews. Check back later or schedule a new interview.
        </Typography>
      </NoDataContainer>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Interviews
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadInterviews}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.light" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Job</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Candidate</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Interview Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Interviewer</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interviews.map((interview) => (
              <TableRow key={interview.id} sx={{ "&:hover": { backgroundColor: "action.hover" } }}>
                <TableCell>{interview.job}</TableCell>
                <TableCell>{interview.qualified_user.name}</TableCell>
                <TableCell>{interview.interview_date}</TableCell>
                <TableCell>{interview.interview_time}</TableCell>
                <TableCell>{interview.interview_location}</TableCell>
                <TableCell>{interview.interviewer.name}</TableCell>
                <TableCell align="center">
                  <CustomChip
                    skin="light"
                    label={getStatusColor(interview.status).label}
                    color={getStatusColor(interview.status).color as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit status" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(interview)}
                      sx={{ "&:hover": { backgroundColor: "primary.light", color: "primary.dark" } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Edit Modal */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="edit-status-modal" closeAfterTransition>
        <Fade in={openModal}>
          <StyledModal>
            <ModalHeader>
              <ModalTitle variant="h6">Update Interview Status</ModalTitle>
              <IconButton onClick={handleCloseModal} size="small" sx={{ color: "text.secondary" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </ModalHeader>

            {selectedInterview && (
              <>
                <ModalContent>
                  <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary">Job Position</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedInterview.job}</Typography>
                  </Box>
                  <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary">Candidate</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedInterview.qualified_user.name}</Typography>
                  </Box>
                  <FormControl fullWidth>
                    <InputLabel id="status-select-label">Interview Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={selectedStatus}
                      label="Interview Status"
                      onChange={handleStatusChange}
                      sx={{ mt: 1 }}
                    >
                      {allowedStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {getStatusColor(status).label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ModalContent>

                <ModalFooter>
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    startIcon={<CloseIcon />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveStatus}
                    startIcon={<CheckIcon />}
                    sx={{ textTransform: "none", borderRadius: 2, boxShadow: "none" }}
                  >
                    Update Status
                  </Button>
                </ModalFooter>
              </>
            )}
          </StyledModal>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Interviews;