import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

export default function InterviewCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [visibleDays, setVisibleDays] = useState<dayjs.Dayjs[]>([]);

  useEffect(() => {
    const days = Array.from({ length: 14 }, (_, i) =>
      currentDate.add(i - 3, "day")
    );
    setVisibleDays(days);
  }, [currentDate]);

  const interviewDates = [
    dayjs("2023-09-12"),
    dayjs("2023-09-13"),
    dayjs("2023-09-15"),
  ];

  const handlePrev = () => {
    setCurrentDate((prevDate) => prevDate.subtract(7, "day"));
  };

  const handleNext = () => {
    setCurrentDate((prevDate) => prevDate.add(7, "day"));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "100%",
        margin: "auto",
        overflow: "hidden",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" component="h2">
          Interview Calendar
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h3">
            {currentDate.format("MMMM YYYY")}
          </Typography>
          <Box>
            <IconButton size="small" color="primary" onClick={handlePrev}>
              <ChevronLeft />
            </IconButton>
            <IconButton size="small" color="primary" onClick={handleNext}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {visibleDays.map((day, i) => (
              <Grid item xs={12 / 7} key={i} sx={{ p: 2 }}>
                <Typography variant="subtitle2" align="center">
                  {day.format("dd")}
                </Typography>
              </Grid>
            ))}
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {visibleDays.map((date) => (
              <Grid item xs={12 / 7} key={date.toString()}>
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "nowrap",
                    border: 1,
                    p: 2,

                    borderColor: date.isSame(dayjs(), "day")
                      ? "primary.main"
                      : "divider",
                    borderRadius: 3,
                    opacity: date.isSame(currentDate, "month") ? 1 : 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={
                      date.isSame(dayjs(), "day")
                        ? "primary.primary"
                        : "text.secondary"
                    }
                    sx={{ minWidth: 20, textAlign: "right" }}
                  >
                    {date.format("D")}
                  </Typography>

                  {interviewDates.some((interviewDate) =>
                    interviewDate.isSame(date, "day")
                  ) && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        mt: 0.5,
                      }}
                    />
                  )}
                </Paper>
              </Grid>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
