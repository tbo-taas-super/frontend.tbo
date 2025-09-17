"use client";

import QuickActions from "./component/QuickActions";
import StatHeader from "./component/StatHeader";
import {
  ApplicationUserChart,

} from "./component/ApplicationsUsersChart";
import ActivityLog from "./component/ActivityLog";
import { Box } from "@mui/material";

const Admin = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <StatHeader />
      {/* <QuickActions /> */}
      <ApplicationUserChart />
      {/* <JobApplicationChart /> */}
      <ActivityLog />
    </Box>
  );
};

export default Admin;
