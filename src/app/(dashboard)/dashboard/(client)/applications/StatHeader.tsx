// * React Imports
import React from "react";

// * Icon Import
import Icon from "@/@core/component/icon";
import StyledImage from "@/@core/component/mui/image";

// * Image Import
import Green from "../../components/assets/green.png";
import Purple from "../../components/assets/purple.png";
import Yellow from "../../components/assets/brown.png";
import Red from "../../components/assets/red.png";

// * MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

const StatHeader: React.FC = () => {
  return (
    <Paper sx={{ boxShadow: 1, borderRadius: 2 }}>
      <CardHeader
        title="Job Statistics"
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                p: 2,
                background: "#EAFFE5",
                color: "#1E9900",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Total Opening
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "1.25rem", mt: 2 }}
                  >
                    7
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", width: 50, height: 50 }}>
                  <StyledImage
                    src={Green.src}
                    alt="icon adornment"
                    sx={{
                      position: "absolute",
                      left: "-.7rem",
                      top: "-.3rem",
                    }}
                  />
                  <Icon icon="ion:briefcase-outline" fontSize="2.785rem" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                p: 2,
                background: "#F9E5FF",
                color: "#7A0099",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Applications
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "1.25rem", mt: 2 }}
                  >
                    160
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", width: 50, height: 50 }}>
                  <StyledImage
                    src={Purple.src}
                    alt="icon adornment"
                    sx={{
                      position: "absolute",
                      left: "-.7rem",
                      top: "-.3rem",
                    }}
                  />
                  <Icon icon="mingcute:paper-fill" fontSize="2.785rem" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                p: 2,
                background: "#FFF9E5",
                color: "#997A00",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Shortlisted
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "1.25rem", mt: 2 }}
                  >
                    16
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", width: 50, height: 50 }}>
                  <StyledImage
                    src={Yellow.src}
                    alt="icon adornment"
                    sx={{
                      position: "absolute",
                      left: "-.7rem",
                      top: "-.3rem",
                    }}
                  />
                  <Icon
                    icon="healthicons:i-documents-accepted"
                    fontSize="2.785rem"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                p: 2,
                background: "#FFF0F1",
                color: "#C01729",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Hired
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "1.25rem", mt: 2 }}
                  >
                    7
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", width: 50, height: 50 }}>
                  <StyledImage
                    src={Red.src}
                    alt="icon adornment"
                    sx={{
                      position: "absolute",
                      left: "-.7rem",
                      top: "-.3rem",
                    }}
                  />
                  <Icon icon="f7:person-fill" fontSize="2.785rem" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default StatHeader;
