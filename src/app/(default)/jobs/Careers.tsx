// * React Imports
import React from "react";

// *Next Imports
import Link from "next/link";

// * MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface Careers {
  category: string;
  openPositions: number;
}

interface CareerListProps {
  career: Careers;
}

const data: Careers[] = [
  { category: "Accounting, Auditing & Finance", openPositions: 74875 },
  { category: "Admin & Office", openPositions: 74875 },
  { category: "Building and design", openPositions: 74875 },
  { category: "Community & Social Services", openPositions: 74875 },
  { category: "Creative & Design", openPositions: 45904 },
  { category: "Customer Service & Support", openPositions: 45904 },
  { category: "Transport Services", openPositions: 45904 },
  { category: "Engineering and Technology", openPositions: 45904 },
  { category: "Estate and Property", openPositions: 61391 },
  { category: "Farming and Agriculture", openPositions: 61391 },
  { category: "Food Service & Catering", openPositions: 61391 },
  { category: "Health & Safety", openPositions: 61391 },
  { category: "Hospitality & Leisure", openPositions: 74875 },
  { category: "Human Resources", openPositions: 74875 },
  { category: "Legal Services", openPositions: 74875 },
  { category: "Management & Business Development", openPositions: 74875 },
  { category: "Marketing", openPositions: 45904 },
  { category: "Medical & Pharmaceutical", openPositions: 45904 },
  { category: "Product Management", openPositions: 45904 },
  { category: "Project Management", openPositions: 45904 },
  { category: "Quality Assurance", openPositions: 61391 },
  { category: "Research", openPositions: 61391 },
  { category: "Sales", openPositions: 61391 },
  { category: "Software", openPositions: 61391 },
];

const CareerList: React.FC<CareerListProps> = ({ career }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Link href="#">
        <Typography
          sx={{
            fontWeight: "semibold",
            mb: 1,
            "&:hover": {
              textDecoration: "underline",
              color: (theme) => theme.palette.primary.main,
              transition: "all 0.3s ease-in-out",
            },
          }}
        >
          {career.category}
        </Typography>
      </Link>
      <Typography
        sx={{
          color: (theme) => theme.palette.secondary.dark,
          textTransform: "capitalize",
          fontSize: "0.8rem",
        }}
      >{`Open Positions: ${career.openPositions}`}</Typography>
    </Box>
  );
};
const Careers = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Typography sx={{ fontWeight: "semibold", fontSize: "1.5rem", mb: 4 }}>
        Explore Careers
      </Typography>

      <Grid container spacing={2}>
        {data.map((career) => (
          <Grid item xs={12} sm={6} lg={3} key={career.category}>
            <CareerList career={career} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Careers;
