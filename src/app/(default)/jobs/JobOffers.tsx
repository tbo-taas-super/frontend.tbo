//* React Imports
import React from "react";

// ** Custom Component Imports
import StyledImage from "@/@core/component/mui/image";

// * Image Imports
import JobImage from "../../../../public/jobs.svg";

//* Box Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepItemProps {
  step: Step;
  isLast: boolean;
}

// Sample steps data
const steps: Step[] = [
  {
    number: 1,
    title: "Create account",
    description: "Join the stream of talents looking for the next big thing",
  },
  {
    number: 2,
    title: "Apply within our website",
    description:
      "Scroll and choose from the wide range of recommendations just for you",
  },
  {
    number: 3,
    title: "Get interview call",
    description: "Qualify and get the chance to join your dream team today!",
  },
];

const StepItem: React.FC<StepItemProps> = ({ step, isLast }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        my: { xs: "2rem", md: "5rem" },
      }}
    >
      <Box sx={{ position: "relative", mr: 2 }}>
        <Avatar
          sx={{
            bgcolor: (theme) => `${alpha(theme.palette.primary.main, 1)}`,
            width: 40,
            height: 40,
          }}
        >
          {step.number}
        </Avatar>
        {!isLast && (
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: "50%",
              width: 2,
              height: { xs: "100px", sm: "110px", md: "140px" },
              background: (theme) => theme.palette.primary.main,
              borderRadius: 1,
            }}
          />
        )}
      </Box>
      <Box>
        <Typography
          variant="h6"
          fontWeight="semibold"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            fontWeight: 500,
          }}
        >
          {step.title}
        </Typography>
        <Typography
          sx={{
            maxWidth: { xs: "100%", sm: "95%" },
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          {step.description}
        </Typography>
      </Box>
    </Box>
  );
};

const offer: React.FC = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        mt: { xs: "8rem", sm: -2 },
        pt: "6rem",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.5rem" },
          fontWeight: 400,
          textTransform: "capitalize",
          mb: 2,
          mt: "8rem",
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
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
          },
        }}
      >
        Find Jobs with 3 easy steps
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Box sx={{ minWidth: "50%" }}>
          <StyledImage
            src={JobImage.src}
            alt="Happy Jobs seekers"
            sx={{ width: "100%", height: "100%" }}
          />
        </Box>
        <Box
          sx={{
            maxWidth: 600,
            margin: "0 auto",
            px: { xs: 2, sm: 4 },
            mt: { xs: 2, md: 4 },
            bgcolor: (theme) => `${alpha(theme.palette.primary.light, 0.3)}`,
            borderRadius: 5,
          }}
        >
          {steps.map((step, index) => (
            <StepItem
              key={step.number}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default offer;
