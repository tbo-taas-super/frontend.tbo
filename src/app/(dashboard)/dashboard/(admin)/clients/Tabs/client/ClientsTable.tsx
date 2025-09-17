// *React Imports
import React, { useState, useEffect } from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";

// * Next Imports
import Link from "next/link";

// * Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import { TableCellStyled } from "@/@core/component/mui/tableStyled";
import StyledImage from "@/@core/component/mui/image";
import { ClientData, getClients, activateClient, deactivateClient, deleteClient } from "@/@core/services/ClientService";
import ClientModal from '../../../component/ClientModal';
import CircularProgress from "@mui/material/CircularProgress";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CustomChip from "@/@core/component/mui/chip";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import { Avatar, Menu, TextField } from "@mui/material";
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
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const ClientListTable: React.FC = () => {
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [clients, setClients] = React.useState<ClientData[]>([]);
  const [filteredClients, setFilteredClients] = React.useState<ClientData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<(HTMLElement | null)[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [processingId, setProcessingId] = React.useState<number | null>(null);
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  // Add state for confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);

  // Open confirmation dialog
  const openDeleteConfirm = (client: ClientData) => {
    setClientToDelete(client);
    setDeleteConfirmOpen(true);
  };

  // Close confirmation dialog
  const closeDeleteConfirm = () => {
    setClientToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });

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

const handleToggleActivation = async (client: ClientData) => {
  try {
    setProcessingId(client.id);
    
    let updatedClient;
    const status = typeof client.status === 'string' ? client.status.toLowerCase() : 'inactive';
    
    if (status === 'active') {
      updatedClient = await deactivateClient(client.id);
      setAlert({
        open: true,
        message: 'Client deactivated successfully',
        severity: 'success'
      });
    } else {
      updatedClient = await activateClient(client.id);
      setAlert({
        open: true,
        message: 'Client activated successfully',
        severity: 'success'
      });
    }

setClients(prevClients => 
  prevClients.map(c => 
    c.id === client.id ? { 
      ...c, 
      status: 
        typeof updatedClient.status === 'string' && (updatedClient.status as string).toLowerCase() === 'active'
          ? 'active'
          : 'inactive'
    } : c
  )
);



    const index = filteredClients.findIndex(c => c.id === client.id);
    handleRowOptionsClose(index);
    
  } catch (error) {
    console.error('Error toggling client status:', error);
    setAlert({
      open: true,
      message: error instanceof Error ? error.message : 'Failed to update client status',
      severity: 'error'
    });
  } finally {
    setProcessingId(null);
    setTimeout(() => {
      setAlert(prev => ({...prev, open: false}));
    }, 5000);
  }
};

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      setProcessingId(clientToDelete.id);
      await deleteClient(clientToDelete.id);
      setAlert({
        open: true,
        message: 'Client deleted successfully',
        severity: 'success'
      });
      setClients(prevClients => prevClients.filter(c => c.id !== clientToDelete.id));
      const index = filteredClients.findIndex(c => c.id === clientToDelete.id);
      handleRowOptionsClose(index);
    } catch (error) {
      console.error('Error deleting client:', error);
      setAlert({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to delete client',
        severity: 'error'
      });
    } finally {
      setProcessingId(null);
      closeDeleteConfirm();
      setTimeout(() => {
        setAlert(prev => ({...prev, open: false}));
      }, 5000);
    }
  };

  const toggleFilter = () => setOpenFilter(!openFilter);

  const handleViewClient = (client: ClientData) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClient(null);
  };

  // Filter clients based on status and search value
useEffect(() => {
  console.log("Status changed to:", status); // Debug log
  console.log("Clients:", clients); // Debug log
  let filtered = clients;

  // Apply status filter
  if (status !== "all") {
    filtered = clients.filter(client => 
      typeof client.status === 'string' && client.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Apply search filter with null checks
  if (value) {
    filtered = filtered.filter(client => {
      // Log clients with missing data
      if (!client.company_name || !client.email) {
        console.warn("Client with missing data:", client);
      }
      const companyName = client.company_name || "";
      const email = client.email || "";
      return (
        companyName.toLowerCase().includes(value.toLowerCase()) ||
        email.toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  console.log("Filtered clients:", filtered); // Debug log
  setFilteredClients(filtered);
  setAnchorEl(Array(filtered.length).fill(null));
}, [clients, status, value]);

React.useEffect(() => {
  const fetchClients = async () => {
    try {
      const apiData: ClientData[] = await getClients();
      const normalizedData = apiData.map(client => ({
        ...client,
        status: typeof client.status === 'string' 
          ? client.status.toLowerCase() === 'active' ? 'active' : 'inactive'
          : 'inactive', // Fallback to 'inactive' if status is not a string
        company_name: client.company_name || "", // Ensure string
        email: client.email || "" // Ensure string
      }));
      setClients(normalizedData);
      setFilteredClients(normalizedData);
      setAnchorEl(Array(normalizedData.length).fill(null));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, []);

  return (
    <> 
      {alert.open && (
        <Alert 
          sx={{ 
            position: 'fixed', 
            right: 20, 
            top: 10, 
            zIndex: 1000 
          }} 
          variant="filled" 
          severity={alert.severity}
          onClose={() => setAlert(prev => ({...prev, open: false}))}
        >
          {alert.message}
        </Alert>
      )}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    value={status}
                    onChange={(e) => {
                      console.log("Selected status:", e.target.value); // Debug log
                      setStatus(e.target.value);
                    }}
                    size="small"
                    fullWidth
                    label="Status"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
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
                placeholder="Company name, email"
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
                  <TableCellStyled>Company Information</TableCellStyled>
                  <TableCellStyled>Company Rep Name</TableCellStyled>
                  <TableCellStyled>Company Rep Email</TableCellStyled>
                  <TableCellStyled>Status</TableCellStyled>
                  <TableCellStyled>Actions</TableCellStyled>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">Loading clients...</TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">No clients found</TableCell>
                  </TableRow>
                ) : (
                  filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client, i) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ maxWidth: 85, maxHeight: 85 }}>
                            <StyledImage
                              src={client.company_logo || "/unknown.png"}
                              alt={client.company_name || ""}
                            />
                          </Box>
                          {client.company_name || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>{client.name || ""}</TableCell>
                      <TableCell>{client.email || ""}</TableCell>
                      {/* <TableCell>
                        {client.company_website ? (
                          <Link
                            href={client.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {client.company_website
                              .replace(/(^\w+:|^)\/\//, '')
                              .replace(/\/$/, '')}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell> */}
                 <TableCell
                    align="center"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "semibold",
                    }}
                  >
                    {typeof client.status === 'string' && client.status.toLowerCase() === 'active' ? (
                      <CustomChip
                        label="Active"
                        color="success"
                        skin="light"
                        size="small"
                        sx={{ width: "100%", borderRadius: "5px" }}
                      />
                    ) : (
                      <CustomChip
                        color="default"
                        label="Inactive"
                        skin="light"
                        size="small"
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
                              onClose={() => handleRowOptionsClose(i)}
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
                                sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                                onClick={() => handleViewClient(client)}
                              >
                                <Icon icon="tabler:eye" fontSize={20} />
                                View
                              </MenuItem>
                          <MenuItem
                              sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                              onClick={() => handleToggleActivation(client)}
                              disabled={processingId === client.id}
                            >
                              {processingId === client.id ? (
                                <CircularProgress size={20} sx={{ mr: 2 }} />
                              ) : (
                                <Icon
                                  icon={
                                    typeof client.status === 'string' && client.status.toLowerCase() === 'active'
                                      ? 'tabler:eye-off'
                                      : 'tabler:eye'
                                  }
                                />
                              )}
                              {typeof client.status === 'string' && client.status.toLowerCase() === 'active'
                                ? 'Deactivate'
                                : 'Activate'}
                            </MenuItem>
                              <MenuItem
                                sx={{ fontSize: ".85rem", "& svg": { mr: 2 } }}
                                onClick={() => openDeleteConfirm(client)}
                                disabled={processingId === client.id}
                              >
                                {processingId === client.id ? (
                                  <CircularProgress size={20} sx={{ mr: 2 }} />
                                ) : (
                                  <Icon icon="fluent:delete-24-regular" fontSize={20} />
                                )}
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
        <Dialog
          open={deleteConfirmOpen}
          onClose={closeDeleteConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Client?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {clientToDelete?.company_name || "this client"}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirm}>Cancel</Button>
            <Button onClick={handleDeleteClient} autoFocus color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <TablePagination
          component="div"
          count={filteredClients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ClientModal open={modalOpen} onClose={handleModalClose} client={selectedClient} />
      </Card>
    </>
  );
};

export default ClientListTable;