// * React Imports
import React from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

// * MUI Imports
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface Feature {
  title: string;
  content: string;
  icon: string;
}

interface FeatureProps {
  feature: Feature;
}

const data: Feature[] = [
  {
    title: "Quick setup process",
    content: "Get started effortlessly with our easy-to-use setup.",
    icon: "mingcute:settings-6-line",
  },
  {
    title: "Create custom job orders",
    content: "Tailor job listings to meet your specific needs.",
    icon: "material-symbols-light:dashboard-customize-rounded",
  },
  {
    title: "Multi-Platform Posting",
    content: "Reach a wider audience by posting jobs on multiple platforms.",
    icon: "carbon:iot-platform",
  },
  {
    title: "Organized Hiring Campaigns",
    content: "Manage all your job openings and applications in one place.",
    icon: "clarity:organization-line",
  },
  {
    title: "Candidate Management",
    content: "Sort and filter applications to find the best fit.",
    icon: "ph:users-three-duotone",
  },
  {
    title: "  Fast Progress Tracking",
    content: "Monitor your hiring process with real-time updates.",
    icon: "ant-design:pie-chart-twotone",
  },
];

const FeatureList: React.FC<FeatureProps> = ({ feature }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Typography sx={{ color: (theme) => theme.palette.primary.main }}>
        <Icon icon={feature.icon} fontSize="2.5rem" />
      </Typography>

      <Stack>
        <Typography sx={{ fontWeight: "bold", mb: 2 }}>
          {feature.title}
        </Typography>
        <Typography sx={{ width: { xs: "100%", sm: "80%" } }}>
          {feature.content}
        </Typography>
      </Stack>
    </Box>
  );
};

const ClientOffers = () => {
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
          mb: 2,
          mt: { xs: "5rem", lg: "7.5rem" },
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
        Check out the features we provide
      </Typography>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {data.map((feature) => (
            <Grid key={feature.title} item xs={12} sm={6} md={4}>
              <FeatureList feature={feature} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ClientOffers;
