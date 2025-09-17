// * React Imports
import React, { useEffect, useState } from "react";

// * Icon Import
import Icon from "@/@core/component/icon";

// * Utility Imports
import { formatNumber } from "@/@core/utils/format";

// * Service Import
import { getClientStats } from "@/@core/services/stats"; 

interface StatsData {
  client_statistics?: {
    total_jobs_listed: number;
    total_job_views: number;
    total_applications: number;
    top_performing_jobs: Array<{
      id: number;
      title: string;
      applications: number;
      created_at: string;
    }>;
    hired_candidates: number;
    average_time_to_hire_days: number;
    application_rate: number;
    last_3_applications: Array<{
      id: number;
      job_title: string;
      applicant_name: string;
      status: string;
      applied_date: string;
    }>;
    application_status_counts: {
      SHORTLISTED: number;
      HIRED: number;
    };
  };
}

// * MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

// Types
interface StatCardProps {
  bg: string;
  color: string;
  icon: string;
  title: string;
  value: number | string;
}

interface ClientStats {
  total_users: number;
  total_applications: number;
  total_interviews: number;
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  recent_users: Array<{
    id: number;
    name: string;
    email: string;
    joined_date: string;
  }>;
  client_statistics: {
    total_jobs_listed: number;
    total_job_views: number;
    top_performing_jobs: Array<{
      id: number;
      title: string;
      applications: number;
      created_at: string;
    }>;
    hired_candidates: number;
    average_time_to_hire_days: number;
    total_applications: number;
    application_rate: number;
    last_3_applications: Array<{
      id: number;
      job_title: string;
      applicant_name: string;
      status: string;
      applied_date: string;
    }>;
    application_status_counts: {
      SHORTLISTED: number;
      HIRED: number;
    };
  };
}

interface SupTextProps {
  color?: string;
}

const SupText = styled("span")<SupTextProps>(({ color }) => ({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  color: color || "#008A5D",
}));

const StatCard: React.FC<StatCardProps> = ({ bg, color, icon, title, value }) => (
  <Card
    elevation={0}
    sx={{
      p: 2,
      backgroundColor: bg,
      color: color,
      borderRadius: 2,
      height: "100%",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 3,
      },
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 1,
        "&:last-child": {
          pb: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Icon icon={icon} fontSize="1.75rem" color={color} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: "auto" }}>
        {typeof value === "number" ? formatNumber(value) : value}
      </Typography>
    </CardContent>
  </Card>
);

const StatsOverview: React.FC = () => {
  const [statsData, setStatsData] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getClientStats();
        const transformedData: ClientStats = {
          ...data,
          client_statistics: ((data as unknown) as StatsData).client_statistics || {
            total_jobs_listed: 0,
            total_job_views: 0,
            top_performing_jobs: [],
            hired_candidates: 0,
            average_time_to_hire_days: 0,
            total_applications: 0,
            application_rate: 0,
            last_3_applications: [],
            application_status_counts: {
              SHORTLISTED: 0,
              HIRED: 0,
            },
          },
        };
        setStatsData(transformedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch statistics. Please try again later.");
        console.error("Error fetching client stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Paper sx={{ boxShadow: 2, borderRadius: 3, p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading statistics...
        </Typography>
      </Paper>
    );
  }

  if (error || !statsData) {
    return (
      <Paper sx={{ boxShadow: 2, borderRadius: 3, p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="error">
          {error || "No data available."}
        </Typography>
      </Paper>
    );
  }

  const { client_statistics } = statsData;

  const stats: StatCardProps[] = [
    {
      bg: "#E5FCF5",
      color: "#008A5D",
      icon: "ion:briefcase-outline",
      title: "Total Jobs Listed",
      value: client_statistics.total_jobs_listed,
    },
    {
      bg: "#F9E5FF",
      color: "#7A0099",
      icon: "pepicons-print:file",
      title: "Total Views on Job Posts",
      value: client_statistics.total_job_views,
    },
    {
      bg: "#E6EBFF",
      color: "#001A80",
      icon: "solar:calendar-line-duotone",
      title: "Top Performing Job Posts",
      value: client_statistics.top_performing_jobs.length,
    },
    {
      bg: "#FFF4E5",
      color: "#C77600",
      icon: "mdi:account-check-outline",
      title: "Hired Candidates",
      value: client_statistics.hired_candidates,
    },
    {
      bg: "#E5F6FF",
      color: "#0066B2",
      icon: "mdi:timer-outline",
      title: "Average Time to Hire",
      value: `${client_statistics.average_time_to_hire_days} Days`,
    },
    {
      bg: "#F5F5F5",
      color: "#444444",
      icon: "mdi:chart-timeline-variant",
      title: "Total number of applications",
      value: `${Math.round(client_statistics.total_applications)}`,
    },
  ];

  return (
    <Paper sx={{ boxShadow: 2, borderRadius: 3, overflow: "hidden" }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Statistics Overview
          </Typography>
        }
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          px: 3,
          py: 2,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default StatsOverview;