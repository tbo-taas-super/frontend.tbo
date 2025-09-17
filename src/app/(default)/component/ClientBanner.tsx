//** React Import
import React from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

//** Image Import
import BannerImage from "../../../../public/woman.jpg";

//** MUI Import
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "next/link";

const Banner: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
     
        mx: "auto",
        height: { xs: "100vh", md: "80vh" }, // Changed from "100%" to "100vh" for mobile
      }}
    >
      <Paper
        sx={{
          background: `url(${BannerImage.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          // mt: (theme) => theme.spacing(4),
          height: { xs: "100%", md: "80vh" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
            alignItems: "center",
            pt: { xs: 2, sm: 4 },
            width: "100%",
            height: "100%",
            background: `rgba(0, 0, 0, 0.53)`,
            paddingLeft: { xs: "0vh", md: "20vh" },
        
          }}
        >
          <Stack
            sx={{
              color: "#fff",
              textTransform: "capitalize",
              ml: { xs: 2, sm: 4 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                my: 2,
                fontSize: { xs: "2rem", sm: "3rem" },
                fontWeight: { xs: 200, sm: 900 },
              }}
            >
              Are you an Employer? 🤔
            </Typography>
            <Typography
              variant="h4"
              sx={{
                my: 2,
                fontSize: { xs: "2rem", sm: "4rem" },
                fontWeight: { xs: 200, sm: 100 },
              }}
            >
              Looking for top talents?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                my: 2,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                fontWeight: { xs: 200, sm: 100 },
              }}
            >
             With numerous jobseekers, we've got your organization covered!
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-start" },
                alignItems: "center",
                my: 4,
              }}
            >
              <Link href="/company">
              <Button
                variant="contained"
                sx={{
                  py: ".5rem",
                  background: "#A20514",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  textTransform: "capitalize",
                }}
                size="medium"
              >
                Get started
                <Icon icon="material-symbols-light:arrow-right-alt-rounded" />
              </Button>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Banner;
