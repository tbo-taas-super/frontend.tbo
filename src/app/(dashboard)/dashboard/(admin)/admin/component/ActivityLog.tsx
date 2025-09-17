import { useEffect, useState } from "react";
import { getAdminStats } from "@/@core/services/stats";

// *Icon Import
import Icon from "@/@core/component/icon";

// *MUI Imports
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface Activity {
  icon: string;
  activity: string;
  timeline: string;
}

interface ActivityProps {
  activity: Activity;
}

const ActivityLog: React.FC<ActivityProps> = ({ activity }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#767F8C",
        background: "#EFF5F5",
        p: 3,
        borderRadius: 1,
        my: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Icon icon={activity.icon} />
        <Typography>{activity.activity}</Typography>
      </Box>
      <Typography sx={{ fontSize: ".875rem" }}>{activity.timeline}</Typography>
    </Box>
  );
};

const ActivityLogs = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getAdminStats();
        if (response && response.recent_users) {
          const formattedActivities = response.recent_users.map((user) => ({
            icon: "tabler:user",
            activity: `${user.name} joined`,
            timeline: new Date(user.joined_date).toLocaleDateString(),
          }));
          setActivities(formattedActivities);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Paper sx={{ p: 3, width: "100%", my: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>Recent Activities</Typography>
        <Button variant="text" size="small" sx={{ textTransform: "capitalize" }}>
          View more
        </Button>
      </Box>

      <Box
        sx={{
          maxHeight: "60vh",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {activities.length > 0 ? (
          activities.map((activity, i) => <ActivityLog key={i} activity={activity} />)
        ) : (
          <Typography sx={{ textAlign: "center", color: "gray", mt: 3 }}>
            No recent activities
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ActivityLogs;
