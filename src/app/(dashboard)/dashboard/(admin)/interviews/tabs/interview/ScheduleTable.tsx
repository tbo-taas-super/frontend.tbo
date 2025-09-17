// *React Imports
import React, { Fragment, useState } from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";
import { useRouter } from "next/router";

// * Custom Component Imports
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import NoData from "@/@core/emptyData/NoData";
import CustomChip from "@/@core/component/mui/chip";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** MUI Imports
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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

const ScheduleTable = () => {
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

  return (
    <Card
      sx={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        my: (theme) => theme.spacing(4),
        background: "#fff",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: (theme) => theme.spacing(3) }}>
        {!smallScreen && <Typography variant="h6">Interviewed</Typography>}

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{ background: (theme) => theme.palette.secondary.light }}
              >
                {/* <TableCellStyled align="left">
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
                <TableCellStyled align="left">Interview ID</TableCellStyled>
                <TableCellStyled align="left">
                  Candidate&nbsp;Name
                </TableCellStyled>
                <TableCellStyled align="center">Job Title</TableCellStyled>
                <TableCellStyled align="left">
                  Interview&nbsp;Date
                </TableCellStyled>
         
                <TableCellStyled align="left">Actions</TableCellStyled> */}
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

export default ScheduleTable;
