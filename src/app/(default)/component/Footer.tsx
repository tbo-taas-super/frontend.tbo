"use client";

// * React Imports
import React from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

// * Next Imports
import Link from "next/link";

// * MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  width: "fit-content",
  textTransform: "capitalize",
  my: 5,
  "&:hover": {
    color: "#fff",
    transform: "translateX(5px)",
    transition: "all 0.5s ease",
  },
}));

const Footer: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          p: (theme) => theme.spacing(4),
          background: "#000",
          color: "#767F8C",
          height: { xs: "100%", lg: "50vh" },
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            display: "flex",
            justifyContent: "flex-start",
            gap: "2rem",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 300 }}>
            <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <IconButton sx={{ color: "#767F8C" }}>
                <Icon icon="ph:phone-call-fill" />
              </IconButton>
              <Stack>
             
                <Typography sx={{ fontSize: { xs: ".75rem", sm: ".875rem" } }}>
                +234-803-391-8955
                </Typography>
                <Typography sx={{ fontSize: { xs: ".75rem", sm: ".875rem" } }}>
               
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <IconButton sx={{ color: "#767F8C" }}>
                <Icon icon="ic:sharp-my-location" />
              </IconButton>
              <Typography sx={{ fontSize: { xs: ".75rem", sm: ".875rem" } }}>
          
              3rd Floor, Propertygate center, <br />2 The
              Rock Drive, Lekki Phase 1,Lagos State.
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <IconButton sx={{ color: "#767F8C" }}>
                <Icon icon="tabler:mail-filled" />
              </IconButton>
              <Stack>
                <Typography sx={{ fontSize: { xs: ".75rem", sm: ".875rem" } }}>
                Hr@tboisl.com
                </Typography>
                {/* <Typography sx={{ fontSize: { xs: ".75rem", sm: ".875rem" } }}>
                  contact@TBO.ng
                </Typography> */}
              </Stack>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <Typography sx={{ color: "#fff", mb: { xs: 2, md: 4 } }}>
                Quick Links
              </Typography>
              <Link href="/" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  About
                </TypographyStyled>
              </Link>
              <Link href="/contact" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Contact
                </TypographyStyled>
              </Link>
              {/* <Link href="#/pricing" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Pricing
                </TypographyStyled>
              </Link> */}
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Typography sx={{ color: "#fff", mb: { xs: 2, md: 4 } }}>
                Talents
              </Typography>
              <Link href="/jobs" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Browse jobs
                </TypographyStyled>
              </Link>
              <Link href="/dashboard/talent/job-vacancies" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Browse Employers
                </TypographyStyled>
              </Link>
              <Link href="/dashboard/talent" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Talent Dashboard
                </TypographyStyled>
              </Link>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Typography sx={{ color: "#fff", mb: { xs: 2, md: 4 } }}>
                Client
              </Typography>
              <Link href="/dashboard/applications" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Post a job
                </TypographyStyled>
              </Link>
              <Link href="/company" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Browse Talent
                </TypographyStyled>
              </Link>
              <Link href="/dashboard/client" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Client Dashboard
                </TypographyStyled>
              </Link>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Typography sx={{ color: "#fff", mb: { xs: 2, md: 4 } }}>
                Support
              </Typography>
              <Link href="/contact" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  FAQs
                </TypographyStyled>
              </Link>
              {/* <Link href="#/privacy" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Privacy Policy
                </TypographyStyled>
              </Link>
              <Link href="/terms" passHref>
                <TypographyStyled
                  sx={{ my: 2, fontSize: { xs: ".75rem", sm: ".875rem" } }}
                >
                  Terms and Conditions
                </TypographyStyled>
              </Link> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          background: "#000",
          color: "#767F8C",
        }}
      >
        <Box
          sx={{
            borderTop: `1px solid ${"#565F8C"}`,
            p: (theme) => theme.spacing(2),
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: { xs: "center", sm: "space-around" },
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: ".75rem", sm: ".875rem" } }}>
            @ 2025 TBO - Job Portal. All rights Reserved
          </Typography>
          <Typography>
        <IconButton color="inherit" component="a" href="https://facebook.com/people/TBO-Integrated-Services-Limited/100093247320175/" target="_blank" rel="noopener noreferrer">
          <Icon icon="ri:facebook-fill" fontSize="1.375rem" />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://instagram.com/tbo.isl" target="_blank" rel="noopener noreferrer">
          <Icon icon="ph:instagram-logo" fontSize="1.375rem" />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://twitter.com/consulting_tbo" target="_blank" rel="noopener noreferrer">
          <Icon icon="hugeicons:new-twitter" fontSize="1.375rem" />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://www.linkedin.com/company/tbo-consulting-group/" target="_blank" rel="noopener noreferrer">
          <Icon icon="mdi:linkedin" fontSize="1.375rem" />
        </IconButton>
      </Typography>

        </Box>
      </Box>
    </>
  );
};

export default Footer;
