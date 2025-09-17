//** React Imports
import React from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

//** Custom Component Imports
import ButtonStyled from "@/@core/component/mui/buttonStyled";

//** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  red,
  purple,
  cyan,
  teal,
  lightBlue,
  lime,
  green,
  amber,
} from "@mui/material/colors";

interface Jobs {
  title: string;
  number: number;
  icon: string;
}

//**Temporary Mock Data */
const jobs: Jobs[] = [
  { title: "Information Technology", number: 234, icon: "ph:pen-nib-light" },
  { title: "Business", number: 234, icon: "ph:code-light" },
  { title: "Sales", number: 234, icon: "ph:lightning" },
  { title: "Human Resourse", number: 234, icon: "ph:video" },
  { title: "Finance", number: 234, icon: "ph:music-notes-plus-light" },
  // {
  //   title: "Accounting",
  //   number: 234,
  //   icon: "material-symbols-light:finance-mode-rounded",
  // },
  // { title: "Health Care", number: 234, icon: "ph:heart-light" },
  // { title: "Data Science", number: 234, icon: "ph:brain-light" },
  // { title: "Management", number: 234, icon: "ph:chart-pie-light" },
];

const colors = [
  `${red[700]}`,
  `${purple[700]}`,
  `${cyan[700]}`,
  `${teal[700]}`,
  `${lightBlue[700]}`,
  `${lime[700]}`,
  `${green[700]}`,
  `${amber[700]}`,
];

const backgroundColors = [
  `${red[100]}`,
  `${purple[100]}`,
  `${cyan[100]}`,
  `${teal[100]}`,
  `${lightBlue[100]}`,
  `${lime[100]}`,
  `${green[100]}`,
  `${amber[100]}`,
];

const Categories: React.FC = () => {
  return (
    <Box
      sx={{
        py: "2rem",
        background: "#fff",
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.5rem" },
          fontWeight: 400,
          textTransform: "capitalize",
          mb: 2,
          mt: "2rem",
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Job categories
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 3,
          fontSize: {
            xs: "1.25rem",
            sm: "1.75rem",
            md: "1.75rem",
          },
        }}
      >
        Explore a Wide Range of Job Categories
      </Typography>

      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{ my: (theme) => theme.spacing(4) }}
      >
        {jobs.slice(0, 8).map((item, i) => {
          const color = colors[i % colors.length];
          const background = backgroundColors[i % backgroundColors.length];
          return (
            <Grid item xs={6} sm={4} lg={3} key={i}>
              <Card
                sx={{
                  p: (theme) => theme.spacing(3),
                  display: "flex",
                  justifyContent: { xs: "center", sm: "left" },
                  flexDirection: { xs: "column", sm: "column", md: "row" },
                  alignItems: "center",
                  gap: { xs: 2, md: 3 },
                  height: "100%",
                }}
              >
                <IconButton
                  sx={{
                    background: background,
                    color: color,
                    p: 2,
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    boxShadow: (theme) => theme.shadows[2],
                    "&:hover": {
                      color: background,
                      background: color,
                    },
                  }}
                >
                  <Icon icon={item.icon} />
                </IconButton>
                <Stack
                  sx={{
                    my: (theme) => theme.spacing(2),
                    width: "fit-content",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  <Typography>{item.title}</Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: (theme) => theme.palette.secondary.dark,
                    }}
                  >
                    {item.number} View Open positions
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: { xs: "1rem", sm: "1.25rem" },
        }}
      >
        <ButtonStyled
          size="small"
          variant="outlined"
          sx={{
            py: ".5rem",
            fontWeight: 700,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          Explore more
          <Icon icon="material-symbols-light:arrow-right-alt-rounded" />
        </ButtonStyled>
      </Box>
    </Box>
  );
};

export default Categories;
