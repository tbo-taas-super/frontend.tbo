//** React Import
import React from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

//** Image Import
import BannerImage from "../../../../public/man.jpg";

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
        height: { xs: "100vh", sm: "80vh" }, // Changed from "auto" to "100vh" for mobile
      }}
    >
      <Paper
        sx={{
          background: `url(${BannerImage.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          // mt: (theme) => theme.spacing(4),
          height: { xs: "100vh", md: "80vh" }, // Changed from "100%" to "100vh" for mobile
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: "center",
            pt: { xs: 2, sm: 4 },
            width: "100%",
            height: "100%",
            background: `rgba(0, 0, 0, 0.53)`,
            paddingRight: { xs: "0vh", md: "20vh" },
          }}
        >
          <Stack
            sx={{
              color: "#fff",
              textTransform: "capitalize",
              mr: { xs: 2, sm: 4 },
              ml: { xs: 2, sm: 0 },
              textAlign: { xs: "center", sm: "right" },
              py: { xs: 8, sm: 0 }, // Added padding for better spacing on mobile
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
              Are you a Professional ? 🤔
            </Typography>
            <Typography
              variant="h4"
              sx={{
                my: 2,
                fontSize: { xs: "2rem", sm: "4rem" },
                fontWeight: { xs: 200, sm: 100 },
              }}
            >
              Ready to showcase your talents?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                my: 2,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                fontWeight: { xs: 200, sm: 100 },
              }}
            >
              Connect with top employers looking for your unique skills!
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                alignItems: "center",
                my: 4,
              }}
            >
              <Link href="/jobs">
              <Button
                variant="contained"
                sx={{
                  py: "1rem",
                  background: "#A20514",
                  textTransform: "capitalize",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  "&:hover": {
                    background: "#C20516",
                  },
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