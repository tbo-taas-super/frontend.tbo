import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { getClientStats } from "@/@core/services/stats"; // Adjust path as needed

// Types
interface Application {
  title: string;
  reviewed: number;
  shortlisted: number;
  rejected: number;
}

interface ClientStats {
  total_applications: number;
  client_statistics: {
    application_status_counts: {
      SHORTLISTED: number;
      HIRED: number;
      [key: string]: number;
    };
    last_3_applications: Array<{
      id: number;
      job_title: string;
      applicant_name: string;
      status: string;
      applied_date: string;
    }>;
  };
}

interface ApplicationRowProps {
  data: Application;
}

// ApplicationRow Component
const ApplicationRow: React.FC<ApplicationRowProps> = ({ data }) => {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}>
        {data.title}
      </Typography>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fff",
        }}
      >
        <Stack sx={{ flex: 1 }}>
          <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: "1.25rem" }}>
            {data.reviewed}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            Reviewed
          </Typography>
        </Stack>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Stack sx={{ flex: 1 }}>
          <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: "1.25rem", color: "#1976d2" }}>
            {data.shortlisted}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            Shortlisted
          </Typography>
        </Stack>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Stack sx={{ flex: 1 }}>
          <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: "1.25rem", color: "#d32f2f" }}>
            {data.rejected}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            Rejected
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

// Applications Component
const Applications: React.FC = () => {
  const [statsData, setStatsData] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getClientStats();
        const transformedData: ClientStats = {
          total_applications: data.total_applications,
          client_statistics: data.client_statistics || {}, // Adjusted to match the actual property name
        };
        setStatsData(transformedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch application data. Please try again later.");
        console.error("Error fetching client stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 2, p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading applications...
        </Typography>
      </Card>
    );
  }

  if (error || !statsData) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 2, p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="error">
          {error || "No application data available."}
        </Typography>
      </Card>
    );
  }

  // Derive application data
  const rejectedCount = statsData.client_statistics.last_3_applications.filter(
    (app) => app.status === "REJECTED"
  ).length;

  const applicationData: Application[] = [
    {
      title: "All Applications",
      reviewed: statsData.total_applications,
      shortlisted: statsData.client_statistics.application_status_counts.SHORTLISTED || 0,
      rejected: rejectedCount,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        width: "100%",
        maxWidth: "1600px",
        mx: "auto",
        mt: { xs: 4, md: 0 },
        overflow: "hidden",
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Applications
          </Typography>
        }
        action={
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: "capitalize", fontWeight: 500 }}
          >
            View all
          </Button>
        }
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 3,
          py: 2,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        {applicationData.map((item, i) => (
          <ApplicationRow key={i} data={item} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Applications;