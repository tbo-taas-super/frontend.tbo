import { Box, Grid, Typography, Button, Divider, Link } from "@mui/material";
import { AccessTime, CalendarToday } from "@mui/icons-material";

const TalentDashboardCards = ({ stats }: { stats: any }) => {
  const savedJob = stats?.latest_saved_jobs?.[0];
  const appliedJob = stats?.latest_applied_jobs?.[0];
  const upcomingInterview = stats?.latest_interviews?.find((i: any) => i.status === "scheduled");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour);
    const m = parseInt(minute);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <Grid container spacing={2}>
      {/* Saved Job */}
      <Grid item xs={12} md={4}>
        <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} border="1px solid #E4E5E8">
          <Typography variant="h6" fontWeight={600}>Saved Jobs</Typography>
          <Divider sx={{ my: 1 }} />
          {savedJob ? (
            <>
              <Typography fontWeight={500}>{formatDate(savedJob.created_at)}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                <Typography>10:00 - 10:30 (30 mins)</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Link href="#" underline="hover">Company Website</Link>
              </Box>
              <Box mt={2}>
                {/* <img src="/company-logo.png" alt="Company Logo" width={32} height={32} /> */}
                <Typography fontWeight={600}>Company Name</Typography>
                <Typography variant="body2">{savedJob.job?.title}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                {/* <Button variant="outlined" color="error">Remove</Button>
                <Button variant="contained" color="error">Apply Now</Button> */}
              </Box>
            </>
          ) : (
            <Typography>No saved jobs</Typography>
          )}
        </Box>
      </Grid>

      {/* Applied Job */}
      <Grid item xs={12} md={4}>
        <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} border="1px solid #E4E5E8">
          <Typography variant="h6" fontWeight={600}>Job Applied</Typography>
          <Divider sx={{ my: 1 }} />
          {appliedJob ? (
            <>
              <Typography fontWeight={500}>{formatDate(appliedJob.created_at)}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                <Typography>09:30 - 10:00 (30 mins)</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Typography>Status: {appliedJob.status}</Typography>
              </Box>
              <Box mt={2}>
                {/* <img src="/company-logo.png" alt="Company Logo" width={32} height={32} /> */}
                <Typography fontWeight={600}>Company Name</Typography>
                <Typography variant="body2">{appliedJob.job?.title}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                {/* <Button variant="outlined" color="error">Withdraw</Button>
                <Button variant="contained" color="error">View Details</Button> */}
              </Box>
            </>
          ) : (
            <Typography>No applied jobs</Typography>
          )}
        </Box>
      </Grid>

      {/* Upcoming Interview */}
      <Grid item xs={12} md={4}>
        <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} border="1px solid #E4E5E8">
          <Typography variant="h6" fontWeight={600}>Upcoming Interviews</Typography>
          <Divider sx={{ my: 1 }} />
          {upcomingInterview ? (
            <>
              <Typography fontWeight={500}>{formatDate(upcomingInterview.interview_date)}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                <Typography>{formatTime(upcomingInterview.interview_time)} (30 mins)</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Typography>{upcomingInterview.interview_location}</Typography>
              </Box>
              <Box mt={2}>
                {/* <img src="/google-logo.png" alt="Company Logo" width={32} height={32} /> */}
                <Typography fontWeight={600}>{upcomingInterview.interviewer_name}</Typography>
                <Typography variant="body2">{upcomingInterview.interviewer_department} Department</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                {/* <Button variant="outlined" color="error">Reschedule</Button>
                <Button variant="contained" color="error">Attend Now</Button> */}
              </Box>
            </>
          ) : (
            <Typography>No upcoming interviews</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default TalentDashboardCards;
