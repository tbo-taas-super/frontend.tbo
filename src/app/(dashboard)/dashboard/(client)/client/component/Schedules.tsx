// *React Imports
import React from "react";

// *MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

interface Schedules {
  title: string;
  message: string;
  time: string;
}

interface ScheduleCardProps {
  data: Schedules;
}

const data: Schedules[] = [
  {
    title: "Shortlist candidates for Interview",
    message:
      "This is to Notify you that the list of reviewed candidates has been sent for your approval..",
    time: "10:30 AM",
  },
  {
    title: "Shortlist candidates for Interview",
    message:
      "This is to Notify you that the list of reviewed candidates has been sent for your approval..",
    time: "10:30 AM",
  },
  {
    title: "Shortlist candidates for Interview",
    message:
      "This is to Notify you that the list of reviewed candidates has been sent for your approval..",
    time: "10:30 AM",
  },
  {
    title: "Shortlist candidates for Interview",
    message:
      "This is to Notify you that the list of reviewed candidates has been sent for your approval..",
    time: "10:30 AM",
  },
];

const ScheduleCard: React.FC<ScheduleCardProps> = ({ data }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
        }}
      >
        <Typography sx={{ mb: 1, mt: 3, fontWeight: "bold" }}>
          {data.title}
        </Typography>
        <Typography
          sx={{
            mb: 1,
            mt: 3,
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: ".857rem", sm: "1rem" },
            fontWeight: "semibold",
          }}
        >
          {data.time}
        </Typography>
      </Box>
      <Typography sx={{ width: { xs: "100%", md: "90%" } }}>
        {data.message.length > 120
          ? data.message.slice(0, 25) + "..."
          : data.message}
      </Typography>
      <Divider sx={{ my: 2 }} variant="middle" />
    </Box>
  );
};

const Schedules: React.FC = () => {
  return (
    <Box
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 3,
        mt: { xs: 4, md: 0 },
        background: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
        >
          Schedules
        </Typography>

        <Button
          variant="text"
          size="medium"
          sx={{ textTransform: "capitalize" }}
        >
          View all
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mx: "auto", width: "100%" }}>
        {data.map((item, i) => {
          return (
            <Grid key={i} xs={12}>
              <ScheduleCard data={item} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Schedules;
