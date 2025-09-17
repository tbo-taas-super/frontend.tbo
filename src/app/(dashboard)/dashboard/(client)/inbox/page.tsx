"use client";
import { Badge, Box, Grid, Stack, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";

const Inbox = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "",
      time: "",
      unread: true,
    },
    {
      id: 2,
      message: "",
      time: "",
      unread: false,
    },
    {
      id: 3,
      message: "",
      time: "",
      unread: true,
    },
  ]);

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };
  

  return (
    <Box sx={{ padding: 3 }}>
      <Stack direction="row" alignItems="center" gap={2} sx={{ marginBottom: 2 }}>
        <Badge badgeContent={notifications.filter((n) => n.unread).length} color="primary">
          <NotificationsIcon sx={{ fontSize: 30 }} />
        </Badge>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Inbox
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {notifications.map((notification) => (
          <Grid item xs={12} key={notification.id}>
            <Box
              sx={{
                border: "1px solid #E4E5E8",
                borderRadius: 2,
                backgroundColor: notification.unread ? "#F0F7FF" : "#FFFFFF",
                padding: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack>
                <Typography variant="body1" sx={{ fontWeight: notification.unread ? 600 : 400 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" sx={{ color: "gray" }}>
                  {notification.time}
                </Typography>
              </Stack>
              <IconButton onClick={() => deleteNotification(notification.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Inbox;
