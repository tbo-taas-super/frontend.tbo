// *React Imports
import React from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";

// * Image Imports
import Google from "../../../../../../../../public/google.png";

// * Next Imports
import Link from "next/link";

// * Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import StyledImage from "@/@core/component/mui/image";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CustomChip from "@/@core/component/mui/chip";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import InputAdornment from "@mui/material/InputAdornment";
import { Avatar, Menu } from "@mui/material";
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

import { fetchJobs, activateJob, deactivateJob, deleteJob } from "@/@core/services/jobService";

interface MockData {
  id: number;
  title: string;
  company: string;
  applications: number;
  postingDate: string;
  status: string;
}



const JobListTable: React.FC = () => {
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [jobs, setJobs] = React.useState<any[]>([]);
const [loading, setLoading] = React.useState(false);
const [anchorEl, setAnchorEl] = React.useState<(HTMLElement | null)[]>([]);

React.useEffect(() => {
  setAnchorEl(Array(jobs.length).fill(null));
}, [jobs]);


  React.useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobs();
        if (response.status) {
          setJobs(response.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadJobs();
  }, []);

  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

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
  const handleActivate = async (id: number, currentStatus: string) => {
    try {
      if (currentStatus === "active") {
        await deactivateJob(id);
      } else {
        await activateJob(id);
      }
      // Refresh job list
      const response = await fetchJobs();
      setJobs(response.jobs);
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
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

  return (
    <Card
      sx={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        my: (theme) => theme.spacing(4),
        background: "#fff",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Collapse
          easing={"ease-in-out"}
          in={openFilter}
          timeout={500}
          unmountOnExit
          sx={{ mb: 3, boxShadow: 2 }}
        >
          <Paper
            sx={{
              px: 3,
              py: 3,
            }}
          >
            <Typography
              sx={{
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.25rem" },
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
                  <MenuItem value="1">Shortlisted</MenuItem>
                  <MenuItem value="2">Reviewed</MenuItem>
                  <MenuItem value="3">Interviewed</MenuItem>
                  <MenuItem value="4">Hired</MenuItem>
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
                  <MenuItem value="1">Entry Level</MenuItem>
                  <MenuItem value="2">Intermediate</MenuItem>
                  <MenuItem value="3">Mid-Level</MenuItem>
                  <MenuItem value="4">Senior</MenuItem>
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
                  <MenuItem value="1">11, July 2023</MenuItem>
                  <MenuItem value="2">11, Aug 2024</MenuItem>
                  <MenuItem value="3">11, Sept 2021</MenuItem>
                  <MenuItem value="4">11, Jan 2022</MenuItem>
                </CustomTextField>
              </Grid>
              
            </Grid>
          </Paper>
        </Collapse>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 3,
            mx: 1,
          }}
        >
          <CardHeader title="Jobs" sx={{ minWidth: 150 }} />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <CustomTextField
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="small"
              placeholder="Job title, company name, applicant"
              sx={{ maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                    }}
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
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow
                sx={{ background: (theme) => theme.palette.secondary.dark }}
              >
                <TableCellStyled>Job ID</TableCellStyled>
                <TableCellStyled>Title</TableCellStyled>
                <TableCellStyled>Company</TableCellStyled>
                <TableCellStyled>Applications</TableCellStyled>
                <TableCellStyled>Posting Date</TableCellStyled>
                <TableCellStyled>Status</TableCellStyled>
                <TableCellStyled>Actions</TableCellStyled>
              </TableRow>
            </TableHead>
            <TableBody>
            {jobs.map((item, i) => (
  <TableRow key={item.id}>
    <TableCell>{item.id}</TableCell>
    <TableCell>{item.title}</TableCell>
    <TableCell>{item.client?.company_name}</TableCell>
    <TableCell>{item.applicant_count}</TableCell>
    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
    <TableCell align="center">
      <CustomChip
        label={item.status === "active" ? "Active" : item.status === "inactive" ? "Inactive" : "Expired"}
        color={item.status === "active" ? "success" : item.status === "inactive" ? "default" : "error"}
        skin="light"
        size="small"
        sx={{ width: "100%", borderRadius: "5px" }}
      />
    </TableCell>
    <TableCell>
      <Box>
        <IconButton size="small" onClick={(e) => handleRowOptionsClick(e, i)}>
          <Icon icon="tabler:dots-vertical" />
        </IconButton>
        <Menu
          anchorEl={anchorEl[i]}
          open={Boolean(anchorEl[i])}
          onClose={() => handleRowOptionsClose(i)}
        >
          <MenuItem onClick={() => handleActivate(item.id, item.status)}>
            <Icon icon={item.status === "active" ? "tabler:eye-off" : "tabler:eye"} />
            {item.status === "active" ? "Deactivate" : "Activate"}
          </MenuItem>
          <MenuItem onClick={() => handleDelete(item.id)}>
            <Icon icon="fluent:delete-24-regular" />
            Delete
          </MenuItem>
        </Menu>
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
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

export default JobListTable;
