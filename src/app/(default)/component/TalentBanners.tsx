// * React Imports
import React, { useState, useEffect } from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

//** MUI Import
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
// Feature card component
const FeatureCard = ({ icon, title, description } : any) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      p: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 20px rgba(0,0,0,0.08)"
      }
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(220, 38, 38, 0.1)",
          borderRadius: "50%",
          p: 1.5,
          mr: 2,
          color: "#B91C1C"
        }}
      >
        <Icon icon={icon} fontSize={24} />
      </Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      {description}
    </Typography>
  </Card>
);

const WhatWeOfferSection: React.FC = () => {
  // Features for Companies
  const companyFeatures = [
    {
      icon: "mdi:magnify",
      title: "Talent Search",
      description: "Access our extensive database of pre-vetted professionals across various industries."
    },
    {
      icon: "mdi:handshake",
      title: "Smart Matching",
      description: "Our AI-powered matching system connects you with candidates that truly fit your requirements."
    },
    {
      icon: "mdi:account-group",
      title: "Team Building",
      description: "Build high-performing teams with our collaborative hiring tools and assessment features."
    },
    {
      icon: "mdi:chart-line",
      title: "Analytics",
      description: "Track recruitment performance with detailed analytics and actionable insights."
    }
  ];

  // Features for Talents
  const talentFeatures = [
    {
      icon: "mdi:briefcase-search",
      title: "Job Matching",
      description: "Get matched with opportunities that align with your skills, experience, and career goals."
    },
    {
      icon: "mdi:certificate",
      title: "Skill Validation",
      description: "Showcase your verified skills and certifications to stand out to employers."
    },
    {
      icon: "mdi:account-network",
      title: "Career Growth",
      description: "Access professional development resources and networking opportunities."
    },
    {
      icon: "mdi:clock-time-four",
      title: "Flexible Options",
      description: "Find full-time, part-time, contract, or remote opportunities that suit your lifestyle."
    }
  ];

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  background: theme.palette.primary.light,
  color: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  "&:focus, &:hover": {
    background: theme.palette.primary.light,
  },
}));

// Enhanced styled components
const GradientPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(8, 2),
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
  boxShadow: `0 10px 40px -10px ${theme.palette.primary.main}40`,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(10, 4)
  }
}));

const FloatingIconButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: `0 8px 20px -5px ${theme.palette.primary.main}60`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 12px 25px -5px ${theme.palette.primary.main}80`,
    background: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  }
}));

const HoverCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  transition: "all 0.4s ease",
  background: theme.palette.background.paper,
  boxShadow: `0 8px 25px -15px ${theme.palette.text.primary}40`,
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 20px 30px -10px ${theme.palette.text.primary}30`,
    "&::before": {
      opacity: 1,
    }
  }
}));

const GlowText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  position: "relative",
  display: "inline-block",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -5,
    left: "25%",
    width: "50%",
    height: 3,
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
    borderRadius: 3
  }
}));
const CARD_ICONS = {
  jobHunt: "icon-park-twotone:doc-search",
  hiringHunt: "mdi:building",
  recruitment: "tabler:user-search"
};
const cardData = [
  {
    id: "jobHunt",
    title: "Job Hunt",
    icon: CARD_ICONS.jobHunt,
    content: "We recommend employers from all around the world to help you secure your dream Job.",
    highlight: "Global Opportunities"
  },
  {
    id: "hiringHunt",
    title: "Hiring Hunt",
    icon: CARD_ICONS.hiringHunt,
    content: "We offer a wide selection of qualified talents you can choose from to add that glow to your team.",
    highlight: "Top Talent"
  },
  {
    id: "recruitment",
    title: "Recruitment Process",
    icon: CARD_ICONS.recruitment,
    content: "We handle the screening and interview process to find the perfect fit for your company.",
    highlight: "Streamlined Workflow"
  }
];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation sequence
  useEffect(() => {
    setIsVisible(true);
  }, []);


  return (
    <Container maxWidth="xl" sx={{ py: 8 , marginBottom : "50px"}}>
  <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          fontWeight={700} 
          sx={{ 
            mb: 2,
            background: "linear-gradient(90deg, #991B1B 0%, #DC2626 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          What We Offer
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto" }}>
          Connecting top talent with leading companies through our innovative platform
        </Typography>
      </Box>
        {/* Enhanced card grid */}
             <Box
              sx={{
                maxWidth: "1200px",
                mx: "auto",
                position: "relative",
                zIndex: 2,
                margin: "40px"
              }}
            >
              <Grid container spacing={4}>
                {cardData.map((card, index) => (
                  <Grid item xs={12} md={6} lg={4} key={card.id}>
                    <Zoom 
                      in={isVisible} 
                      style={{ transitionDelay: `${200 * index}ms` }}
                      timeout={700}
                    >
                      <HoverCard>
                        <FloatingIconButton
                          sx={{
                            p: theme.spacing(3),
                            mb: 2
                          }}
                        >
                          <Icon icon={card.icon} fontSize={32} />
                        </FloatingIconButton>
                        
                        <CardHeader
                          title={card.title}
                          sx={{ 
                            p: 0, 
                            mb: 1,
                            "& .MuiCardHeader-title": {
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color: theme.palette.primary.main
                            }
                          }}
                        />
                        
                        <Chip 
                          label={card.highlight} 
                          size="small"
                          sx={{ 
                            mb: 2,
                            background: theme.palette.primary.light,
                            color: theme.palette.primary.main,
                            fontWeight: 500
                          }} 
                        />
                        
                        <CardContent sx={{ p: 0, pt: 2 }}>
                          <Typography variant="body1" color="text.secondary">
                            {card.content}
                          </Typography>
                        </CardContent>
                      </HoverCard>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
    

      <Grid container spacing={4}>
        {/* Companies Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              border: "1px solid #fecaca",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 1, color: "#991B1B" }}>
                For Companies
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 4, color: "#475569" }}>
                Everything you need to find and hire top talent
              </Typography>

              <Grid container spacing={3}>
                {companyFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={`company-${index}`}>
                    <FeatureCard {...feature} />
                  </Grid>
                ))}
              </Grid>
{/* 
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#A20514",
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    boxShadow: "0 8px 16px rgba(220, 38, 38, 0.2)",
                    "&:hover": {
                      bgcolor: "#7F1D1D",
                    }
                  }}
                >
                  Post a Job
                  <Icon icon="mdi:arrow-right" sx={{ ml: 1 }} />
                </Button>
              </Box> */}
            </Box>

            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: 30,
                right: 30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(254,226,226,0.8) 0%, rgba(254,226,226,0) 70%)",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(153,27,27,0.08) 0%, rgba(153,27,27,0) 70%)",
                zIndex: 1,
              }}
            />
          </Paper>
        </Grid>

        {/* Talents Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
              background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
              border: "1px solid #fecdd3",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 1, color: "#BE123C" }}>
                For Talents
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 4, color: "#475569" }}>
                Discover opportunities that match your skills and ambitions
              </Typography>

              <Grid container spacing={3}>
                {talentFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={`talent-${index}`}>
                    <FeatureCard {...feature} />
                  </Grid>
                ))}
              </Grid>

              {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#BE123C",
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    boxShadow: "0 8px 16px rgba(190, 18, 60, 0.25)",
                    "&:hover": {
                      bgcolor: "#9F1239",
                    }
                  }}
                >
                  Find Jobs
                  <Icon icon="mdi:arrow-right" sx={{ ml: 1 }} />
                </Button>
              </Box> */}
            </Box>

            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: 40,
                left: 40,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,228,230,0.8) 0%, rgba(255,228,230,0) 70%)",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                right: -30,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(190,18,60,0.06) 0%, rgba(190,18,60,0) 70%)",
                zIndex: 1,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WhatWeOfferSection;