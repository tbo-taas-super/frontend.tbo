// * React Imports
import React, { useEffect, useState } from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";

// * Service Imports
import { getAppliedJob } from "@/@core/services/jobVanciesService"; // Adjust the import path to your service file

// * Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import CustomChip from "@/@core/component/mui/chip";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import { Avatar, Menu } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";

// ** Types (based on service response)
interface Job {
  id: number;
  title: string;
  job_type: string;
  description: string;
  requirements: string;
  skill: string;
  currency: string;
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
}

interface User {
  id: number;
  name: string;
  email: string;
  account_type: string;
  phone_number: string | null;
  cv_upload: string | null;
  cover_letter_upload: string | null;
  id_upload: string | null;
  video_url: string | null;
  project_screenshots: string | null;
  work_sample_upload: string | null;
  portfolio_link: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  status: string;
}

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  job: Job;
  user: User;
}

const HiredTalents = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getAppliedJob();
        // Filter for HIRED status
        const hiredApplications = data.filter((app: Application) => app.status === "HIRED");
        setApplications(hiredApplications);
        setAnchorEl(Array(hiredApplications.length).fill(null));
      } catch (err) {
        setError("Failed to load applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  const handleRowOptionsClose = (index: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;
    setAnchorEl(newAnchorEl);
  };

  const handleViewClick = (application: Application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
  };

  const toggleFilter = () => setOpenFilter(!openFilter);

  // Filter applications based on search and status
  const filteredApplications = applications.filter((app) =>
    app.user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    app.job.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination logic
  const paginatedApplications = filteredApplications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card
      sx={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        my: (theme) => theme.spacing(4),
        background: "#fff",
      }}
    >
      <CardContent sx={{ p: (theme) => theme.spacing(3) }}>
        {!smallScreen && <Typography variant="h6">Hired Talents</Typography>}

        <Collapse
          easing={"ease-in-out"}
          in={openFilter}
          timeout={500}
          unmountOnExit
          sx={{ mb: 3, boxShadow: 4 }}
        >
          <Paper sx={{ px: 3, py: 3 }}>
            <Typography
              sx={{
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Filter
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  placeholder="Reviewed, Hired, Short..."
                  fullWidth
                  label="Status"
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                  <MenuItem value="REVIEWED">Reviewed</MenuItem>
                  <MenuItem value="INTERVIEWED">Interviewed</MenuItem>
                  <MenuItem value="HIRED">Hired</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  placeholder="Senior, mid-level, entry..."
                  fullWidth
                  label="Level of Experience"
                >
                  <MenuItem value="">Select Level</MenuItem>
                  <MenuItem value="ENTRY">Entry Level</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="MID">MId-Level</MenuItem>
                  <MenuItem value="SENIOR">Senior</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  placeholder="less than 3..."
                  fullWidth
                  label="Years of Experience"
                >
                  <MenuItem value="">Select Years of Experience</MenuItem>
                  <MenuItem value="1">Less than 1</MenuItem>
                  <MenuItem value="2">Less than 3</MenuItem>
                  <MenuItem value="3">More than 3</MenuItem>
                  <MenuItem value="4">More than 5</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  placeholder="Month and Year..."
                  fullWidth
                  label="Date Applied"
                >
                  <MenuItem value="">Date of Application</MenuItem>
                  <MenuItem value="1">May 2025</MenuItem>
                  <MenuItem value="2">April 2025</MenuItem>
                  <MenuItem value="3">March 2025</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        <Box
          sx={{
            my: 3,
            mx: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-end", md: "space-between" },
          }}
        >
          {smallScreen && <Typography variant="h6">Hired</Typography>}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: { md: 400 } }}>
            <CustomTextField
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="small"
              placeholder="Job title, company name, applicant"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    <Icon icon="lets-icons:search-duotone" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={toggleFilter}
              variant={openFilter ? "contained" : "outlined"}
              size="medium"
              sx={{
                textTransform: "capitalize",
                width: "fit-content",
                minWidth: { md: 80 },
              }}
            >
              {smallScreen && (
                <Typography sx={{ fontSize: ".857rem" }}>Filter</Typography>
              )}
              <Icon icon="basil:filter-outline" />
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ background: (theme) => theme.palette.secondary.dark }}>
                <TableCellStyled align="left" sx={{ minWidth: 50 }}>
                  <Checkbox size="small" />
                </TableCellStyled>
                <TableCellStyled align="left">User ID</TableCellStyled>
                <TableCellStyled align="left" sx={{ minWidth: 150 }}>
                  Name
                </TableCellStyled>
                <TableCellStyled align="left">Email</TableCellStyled>
                <TableCellStyled align="center">Applications</TableCellStyled>
                <TableCellStyled align="left">Date(Applied)</TableCellStyled>
                <TableCellStyled align="center">Status</TableCellStyled>
                <TableCellStyled align="left">Actions</TableCellStyled>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedApplications.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell align="left">
                    <Checkbox size="small" />
                  </TableCell>
                  <TableCell>{item.user_id}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.user.email}</TableCell>
                  <TableCell align="center">{item.job.title}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" sx={{ textTransform: "capitallze" }}>
                    <CustomChip
                      size="small"
                      skin="light"
                      label="Hired"
                      color="success"
                      sx={{ width: "100%", borderRadius: "5px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ alignSelf: "end" }}>
                      <Avatar sx={{ background: "transparent" }}>
                        <IconButton
                          size="small"
                          onClick={(event) => handleRowOptionsClick(event, i)}
                        >
                          <Icon icon="tabler:dots-vertical" />
                        </IconButton>
                        <Menu
                          keepMounted
                          disableScrollLock
                          anchorEl={anchorEl[i]}
                          open={Boolean(anchorEl[i])}
                          onClose={() => handleRowOptionsClose(i)}
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                          transformOrigin={{ vertical: "top", horizontal: "right" }}
                          PaperProps={{ style: { minWidth: "8rem" } }}
                        >
                          <MenuItem
                            sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                            onClick={() => {
                              handleViewClick(item);
                              handleRowOptionsClose(i);
                            }}
                          >
                            <Icon icon="tabler:eye" fontSize={20} />
                            View
                          </MenuItem>
                        </Menu>
                      </Avatar>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <TablePagination
        component="div"
        count={filteredApplications.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* View Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6">User Information</Typography>
              <Typography><strong>Name:</strong> {selectedApplication.user.name}</Typography>
              <Typography><strong>Email:</strong> {selectedApplication.user.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedApplication.user.phone_number || "N/A"}</Typography>
              <Typography><strong>Account Type:</strong> {selectedApplication.user.account_type}</Typography>
              <Typography>
                <strong>CV:</strong>{" "}
                {selectedApplication.user.cv_upload ? (
                  <a href={selectedApplication.user.cv_upload} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>
              <Typography>
                <strong>Cover Letter:</strong>{" "}
                {selectedApplication.user.cover_letter_upload ? (
                  <a href={selectedApplication.user.cover_letter_upload} target="_blank" rel="noopener noreferrer">
                    View Cover Letter
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>
              <Typography>
                <strong>Portfolio:</strong>{" "}
                {selectedApplication.user.portfolio_link ? (
                  <a href={selectedApplication.user.portfolio_link} target="_blank" rel="noopener noreferrer">
                    View Portfolio
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2 }}>Job Information</Typography>
              <Typography><strong>Job Title:</strong> {selectedApplication.job.title}</Typography>
              <Typography><strong>Job Type:</strong> {selectedApplication.job.job_type}</Typography>
              <Typography><strong>Location:</strong> {selectedApplication.job.location}</Typography>
              <Typography>
                <strong>Salary Range:</strong> {selectedApplication.job.currency}{" "}
                {selectedApplication.job.minimum_salary} - {selectedApplication.job.maximum_salary}
              </Typography>
              <Typography>
                <strong>Application Date:</strong>{" "}
                {new Date(selectedApplication.created_at).toLocaleDateString()}
              </Typography>
              <Typography><strong>Status:</strong> {selectedApplication.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default HiredTalents;