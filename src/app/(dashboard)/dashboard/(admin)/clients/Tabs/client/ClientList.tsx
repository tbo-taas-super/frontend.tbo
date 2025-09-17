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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider, CircularProgress } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";

// Import the client service
import { getClients, ClientData } from "@/@core/services/ClientService";

interface ClientCardProps {
  client: ClientData;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 70, maxHeight: 70 }}>
          <StyledImage src={client.company_logo} alt={client.company_name} />
        </Box>
        <Typography
          sx={{ fontSize: ".85rem", mb: "-10px", fontWeight: "bold" }}
        >
          {client.company_name || client.name}
        </Typography>
        <Typography sx={{ fontSize: ".685rem" }}>
          {client.industry || "Not specified"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: ".6rem", fontWeight: "bold" }}>
            Employees: {client.number_of_employees || "N/A"}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography sx={{ fontSize: ".6rem", fontWeight: "bold" }}>
            {client.status}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const ClientsTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const fetchedClients = await getClients();
        setClients(fetchedClients);
        setTotalCount(fetchedClients.length);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch clients");
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchValue.toLowerCase()) || 
    client.company_name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get current page of clients
  const currentClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
          }}
        >
          <CardHeader title="Client List" sx={{ minWidth: 150 }} />

          <CustomTextField
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="small"
            placeholder="Client, Company name..."
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
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {currentClients.length > 0 ? (
              currentClients.map((client) => (
                <Grid item xs={6} sm={3} md={2.4} key={client.id}>
                  <ClientCard client={client} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', p: 5 }}>
                  <Typography>No clients found</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
      
      {!loading && !error && (
        <TablePagination
          component="div"
          count={filteredClients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Card>
  );
};

export default ClientsTable;