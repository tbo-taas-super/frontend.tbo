import React, { useEffect, useState } from "react";
import Icon from "@/@core/component/icon";
import StyledImage from "@/@core/component/mui/image";
import { formatNumber } from "@/@core/utils/format";
import Green from "../../../components/assets/green.png";
import Purple from "../../../components/assets/purple.png";
import Brown from "../../../components/assets/brown.png";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { styled } from "@mui/material/styles";
import { getAdminStats } from "@/@core/services/stats";

// Import the getRecruitmentAnalytics function from your services
// import { getRecruitmentAnalytics } from "@/@core/services/analytics";

interface RecruitmentStats {
  total_users: number;
  total_applications: number;
  total_interviews: number;
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  recent_users: {
    id: number;
    name: string;
    email: string;
    joined_date: string;
  }[];
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

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const RecruitmentAnalyticsFlow: React.FC = () => {
  
  const [stats, setStats] = useState<RecruitmentStats>({
    total_users: 0,
    total_applications: 0,
    total_interviews: 0,
    total_jobs: 0,
    active_jobs: 0,
    total_companies: 0,
    recent_users: [],
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load recruitment analytics");
        console.error("Error fetching recruitment analytics:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnalytics();
  }, []);

const analyticsCards = [
  {
    title: "Total Companies Onboarded",
    value: stats.total_companies,
    icon: "ph:building-office-duotone",
    color: "#997A00",
    bg: "#FFF9E5",
    imgSrc: Brown,
  },
  {
    title: "Total Talents Onboarded",
    value: stats.total_users,
    icon: "circum:user",
    color: "#008A5D",
    bg: "#E5FCF5",
    imgSrc: Green,
  },
  {
    title: "Total Jobs Listed",
    value: stats.total_jobs,
    icon: "ion:briefcase-outline",
    color: "#7A0099",
    bg: "#F9E5FF",
    imgSrc: Purple,
  },
  {
    title: "Total Applications",
    value: stats.total_applications,
    icon: "pepicons-print:file",
    color: "#7A0099",
    bg: "#F9E5FF",
    imgSrc: Purple,
  },
  {
    title: "Total Interviews Held",
    value: stats.total_interviews,
    icon: "solar:calendar-line-duotone",
    color: "#997A00",
    bg: "#FFF9E5",
    imgSrc: Brown,
  },
  {
    title: "Active Jobs",
    value: stats.active_jobs,
    icon: "mdi:briefcase-check-outline",
    color: "#008A5D",
    bg: "#E5FCF5",
    imgSrc: Green,
  },
];


  if (loading) {
    return <Typography sx={{ p: 3, textAlign: "center" }}>Loading analytics...</Typography>;
  }

  if (error) {
    return <Typography sx={{ p: 3, textAlign: "center", color: "error.main" }}>{error}</Typography>;
  }

  return (
    <Paper sx={{ boxShadow: "3", borderRadius: 3, overflow: "hidden" }}>
      <CardHeader 
        title={
          <Typography variant="h5" fontWeight="600">
            Analytics
          </Typography>
        } 
        sx={{ 
          bgcolor: '#FFF9E5', 
          borderBottom: '1px solid #997A0020',
          p: 3
        }} 
      />
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {analyticsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatsCard 
                sx={{ 
                  background: card.bg, 
                  color: card.color, 
                  border: `1px solid ${card.color}20`,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mb: 2 
                  }}>
                    <Box sx={{ 
                      position: "relative", 
                      width: 40, 
                      height: 40, 
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center" 
                    }}>
                      <StyledImage 
                        src={card.imgSrc.src} 
                        alt="icon" 
                        sx={{ 
                          position: "absolute", 
                          left: "-.7rem", 
                          top: "-.3rem" 
                        }} 
                      />
                      <Icon icon={card.icon} fontSize="1.75rem" color={card.color} />
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontSize: "15px", 
                        fontWeight: "500", 
                        ml: 1.5 
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600, 
                      fontFamily: "sans-serif",
                      pl: 1
                    }}
                  >
                    {formatNumber(card.value)}
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default RecruitmentAnalyticsFlow;