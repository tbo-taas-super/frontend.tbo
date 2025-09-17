import { useState } from "react";
import Icon from "@/@core/component/icon";
import { MockData } from "./Admins";
import { getInitials } from "@/@core/utils/getIntials";
import CustomAvatar from "@/@core/component/mui/avatar";
import CustomChip from "@/@core/component/mui/chip";
import Paper from "@mui/material/Paper";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(4),
  justifyContent: "space-between",
}));

interface Props {
  open: boolean;
  close: () => void;
  editModal: () => void;
  activeAdmin: MockData | null;
}

const renderClient = (row: MockData) => {
  if (row.avatar && row.avatar.length) {
    return (
      <CustomAvatar
        src={row.avatar}
        sx={{ mr: 2.5, width: 50, height: 50 }}
        skin="light"
      />
    );
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={row.avatarColor || "primary"}
        sx={{
          mr: 2.5,
          width: 100,
          height: 100,
          fontWeight: 500,
          fontSize: (24 / 100) * 100,
        }}
      >
        {getInitials(row.name || "John Doe")}
      </CustomAvatar>
    );
  }
};

const ViewAdmin = ({ open, close, activeAdmin, editModal }: Props) => {
  // Placeholder for activity log (fetch from API)
  const [activityLog, setActivityLog] = useState([
    { date: "2025-06-01", activity: "Logged In", description: "User logged into the system" },
    { date: "2025-06-02", activity: "Updated Profile", description: "Changed email address" },
  ]);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 800, sm: 800 } } }}
    >
      <Header>
        <Button onClick={close} sx={{ color: "#111" }}>
          <Icon icon="basil:caret-left-solid" fontSize={30} />
        </Button>
        <Typography
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: 600,
            fontSize: { xs: "1rem", md: "1.2rem" },
            mr: "4rem",
          }}
        >
          Admin Details
        </Typography>
      </Header>

      <Box>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(8)} !important`,
            px: (theme) => [
              `${theme.spacing(4)} !important`,
              `${theme.spacing(8)} !important`,
            ],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {activeAdmin && <Box>{renderClient(activeAdmin)}</Box>}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "1.4rem" }}>
                {activeAdmin?.name || "N/A"}
              </Typography>
              {activeAdmin?.status ? (
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
            </Box>
          </Box>
          <Box
            sx={{ background: "#f7f7f7", borderRadius: 3, px: 3, py: 1, my: 4 }}
          >
            <Stack direction="row" sx={{ mt: 4, gap: 3 }}>
              <Box>
                <Typography sx={{ color: "#858585", fontVariant: "small-caps", mb: 2 }}>
                  Role
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {activeAdmin?.role || "ADMIN"}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ color: "#858585", fontVariant: "small-caps", mb: 2 }}>
                  Admin ID
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  Admin-00{activeAdmin?.id || "N/A"}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" sx={{ mt: 4, gap: 3 }}>
              <Box>
                <Typography sx={{ color: "#858585", fontVariant: "small-caps", mb: 2 }}>
                  Email Address
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {activeAdmin?.email || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ color: "#858585", fontVariant: "small-caps", mb: 2 }}>
                  Date Joined
                </Typography>
             <Typography sx={{ fontSize: "1rem" }}>
              {activeAdmin?.created_at ? new Date(activeAdmin.created_at).toISOString().slice(0, 10) : "N/A"}
            </Typography>

              </Box>
            </Stack>

            <Stack direction="row" sx={{ mt: 4, gap: 3 }}>
              {/* <Box>
                <Typography sx={{ color: "#858585", fontVariant: "small-caps", mb: 2 }}>
                  Last Login
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {activeAdmin?.lastLogin || "N/A"}
                </Typography>
              </Box> */}
            </Stack>

            {/* Permissions section commented out as requested
            <Box sx={{ my: 4 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#39353D",
                  fontSize: { xs: "1rem", sm: "1.2rem" },
                }}
              >
                Permissions
              </Typography>
              <Stack sx={{ width: { xs: "100%", md: "90%" } }}>
                {permission.map((permission, i) => (
                  <Box key={i}>
                    <PermissionCard permission={permission} />
                  </Box>
                ))}
              </Stack>
            </Box>
            */}

            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#39353D",
                  fontSize: { xs: "1rem", sm: "1.2rem" },
                  mb: 2,
                }}
              >
                Activity Log
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ background: (theme) => theme.palette.secondary.dark }}>
                      <TableCell align="left">Date</TableCell>
                      <TableCell align="left" sx={{ minWidth: 150 }}>
                        Activity
                      </TableCell>
                      <TableCell align="left">Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityLog.length > 0 ? (
                      activityLog.map((log, i) => (
                        <TableRow key={i}>
                          <TableCell>{log.date}</TableCell>
                          <TableCell>{log.activity}</TableCell>
                          <TableCell>{log.description}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No activity log available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </DialogContent>
{/* 
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: (theme) => `${theme.spacing(8)} !important`,
            mt: (theme) => `${theme.spacing(4)} !important`,
          }}
        >
          <Button
            type="button"
            variant="contained"
            sx={{ textTransform: "capitalize", minWidth: 120 }}
            onClick={editModal}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outlined"
            sx={{ textTransform: "capitalize", minWidth: 120 }}
          >
            Deactivate
          </Button>
          <Button type="submit" variant="text" sx={{ mr: 2 }}>
            <Icon icon="fluent:delete-24-regular" fontSize={25} />
          </Button>
        </DialogActions> */}
      </Box>
    </Drawer>
  );
};

export default ViewAdmin;
