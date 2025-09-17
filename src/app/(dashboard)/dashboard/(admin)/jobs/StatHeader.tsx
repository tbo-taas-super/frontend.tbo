// * React Imports
import React, { useEffect, useState } from "react";

// * API Service
import { getAdminStats } from "@/@core/services/stats";

// * Icon Import
import Icon from "@/@core/component/icon";

// * Utility Imports
import StyledImage from "@/@core/component/mui/image";
import { formatNumber } from "@/@core/utils/format";

// * Image Imports
import Green from "../../components/assets/green.png";
import Purple from "../../components/assets/purple.png";
import Brown from "../../components/assets/brown.png";
import Red from "../../components/assets/red.png";

// * MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";

const SupText = styled("span")(({ color }: { color?: string }) => ({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  color: color || "#008A5D",
}));

const StatHeader: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 3, textAlign: "center" }}>Loading stats...</Typography>;
  }

  if (error) {
    return <Typography sx={{ p: 3, textAlign: "center", color: "red" }}>{error}</Typography>;
  }

  return (
    <Paper sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}>
      <Grid container spacing={4}>
        {[
          { title: "Total Number of Jobs", value: stats?.total_jobs, color: "#008A5D", bg: "#E5FCF5", icon: "circum:user", img: Green },
          { title: "Total Number of Applications", value: stats?.total_applications, color: "#7A0099", bg: "#F9E5FF", icon: "pepicons-print:file", img: Purple },
          { title: "Total Number of Companies", value: stats?.total_companies, color: "#997A00", bg: "#FFF9E5", icon: "ph:building-office-duotone", img: Brown },
          { title: "Total Number of Active Jobs", value: stats?.active_jobs, color: "#C01729", bg: "#FFF0F1", icon: "ion:briefcase-outline", img: Red },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%", p: 2, background: item.bg, color: item.color }}>
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "sans-serif" }}>
                    {formatNumber(item.value || 0)}
                  </Typography>
                </Stack>
                <Box sx={{ position: "relative", width: 50, height: 50 }}>
                  <StyledImage src={item.img.src} alt="icon adornment" sx={{ position: "absolute", left: "-.7rem", top: "-.3rem" }} />
                  <Icon icon={item.icon} fontSize="2.85rem" color={item.color} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default StatHeader;
