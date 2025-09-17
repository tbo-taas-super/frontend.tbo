import { SetStateAction, useState, useEffect, ReactNode } from "react";
import Icon from "@/@core/component/icon";
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import CustomChip from "@/@core/component/mui/chip";
import EditAdmin from "./EditAdmin";
import ViewAdmin from "./ViewAdmin";
import { getAdmins, getAdminById, deleteAdmin } from "@/@core/services/adminService";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import { Avatar, Menu, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
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

export type MockData = {
  id: number;
  name: string;
  account_type?: string;
  email: string;
  role: string;
  status: boolean;
  avatarColor?: string;
  avatar?: string | undefined;
  sx?: object;
  created_at?: string;
  lastLogin?: string;
};

export type AdminData = {
  account_type?: ReactNode;
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
};

const AdminsTable = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);
  const [editAdminModal, setEditAdminModal] = useState<boolean>(false);
  const [viewAdminDrawer, setViewAdminDrawer] = useState<boolean>(false);
  const [activeAdmin, setActiveAdmin] = useState<MockData | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [adminToDelete, setAdminToDelete] = useState<{ id: number; index: number } | null>(null);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const toggleEditAdminModal = () => setEditAdminModal((prev) => !prev);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data: AdminData[] = await getAdmins();
        setAdmins(data);
        setAnchorEl(Array(data.length).fill(null));
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const setAdminView = async (admin: MockData) => {
    try {
      const response = await getAdminById(String(admin.id));
      const adminData = response.admin; // Extract nested admin object
      const transformedData: MockData = {
        id: adminData.id,
        name: adminData.name || "N/A",
        email: adminData.email || "N/A",
        role: adminData.account_type || "ADMIN",
        status: adminData.status === "active",
        avatar: adminData.profile_image || undefined,
        avatarColor: adminData.avatarColor || "primary",
        created_at: adminData.created_at || "N/A",
        lastLogin: adminData.updated_at || "N/A",
      };
      setActiveAdmin(transformedData);
      setViewAdminDrawer(true);
    } catch (error) {
      console.error("Error fetching admin by ID:", error);
      alert("Failed to fetch admin details");
    }
  };

  const closeAdminDrawer = () => {
    setViewAdminDrawer(false);
    setActiveAdmin(null);
  };

  const handleDeleteAdmin = (id: number, index: number) => {
    setAdminToDelete({ id, index });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (adminToDelete) {
      try {
        setDeleting(adminToDelete.id);
        await deleteAdmin(String(adminToDelete.id));
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminToDelete.id));
        handleRowOptionsClose(adminToDelete.index);
        alert(`Admin with ID ${adminToDelete.id} deleted successfully`);
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Failed to delete admin");
      } finally {
        setDeleting(null);
        setDeleteConfirmOpen(false);
        setAdminToDelete(null);
      }
    }
  };

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
        {!smallScreen && <Typography variant="h6">Admins</Typography>}

        <Box
          sx={{
            my: 3,
            mx: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-end", md: "space-between" },
          }}
        >
          {smallScreen && <Typography variant="h6">Admins</Typography>}
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
  placeholder="Name, Role"
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
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{ background: (theme) => theme.palette.secondary.dark }}
              >
                <TableCellStyled align="left" sx={{ minWidth: 50 }}>
                  <Checkbox size="small" />
                </TableCellStyled>
                <TableCellStyled align="left">S/N</TableCellStyled>
                <TableCellStyled align="left" sx={{ minWidth: 150 }}>
                  Name
                </TableCellStyled>
                <TableCellStyled align="left">Email</TableCellStyled>
                <TableCellStyled align="left">Role</TableCellStyled>
                <TableCellStyled align="center">Status</TableCellStyled>
                <TableCellStyled align="left">Actions</TableCellStyled>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell align="left">
                    <Checkbox size="small" />
                  </TableCell>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "semibold",
                    }}
                  >
                    {item.status ? (
                      <CustomChip
                        size="small"
                        skin="light"
                        label="Active"
                        color="success"
                        sx={{ width: "100%", borderRadius: "5px" }}
                      />
                    ) : (
                      <CustomChip
                        size="small"
                        skin="light"
                        label="Inactive"
                        color="default"
                        sx={{ width: "100%", borderRadius: "5px" }}
                      />
                    )}
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
                          <MenuItem
                            onClick={() => setAdminView(item as MockData)}
                            sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                          >
                            <Icon icon="tabler:eye" fontSize={20} />
                            View
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDeleteAdmin(item.id, i)}
                            sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                            disabled={deleting === item.id}
                          >
                            <Icon icon="fluent:delete-24-regular" fontSize={20} />
                            Delete
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
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this admin? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            disabled={deleting !== null}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* <EditAdmin
        open={editAdminModal}
        close={toggleEditAdminModal}
        activeAdmin={activeAdmin}
      /> */}

      <ViewAdmin
        open={viewAdminDrawer}
        close={closeAdminDrawer}
        activeAdmin={activeAdmin}
        editModal={toggleEditAdminModal}
      />
    </Card>
  );
};

export default AdminsTable;
