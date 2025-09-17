// * React Imports
import React from "react";

// * Icon Import
import Icon from "@/@core/component/icon";

// * Utility Imports
import StyledImage from "@/@core/component/mui/image";
import Link from "next/link";
import { formatNumber } from "@/@core/utils/format";

//* Image Imports
import Green from "../../../components/assets/green.png";
import Purple from "../../../components/assets/purple.png";
import Blue from "../../../components/assets/blue.png";

// * MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

interface SupTextProps {
  color?: string;
}

const SupText = styled("span")<SupTextProps>(({ color }) => ({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  color: color || "#008A5D",
}));

const GradientOverlay = styled(Box)({

});

const InfoHeader: React.FC = () => {
  const { data: session } = useSession();
  
  return (
    <CardContent sx={{ pt: 6, pb: 4, px: { xs: 2, md: 6 }, mb: 4 }}>
      {/* Welcome Banner */}
      <Card 
        elevation={4}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 8
          }
        }}
      >
        <Grid container>
          {/* Left - Image with Overlay */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "relative",
              minHeight: { xs: 200, md: 320 },
            }}
          >
            <Box
              component="img"
              src="/company.jpeg"
              alt="Find Work"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: {
                  xs: "linear-gradient(0deg, rgba(115,14,25,0.8) 0%, rgba(115,14,25,0.4) 100%)",
                  md: "linear-gradient(90deg, rgba(115,14,25,0.9) 0%, rgba(115,14,25,0) 100%)"
                },
                zIndex: 1
              }}
            />
            
            {/* Content overlay on the image for mobile */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                p: 3,
                zIndex: 2,
                width: "100%",
                display: { xs: "block", md: "none" },
                color: "#fff"
              }}
            >
              <Chip 
                label={`Welcome, ${session?.user?.name || 'User'}!`}
                color="default"
                sx={{ 
                  bgcolor: "rgba(255,255,255,0.2)", 
                  color: "white",
                  mb: 1,
                  fontWeight: 600
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                Post a Job Today, Hire Tomorrow! 🚀
              </Typography>
            </Box>
          </Grid>

          {/* Right - Text & CTA */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              backgroundColor: "#8A1022",
              color: "#fff",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {/* <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 30, height: 30 }}>
                <Icon icon="mdi:account" fontSize={18} />
              </Avatar> */}
              <Typography variant="subtitle2" sx={{ textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
                Welcome, {session?.user?.name || 'User'}!
              </Typography>
            </Stack>
            
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, lineHeight: 1.2 }}>
              Post a Job Today, Hire Tomorrow! 🚀
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              Your hiring just got easier—we're the extra boost your hiring team needs!
            </Typography>
            <Link href="/dashboard/applications" passHref>
            <Button 
              variant="contained" 
              startIcon={<Icon icon="mdi:plus-circle" />}
              sx={{ 
                bgcolor: "white", 
                color: "#8A1022", 
                fontWeight: "bold",
                '&:hover': {
                  bgcolor: "rgba(255,255,255,0.8)"
                },
                alignSelf: "flex-start"
              }}
            >
              Post New Job
            </Button>
            </Link>
          </Grid>
        </Grid>
      </Card>
      
      {/* Post a job button for mobile - visible after the banner */}
      <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 4 }}>
      <Link href="/dashboard/applications" passHref>
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<Icon icon="mdi:plus-circle" />}
          sx={{ 
            bgcolor: "#8A1022", 
            color: "white", 
            fontWeight: "bold",
            py: 1.5,
            '&:hover': {
              bgcolor: "#730E19"
            }
          }}
        >
          Post New Job
        </Button>
        </Link>
      </Box>
      
      {/* Space for additional Grid content */}
      <Grid container spacing={3}>
        {/* Your additional cards can go here */}
      </Grid>
    </CardContent>
  );
};

export default InfoHeader;