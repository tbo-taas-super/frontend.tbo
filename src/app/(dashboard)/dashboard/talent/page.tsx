"use client";
import { useEffect, useState } from "react";
import { TextOnlyPill } from "@/@core/utils/pills";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getTalentStats, TalentStatsData } from "@/@core/services/TalentStats";
import { getCurrentUser } from "@/@core/services/user";
import TalentDashboardCards from "@/@core/component/TalentDashboardCards";

export default function TalentHome() {
  const { data: session } = useSession();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<TalentStatsData | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes?.user);
  
        const statsRes = await getTalentStats();
        setStats(statsRes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <main>
      <Stack gap={3} sx={{ px: 2, py: 4 }}>
        {/* HEADER */}
        <Typography sx={{ fontWeight: 700, color: "#39353D", fontSize: "24px" }}>
          Dashboard
        </Typography>

        {/* HERO SECTION */}
        <Grid
          container
          spacing={0}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 3,
            minHeight: { xs: "auto", md: 350 },
          }}
        >
          {/* Left - Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/woman.jpeg"
              alt="Find Work"
              sx={{
                width: "100%",
                height: { xs: 250, md: "100%" },
                objectFit: "cover",
                borderRadius: { xs: "8px 8px 0 0", md: "8px 0 0 8px" },
              }}
            />
          </Grid>

          {/* Right - Text & CTA */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              backgroundColor: "#730E19",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", md: "flex-start" },
              padding: { xs: 3, md: 5 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="subtitle2" sx={{ textTransform: "uppercase", fontWeight: 600 }}>
              Welcome, {user?.name || "Talent"}!
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
              Here’s a Quick Snapshot of Your Analytics
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3, opacity: 0.9 }}>
              Level Up Your Career—Thousands of Opportunities Await!
            </Typography>
          </Grid>
        </Grid>

        {/* DASHBOARD CARDS */}
   {/* UPCOMING INTERVIEWS */}
{/* DASHBOARD CARDS */}
<Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 1 }}>
  {[
    {
      title: "Latest Saved Job",
      value: stats?.latest_saved_jobs?.[0]?.job?.title || "No saved jobs",
    },
    {
      title: "Latest Applied Job",
      value:
        stats?.latest_applied_jobs?.[0]
          ? `${stats.latest_applied_jobs[0].job.title} (${stats.latest_applied_jobs[0].status})`
          : "No applied jobs",
    },
    {
      title: "Next Interview",
      value:
        stats?.latest_interviews?.find((i: any) => i.status === "scheduled")
          ? `With ${
              stats.latest_interviews.find((i: any) => i.status === "scheduled")
                ?.interviewer_name
            } on ${
              stats.latest_interviews.find((i: any) => i.status === "scheduled")
                ?.interview_date
            }`
          : "No upcoming interviews",
    },
  ].map((item, index) => (
    <Grid key={index} item xs={12} sm={4}>
      <Box
        sx={{
          border: "1px solid #E4E5E8",
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 180,
          textAlign: "center",
          transition: "0.3s",
          "&:hover": {
            boxShadow: 4,
            transform: "scale(1.02)",
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {item.title}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {item.value}
        </Typography>
      </Box>
    </Grid>
  ))}
</Grid>

<TalentDashboardCards stats={stats} />

      </Stack>
    </main>
  );
}
