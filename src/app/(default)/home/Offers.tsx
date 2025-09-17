
// * React Imports
import React, { useState, useEffect } from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

// * Image Import
import Bitmap from "../assets/Bitmap.svg";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
//* MUI Imports
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
// ** Icons to use

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
  transition: "all 0.4s ease, transform 0.3s ease",
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
    transform: "translateY(-8px) scale(1.05)", // Add scaling on hover
    boxShadow: `0 20px 30px -10px ${theme.palette.text.primary}30`,
    "&::before": {
      opacity: 1,
    },
    // Optional: Add color change on hover for the card title
    "& .MuiCardHeader-title": {
      color: theme.palette.primary.dark,
    },
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
  recruitment: "tabler:user-search",
  smartMatching: "mdi:account-sync" 
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
  },
  {
    id: "smartMatching", // <- New Card
    title: "Smart Matching",
    icon: CARD_ICONS.smartMatching,
    content: "Our intelligent algorithm connects the right talent with the right job based on skills and preferences.",
    highlight: "AI-Powered Fit"
  }
];

const HiringOffers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isVisible, setIsVisible] = useState(false);
  

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Paper
      sx={{
        zIndex: -1,
        position: "relative",
        p: (theme) => [
          `${theme.spacing(2)} !important`,
          `${theme.spacing(4)} !important`,
        ],
        background: (theme) => theme.palette.primary.light,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${Bitmap.src})`,
          backgroundSize: "cover",
          backgroundPosition: "top right",
    
        }}
      ></Box>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.5rem" },
          fontWeight: 400,
          textTransform: "capitalize",
     
          mt: "1rem",
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
          marginTop: { xs: "3rem", sm: "2rem" },
        }}
      >
        What we offer
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "1.25rem",
            sm: "1.75rem",
            md: "1.75rem",
            marginBottom: "2rem",
          },
        }}
      >
        Unlock Your Potential with Our Comprehensive Solutions
      </Typography>

     
       {/* Enhanced card grid */}
       <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          position: "relative",
          zIndex: 2
        }}
      >
        <Grid container spacing={4}>
          {cardData.map((card, index) => (
            <Grid item xs={12} md={6} lg={3} key={card.id}>
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
    </Paper>
  );
};

export default HiringOffers;
