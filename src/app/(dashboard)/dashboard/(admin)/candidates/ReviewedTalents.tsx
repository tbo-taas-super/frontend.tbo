
// *React Imports
import React, { useEffect, useState } from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";

// * Service Imports
import { getAppliedJob } from "@/@core/services/jobVanciesService"; 

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
  additional_info: string;
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
  project_screenshots: string[] | null;
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

const RejectedTalents = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getAppliedJob();
        // Filter for REJECTED status
        const rejectedApplications = data
          .filter((app) => app.status === "REJECTED")
          .map((app) => ({
            ...app,
            job: {
              ...app.job,
              additional_info: app.job.additional_info || "",
            },
            user: {
              ...app.user,
              project_screenshots: Array.isArray(app.user.project_screenshots)
                ? app.user.project_screenshots
                : app.user.project_screenshots
                ? [app.user.project_screenshots]
                : null,
            },
          }));
        setApplications(rejectedApplications);
        setAnchorEl(Array(rejectedApplications.length).fill(null));
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

  const handleRowOptionsClick = (event: any, index: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  const handleRowOptionsClose = (index: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;
    setAnchorEl(newAnchorEl);
  };

  const toggleFilter = () => setOpenFilter(!openFilter);

  // Pagination logic
  const paginatedApplications = applications.slice(
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
        {!smallScreen && <Typography variant="h6">Rejected Talents</Typography>}

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
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  placeholder="Reviewed, Hired, Short..."
                  fullWidth
                  label="Status"
                >
                  <MenuItem value="0">Select Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                  <MenuItem value="REVIEWED">Reviewed</MenuItem>
                  <MenuItem value="INTERVIEWED">Interviewed</MenuItem>
                  <MenuItem value="HIRED">Hired</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  placeholder="Senior, mid-level, entry..."
                  fullWidth
                  label="Level of Experience"
                >
                  <MenuItem value="0">Select Level</MenuItem>
                  <MenuItem value="ENTRY">Entry Level</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="MID">Mid-Level</MenuItem>
                  <MenuItem value="SENIOR">Senior</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  placeholder="less than 3..."
                  fullWidth
                  label="Years of Experience"
                >
                  <MenuItem value="0">Select Years of Experience</MenuItem>
                  <MenuItem value="1">Less than 1</MenuItem>
                  <MenuItem value="2">Less than 3</MenuItem>
                  <MenuItem value="3">More than 3</MenuItem>
                  <MenuItem value="4">More than 5</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  placeholder="Month and Year..."
                  fullWidth
                  label="Date Applied"
                >
                  <MenuItem value="0">Date of Application</MenuItem>
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
          {smallScreen && <Typography variant="h6">Rejected</Typography>}
          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 400 }}>
            <CustomTextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
                <Typography sx={{ fontSize: ".857rem" }}> Filter</Typography>
              )}
              <Icon icon="basil:filter-outline" />
            </Button>
          </Box> */}
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
                  <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                    <CustomChip
                      size="small"
                      skin="light"
                      label="Rejected"
                      color="error"
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
                          onBlur={() => handleRowOptionsClose(i)}
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                          transformOrigin={{ vertical: "top", horizontal: "right" }}
                          PaperProps={{ style: { minWidth: "8rem" } }}
                        >
                          {/* <MenuItem sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}>
                            <Icon icon="tabler:edit" fontSize={20} />
                            Edit
                          </MenuItem> */}
                          <MenuItem sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}>
                            <Icon icon="tabler:eye" fontSize={20} />
                            View
                          </MenuItem>
                          {/* <MenuItem sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}>
                            <Icon icon="fluent:delete-24-regular" fontSize={20} />
                            Delete
                          </MenuItem> */}
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
        count={applications.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

export default RejectedTalents;
