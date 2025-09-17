import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

// ** Image Imports
import Quote from "../assets/quote.svg";
import SingleGear from "../assets/singleGear.svg";

// * MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { alpha, styled, useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

// * Icon Imports
import Icon from "@/@core/component/icon";

// * Custom Component Imports
import StyledImage from "@/@core/component/mui/image";

interface DataProps {
  name: string;
  testimony: string;
  industry?: string;
}

const data: DataProps[] = [
  {
    name: "Petrocam",
    industry: "Energy",
    testimony: `TBO Integrated Services Ltd. has provided us with a resolute team of experts to oversee the day-to-day management and maintenance of our IT infrastructure. This proactive approach ensures our systems' reliability, security, and performance, allowing our internal IT team to concentrate on strategic initiatives rather than routine maintenance tasks.`,
  },
  {
    name: "ATOS",
    industry: "Technology",
    testimony: `TBO Integrated Services Ltd. deliver Talent as a Service where they recruit tech talents for our multinational clients across Africa. These services include tech talent recruitment, staff onboarding, payroll management. The team has helped our digital transformation growth.`,
  },
  {
    name: "Global Corp",
    industry: "Finance",
    testimony: `Working with TBO Integrated Services has transformed our tech operations. Their team provided exceptional support, innovative solutions, and reliable service that exceeded our expectations. We've seen measurable improvements in efficiency since partnering with them.`,
  }
];

// Styled components for better visual elements
const QuoteIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  marginBottom: theme.spacing(2)
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '400px', // Fixed height for all cards
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  }
}));

const TestimonyText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  mb: 4,
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 6, // Limit to 6 lines
  WebkitBoxOrient: 'vertical',
  flexGrow: 1,
}));

const Testimonial: React.FC = () => {
  const theme = useTheme();
  const quoteRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Controls for the testimonial carousel
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % data.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  useEffect(() => {
    anime({
      targets: quoteRef.current,
      scale: [0.8, 1],
      opacity: [0.7, 1],
      duration: 3000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
  }, []);

  // Creates visible items for carousel with proper ordering
  const getVisibleItems = () => {
    const items = [];
    
    // For desktop view (3 items)
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % data.length;
      items.push({ data: data[index], index });
    }
    
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <Paper
      sx={{
        position: "relative",
        background: `linear-gradient(145deg, ${theme.palette.primary.light}, ${alpha(theme.palette.background.paper, 0.9)})`,
        py: 8,
        paddingBottom: { xs: 4, md: 8 },
        overflow: "hidden",
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          background: `url(${SingleGear.src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
          opacity: 0.05,
          zIndex: 1,
        }}
      />
      
      <Box
        sx={{
          position: "absolute",
          top: { xs: "10%", md: "5%" },
          right: { xs: "5%", md: "10%" },
        }}
        ref={quoteRef}
      >
        <StyledImage 
          src={Quote.src} 
          alt="Quote sign" 
          sx={{
            width: { xs: 80, md: 120 },
            height: { xs: 80, md: 120 },
            opacity: 0.2,
          }}
        />
      </Box>

      {/* Content container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 2, sm: 6 },
        }}
      >
        {/* Section header */}
        <Box sx={{ mb: 8, textAlign: "center", marginTop: "40px" }}>
          <Chip 
            label="CLIENT FEEDBACK" 
            sx={{ 
              mb: 2, 
              fontWeight: 500,
              letterSpacing: "0.5px",
            }} 
          />
          
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Testimonials
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              color: alpha(theme.palette.text.primary, 0.8),
              marginBottom: "40px",
            }}
          >
            What our clients are saying about their experience working with us
          </Typography>
        </Box>

        {/* Testimonial cards section */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          {/* Desktop View */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {visibleItems.map((item, idx) => (
              <TestimonialCard
                key={`${item.index}-${idx}`}
                sx={{
                  flex: 1,
                  maxWidth: "30%",
                  opacity: 1,
                  transform: "none",
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <QuoteIcon>
                    <Icon icon="mdi:format-quote-open" fontSize={30} color={theme.palette.primary.main} />
                  </QuoteIcon>
                  
                  <TestimonyText>
                    {item.data.testimony}
                  </TestimonyText>
                  
                  <Box sx={{ pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, mt: 'auto' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: theme.palette.text.primary,
                      }}
                    >
                      {item.data.name}
                    </Typography>
                    
                    {item.data.industry && (
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: theme.palette.primary.main,
                        }}
                      >
                        {item.data.industry}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TestimonialCard>
            ))}
          </Box>

          {/* Mobile View */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              width: "100%",
            }}
          >
            <TestimonialCard>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <QuoteIcon>
                  <Icon icon="mdi:format-quote-open" fontSize={30} color={theme.palette.primary.main} />
                </QuoteIcon>
                
                <TestimonyText>
                  {data[activeIndex].testimony}
                </TestimonyText>
                
                <Box sx={{ pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, mt: 'auto' }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {data[activeIndex].name}
                  </Typography>
                  
                  {data[activeIndex].industry && (
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: theme.palette.primary.main,
                      }}
                    >
                      {data[activeIndex].industry}
                    </Typography>
                  )}
                </Box>
              </Box>
            </TestimonialCard>
          </Box>

          {/* Navigation controls */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              transform: "translateY(-50%)",
              display: "flex",
              justifyContent: "space-between",
              px: { xs: 2, md: 4 },
              pointerEvents: "none",
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                pointerEvents: "auto",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                left: { xs: -40, md: -60 },
                position: "relative",
                "&:hover": {
                  background: theme.palette.primary.light,
                },
              }}
            >
              <Icon icon="mdi:chevron-left" fontSize={24} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                pointerEvents: "auto",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                right: { xs: -40, md: -60 },
                position: "relative",
                "&:hover": {
                  background: theme.palette.primary.light,
                },
              }}
            >
              <Icon icon="mdi:chevron-right" fontSize={24} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Testimonial;