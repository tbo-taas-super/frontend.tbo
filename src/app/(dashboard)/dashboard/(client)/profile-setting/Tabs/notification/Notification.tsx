// * React Imports
import React from "react";

// * MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import DeactivateAccount from "../../../../components/delete-account";
interface SettingsProps {
  title: string;
  text: string;
}

const settings: SettingsProps[] = [
  {
    title: "New job created",
    text: "Receive an alert when a new job is created",
  },
  {
    title: "Interview alert",
    text: "Receive an alert when a you have a new interview scheduled",
  },
  {
    title: "Candidate selection",
    text: "Be notified when a candidate has been selected",
  },
  {
    title: "Notification alerts",
    text: "Be notified when an alerts drops",
  },
];

interface SettingsCardProps {
  settings: SettingsProps;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ settings }) => {
  return (
    <>
      <Box
        sx={{
          p: 3,
          mb: 1,
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#39353D",
              fontSize: "1rem",
            }}
          >
            {settings.title}
          </Typography>
          <Typography sx={{ fontSize: "13px", mb: "10px" }}>
            {settings.text}
          </Typography>
        </Box>
        <Switch color="primary" size="medium" />
      </Box>
      <Divider variant="inset" />
    </>
  );
};

const Notification = () => {
  return (
    <main>
      <Box sx={{ mt: 4 }}>
      
       

        <Divider variant="middle" />
        <DeactivateAccount />
        <Divider variant="middle" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            my: 4,
          }}
        >
          
        </Box>
      </Box>
    </main>
  );
};

export default Notification;
