// *React Imports
import React, { Fragment, useState } from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";
import { useRouter } from "next/router";

// * Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import NoData from "@/@core/emptyData/NoData";
import CustomChip from "@/@core/component/mui/chip";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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

interface MockData {
  id: number;
  name: string;
  email: string;
  job: string;
  date: string;
  status: string;
}

const data: MockData[] = [
  // {
  //   id: 1289,
  //   name: "John Doe",
  //   email: "DqkR8@mail.com",
  //   job: "Software Engineer",
  //   date: "2022-01-01",
  //   status: "rejected",
  // },
  // {
  //   id: 2412,
  //   name: "Sarah Doe",
  //   email: "sara@mail.com",
  //   job: "Designer",
  //   date: "2021-01-01",
  //   status: "hired",
  // },
  // {
  //   id: 2129,
  //   name: "Rizzy Elesius",
  //   email: "sara@mail.com",
  //   job: "Human Resource",
  //   date: "2024-02-01",
  //   status: "under review",
  // },
  // {
  //   id: 2129,
  //   name: "Rizzy Elesius",
  //   email: "sara@mail.com",
  //   job: "Human Resource",
  //   date: "2024-02-01",
  //   status: "Reviewed",
  // },
  // {
  //   id: 2129,
  //   name: "Rizzy Elesius",
  //   email: "sara@mail.com",
  //   job: "Human Resource",
  //   date: "2024-02-01",
  //   status: "shortlisted",
  // },
  // {
  //   id: 2129,
  //   name: "Rizzy Elesius",
  //   email: "sara@mail.com",
  //   job: "Human Resource",
  //   date: "2024-02-01",
  //   status: "interviewed",
  // },
];

const InterviewedTable = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>(
    Array(data?.length)?.fill(null)
  );

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
      <CardContent sx={{ p: (theme) => theme.spacing(3) }}>
        {!smallScreen && <Typography variant="h6">Interviewed</Typography>}

        <Collapse
          easing={"ease-in-out"}
          in={openFilter}
          timeout={500}
          unmountOnExit
          sx={{ mb: 3, boxShadow: 4 }}
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
              {/* <Grid item xs={6} sm={2}>
                <CustomTextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  placeholder="Senior, mid-level, entry..."
                  fullWidth
                  label="Comment"
                >
                  <MenuItem value="0">Good</MenuItem>
                  <MenuItem value="1">Satifactory</MenuItem>
                  <MenuItem value="2">11, Aug 2024</MenuItem>
                  <MenuItem value="3">11, Sept 2021</MenuItem>
                  <MenuItem value="4">11, Jan 2022</MenuItem>
                </CustomTextField>
              </Grid> */}
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
          {smallScreen && <Typography variant="h6">Interviewed</Typography>}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 400,
            }}
          >
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
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{ background: (theme) => theme.palette.secondary.dark }}
              >
                <TableCellStyled align="left" sx={{ minWidth: 50 }}>
                  <Checkbox
                    size="small"
                    // name={"all-checked"}
                    // onChange={() => {
                    //   if (allChecked) {
                    //     setAllChecked(false)
                    //     setChecked([])
                    //   } else {
                    //     setAllChecked(true)
                    //     setChecked(PayrollData?.map(p => p?.id))
                    //   }
                    // }}
                  />
                </TableCellStyled>
                <TableCellStyled align={"left"}>ID</TableCellStyled>
                <TableCellStyled align="left" sx={{ minWidth: 150 }}>
                  Name
                </TableCellStyled>
                <TableCellStyled align="left">Email</TableCellStyled>
                <TableCellStyled align="center">Experience</TableCellStyled>
                <TableCellStyled align="left">
                  Date&nbsp;(Applied)
                </TableCellStyled>
                <TableCellStyled align="center">Status</TableCellStyled>
                <TableCellStyled align="left">Actions</TableCellStyled>
              </TableRow>
            </TableHead>
            <TableBody>
              <Fragment>
                {data?.length === 0 && (
                  <tr>
                    <td colSpan={12}>
                      <NoData />
                    </td>
                  </tr>
                )}
              </Fragment>
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

export default InterviewedTable;
