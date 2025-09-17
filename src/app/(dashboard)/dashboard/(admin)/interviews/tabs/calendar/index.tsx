// * React Imports
import { useState } from "react";

// * Icon Import
import Icon from "@/@core/component/icon";

// * MUI Import
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// ** Third Party Imports
import DatePicker from "react-datepicker";
import DatePickerWrapper from "@/@core/styles/libs/react-datepicker";

// * Component Imports
import Calendar from "./Calendar";

const InterviewSchedule = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <Grid container spacing={2}>
      <Grid
        item
        sm={0}
        md={4}
        sx={{ display: { xs: "none", lg: "flex" }, flexDirection: "column" }}
      >
        <Button
          variant="contained"
          sx={{
            textTransform: "capitalize",
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "90%",
            py: 2,
            mx: "auto",
            mt: "1.5rem",
            mb: 2,
          }}
        >
          <Icon icon="tabler:plus" />
          <span>Add Event</span>
        </Button>

        <DatePickerWrapper
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            "& .react-datepicker": {
              boxShadow: "none !important",
              border: "none !important",
            },
          }}
        >
          <DatePicker
            inline
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </DatePickerWrapper>

        <Divider sx={{ width: "100%", m: "0 !important" }} />

        {/* <Box>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 500, my: 2 }}>
            Interviews
          </Typography>
          <Typography>All Interviews will be listed here..</Typography>

          <Typography sx={{ fontSize: "1.2rem", fontWeight: 500, mt: 4 }}>
            Events
          </Typography>
          <Typography>All Events will be listed here..</Typography>
        </Box> */}
      </Grid>

      <Grid xs={12} md={12} lg={8} sx={{ mt: 4 }}>
        <Calendar />
      </Grid>
    </Grid>
  );
};

export default InterviewSchedule;
