import React, { useEffect, useState } from "react";
import Icon from "@/@core/component/icon";
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import CustomChip from "@/@core/component/mui/chip";
import NoData from "@/@core/emptyData/NoData";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
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
import Link from "next/link";

// Assume these services are imported from your API client
import { fetchApplications, fetchApplicationById } from "@/@core/services/jobService";

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

const ShortlistedTable: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchApplications();
        if (response.status) {
          const shortlistedApplications = response.applications.filter(
            (app: Application) => app.status === "SHORTLISTED"
          );
          const start = page * rowsPerPage;
          const end = start + rowsPerPage;
          setApplications(shortlistedApplications.slice(start, end));
          setTotalApplications(shortlistedApplications.length);
          setAnchorEl(Array(shortlistedApplications.slice(start, end).length).fill(null));
        }
      } catch (error) {
        console.error("Error fetching shortlisted applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

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

  const handleAllChecked = () => {
    if (allChecked) {
      setAllChecked(false);
      setChecked([]);
    } else {
      setAllChecked(true);
      setChecked(applications.map((app) => app.id));
    }
  };

  const handleRowChecked = (id: number) => {
    if (checked.includes(id)) {
      const restChecked = checked.filter((c) => c !== id);
      setChecked(restChecked);
      setAllChecked(false);
    } else {
      if (checked.length + 1 === applications.length) {
        setAllChecked(true);
      }
      setChecked([...checked, id]);
    }
  };

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
        {!smallScreen && <Typography variant="h6">Shortlisted</Typography>}

        <Collapse
          easing={"ease-in-out"}
          in={openFilter}
          timeout={500}
          unmountOnExit
          sx={{ mb: 3, boxShadow: 4 }}
        >
          <Paper sx={{ px: 3, py: 3 }}>
            <Typography sx={{ mb: 3, fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}>
              Filter
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  placeholder="Select level..."
                  fullWidth
                  label="Level of Experience"
                >
                  <MenuItem value="">Select Level</MenuItem>
                  <MenuItem value="entry">Entry Level</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="mid-level">Mid-Level</MenuItem>
                  <MenuItem value="senior">Senior</MenuItem>
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
                  <MenuItem value="">Select Years of Experience</MenuItem>
                  <MenuItem value="less than 1">Less than 1</MenuItem>
                  <MenuItem value="less than 3">Less than 3</MenuItem>
                  <MenuItem value="more than 3">More than 3</MenuItem>
                  <MenuItem value="more than 5">More than 5</MenuItem>
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
                  <MenuItem value="">Date of Application</MenuItem>
                  <MenuItem value="2023-07-11">11, July 2023</MenuItem>
                  <MenuItem value="2024-08-11">11, Aug 2024</MenuItem>
                  <MenuItem value="2021-09-11">11, Sept 2021</MenuItem>
                  <MenuItem value="2022-01-11">11, Jan 2022</MenuItem>
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
          {smallScreen && <Typography variant="h6">Shortlisted</Typography>}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 400 }}>
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
                  <Checkbox
                    size="small"
                    checked={allChecked}
                    onChange={handleAllChecked}
                  />
                </TableCellStyled>
                <TableCellStyled align="left">ID</TableCellStyled>
                <TableCellStyled align="left" sx={{ minWidth: 150 }}>
                  Name
                </TableCellStyled>
                <TableCellStyled align="left">Email</TableCellStyled>
                <TableCellStyled align="center">Job Title</TableCellStyled>
                <TableCellStyled align="left">Date (Applied)</TableCellStyled>
                <TableCellStyled align="center">Status</TableCellStyled>
                <TableCellStyled align="left">Actions</TableCellStyled>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <NoData />
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell align="left">
                      <Checkbox
                        size="small"
                        checked={checked.includes(item.id)}
                        onChange={() => handleRowChecked(item.id)}
                      />
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>{item.user.email}</TableCell>
                    <TableCell align="center">{item.job.title}</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ textTransform: "capitalize", fontWeight: "semibold" }}
                    >
                      <CustomChip
                        size="small"
                        skin="light"
                        label="Shortlisted"
                        color="warning"
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
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            PaperProps={{ style: { minWidth: "8rem" } }}
                          >
                            <MenuItem sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}>
                              <Icon icon="tabler:edit" fontSize={20} />
                              Edit
                            </MenuItem>
                            <MenuItem sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}>
                              <Icon icon="tabler:eye" fontSize={20} />
                              <Link href={`/dashboard/applications/${item.id}`}>
                                View
                              </Link>
                            </MenuItem>
                            <MenuItem sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}>
                              <Icon icon="fluent:delete-24-regular" fontSize={20} />
                              Delete
                            </MenuItem>
                          </Menu>
                        </Avatar>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <TablePagination
        component="div"
        count={totalApplications}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

export const ApplicationDetail: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await fetchApplicationById(applicationId);
        if (response.status) {
          setApplication(response.application);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!application) {
    return <Typography>Application not found</Typography>;
  }

  return (
    <Card sx={{ m: 4 }}>
      <CardHeader title={`Application #${application.id}`} />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Applicant Details</Typography>
          <Typography><strong>Name:</strong> {application.user.name}</Typography>
          <Typography><strong>Email:</strong> {application.user.email}</Typography>
          {application.user.phone_number && (
            <Typography><strong>Phone:</strong> {application.user.phone_number}</Typography>
          )}
          {application.user.profile_image && (
            <Box sx={{ mt: 1 }}>
              <Typography><strong>Profile Image:</strong></Typography>
              <img
                src={application.user.profile_image}
                alt="Profile"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 2 }}>Candidate Details</Typography>
          <Typography><strong>Job Title:</strong> {application.job.title}</Typography>
          <Typography><strong>Application Date:</strong> {new Date(application.created_at).toLocaleDateString()}</Typography>
          <Typography><strong>Status:</strong> {application.status}</Typography>
          <Typography>
            <strong>Job:</strong>{" "}
            <Link href={`/dashboard/jobs/${application.job_id}`}>
              View Job Details
            </Link>
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>Submitted Documents</Typography>
          {application.user.cv_upload && (
            <Typography>
              <strong>CV:</strong>{" "}
              <a href={application.user.cv_upload} target="_blank" rel="noopener noreferrer">
                Download CV
              </a>
            </Typography>
          )}
          {application.user.cover_letter_upload && (
            <Typography>
              <strong>Cover Letter:</strong>{" "}
              <a href={application.user.cover_letter_upload} target="_blank" rel="noopener noreferrer">
                Download Cover Letter
              </a>
            </Typography>
          )}
          {application.user.id_upload && (
            <Typography>
              <strong>ID:</strong>{" "}
              <a href={application.user.id_upload} target="_blank" rel="noopener noreferrer">
                View ID
              </a>
            </Typography>
          )}
          {application.user.video_url && (
            <Typography>
              <strong>Intro Video:</strong>{" "}
              <a href={application.user.video_url} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </Typography>
          )}
          {application.user.work_sample_upload && (
            <Typography>
              <strong>Work Sample:</strong>{" "}
              <a href={application.user.work_sample_upload} target="_blank" rel="noopener noreferrer">
                Download Work Sample
              </a>
            </Typography>
          )}
          {application.user.portfolio_link && (
            <Typography>
              <strong>Portfolio:</strong>{" "}
              <a href={application.user.portfolio_link} target="_blank" rel="noopener noreferrer">
                View Portfolio
              </a>
            </Typography>
          )}

          {application.user.project_screenshots && application.user.project_screenshots.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Project Screenshots</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {application.user.project_screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Project screenshot ${index + 1}`}
                    style={{ maxWidth: "150px", borderRadius: "8px" }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ShortlistedTable;