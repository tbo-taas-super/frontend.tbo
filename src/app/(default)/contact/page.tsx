"use client";
// ** React Imports
import React, { useState } from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

// ** MUI Imports
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";

const Contact: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  // FAQ data
  const faqs = [
    {
      question: "What are your business hours?",
      answer:
        "Our support team is available Monday to Friday from 8:00 AM to 6:00 PM WAT. On weekends, our hours are 10:00 AM to 4:00 PM WAT.",
      icon: "mdi:clock-outline"
    },
    {
      question: "How quickly can I expect a response to my inquiry?",
      answer:
        "We aim to respond to all email inquiries within 24 hours. Phone calls are typically answered immediately during business hours.",
      icon: "mdi:message-reply-outline"
    },
    {
      question: "Do you offer technical support?",
      answer:
        "Yes, our technical support team is available to help with any technical issues you may encounter with our products or services.",
      icon: "mdi:tools"
    },
    {
      question: "How can I schedule a meeting with your team?",
      answer:
        "You can schedule a meeting by sending an email to support@TBO.ng with your preferred date and time, or by calling our office directly.",
      icon: "mdi:calendar-clock"
    },
    {
      question: "Do you have offices in other locations?",
      answer:
        "Currently, our main office is located in 3rd Floor, Propertygate center, 2 The Rock Drive, Lekki Phase 1, Lagos State.",
      icon: "mdi:map-marker-multiple"
    }
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.5rem" },
          fontWeight: 400,
          textTransform: "capitalize",
          my: 2,
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Need Any Assistance
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "1.25rem",
            sm: "1.75rem",
            md: "1.75rem",
          },
        }}
      >
        You can send us a message via any of the channels below
      </Typography>

      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.primary.main }}>
              <Icon icon="ph:phone-call-fill" fontSize="2.5rem" />
            </Typography>

            <Stack sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Call Us
              </Typography>
              <Typography>+234-803-391-8955</Typography>
              {/* <Typography>+234-802-555-0178</Typography> */}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.primary.main }}>
              <Icon icon="tabler:mail-filled" fontSize="2.5rem" />
            </Typography>

            <Stack sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Email Us
              </Typography>
              <Typography>Hr@tboisl.com</Typography>
              {/* <Typography>contact@TBO.ng</Typography> */}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.primary.main }}>
              <Icon icon="ic:sharp-my-location" fontSize="2.5rem" />
            </Typography>

            <Stack>
              <Typography
                sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
              >
                Visit Us
              </Typography>
              <Typography>
              3rd Floor, Propertygate center, 
                <br />2 The
                Rock Drive, Lekki Phase 1,<br />
                Lagos State.
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Enhanced FAQ Section */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            background: (theme) => 
              `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            p: { xs: 2, md: 4 },
          }}
        >
          <Box 
            sx={{ 
              position: "absolute",
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: (theme) => alpha(theme.palette.primary.main, 0.1),
              zIndex: 0
            }}
          />
          <Box 
            sx={{ 
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: (theme) => alpha(theme.palette.primary.main, 0.07),
              zIndex: 0
            }}
          />
          
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: 600,
                mb: 1,
                textAlign: "center",
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Frequently Asked Questions
            </Typography>
            
            <Typography 
              variant="body1"
              sx={{ 
                mb: 5, 
                textAlign: "center",
                maxWidth: "700px",
                mx: "auto",
                color: "text.secondary" 
              }}
            >
              Find quick answers to common questions about our services and support options
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {faqs.map((faq, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    elevation={expanded === `panel${index}` ? 3 : 1}
                    sx={{
                      mb: 2,
                      transition: "all 0.3s ease",
                      borderRadius: "16px",
                      borderLeft: (theme) => expanded === `panel${index}` ? 
                        `4px solid ${theme.palette.primary.main}` : 
                        "4px solid transparent",
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Accordion
                      expanded={expanded === `panel${index}`}
                      onChange={handleChange(`panel${index}`)}
                      disableGutters
                      elevation={0}
                      sx={{
                        background: "transparent",
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <Box sx={{ 
                            display: "flex", 
                            p: 1, 
                            borderRadius: "50%", 
                            background: (theme) => expanded === `panel${index}` ? theme.palette.primary.main : "transparent",
                            color: (theme) => expanded === `panel${index}` ? theme.palette.primary.contrastText : theme.palette.text.secondary
                          }}>
                            <Icon icon={expanded === `panel${index}` ? "mdi:minus" : "mdi:plus"} fontSize="1.2rem" />
                          </Box>
                        }
                        sx={{
                          px: 3,
                          py: 2,
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box 
                            sx={{ 
                              mr: 2, 
                              display: "flex",
                              p: 1.5,
                              borderRadius: "12px",
                              background: (theme) => alpha(theme.palette.primary.main, 0.1),
                              color: (theme) => theme.palette.primary.main
                            }}
                          >
                            <Icon icon={faq.icon} fontSize="1.5rem" />
                          </Box>
                          <Typography 
                            variant="h6"
                            sx={{ 
                              fontSize: "1.1rem", 
                              fontWeight: expanded === `panel${index}` ? 600 : 500,
                              color: expanded === `panel${index}` ? "primary.main" : "text.primary"
                            }}
                          >
                            {faq.question}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      
                      <Divider sx={{ mx: 3 }} />
                      
                      <AccordionDetails sx={{ px: 3, py: 3 }}>
                        <Fade in={expanded === `panel${index}`}>
                          <Box sx={{ display: "flex" }}>
                            <Box sx={{ width: "24px", mr: 2 }} /> {/* Spacer to align with icon */}
                            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                              {faq.answer}
                            </Typography>
                          </Box>
                        </Fade>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 5, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Didn't find what you're looking for?
              </Typography>
              <Typography 
                variant="body1"
                component="a"
                href="/support" 
                sx={{ 
                  color: "primary.main", 
                  fontWeight: 600, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  gap: 0.5,
                  mt: 1,
                  cursor: "pointer",
                  '&:hover': {
                    textDecoration: "underline"
                  }
                }}
              >
                Contact our support team directly <Icon icon="mdi:arrow-right" fontSize="1rem" />
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Contact;