// ** MUI Components
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const JobInfoCard = ({ applicationId }: { applicationId: string }) => {
  return (
    <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} lg={4}>
          <Stack>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
              <Avatar>{applicationId}</Avatar>
              <Typography>Company Name</Typography>
            </Box>

            <Typography sx={{ my: 3 }}>Job Title</Typography>
            <Typography
              sx={{
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              No of Applications
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={3} lg={2}>
          <Stack sx={{ gap: 4 }}>
            <Box>
              <Typography
                sx={{
                  color: (theme) => theme.palette.secondary.dark,
                  fontVariant: "small-caps",
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                Experience
              </Typography>
              <Typography sx={{ fontSize: ".85rem" }}>1-2 years</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  color: (theme) => theme.palette.secondary.dark,
                  fontVariant: "small-caps",
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                Salary Range
              </Typography>
              <Typography sx={{ fontSize: ".85rem" }}>
                $12-15K Annually
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={3} lg={2}>
          <Stack sx={{ gap: 4 }}>
            <Box>
              <Typography
                sx={{
                  color: (theme) => theme.palette.secondary.dark,
                  fontVariant: "small-caps",
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                Employment Type
              </Typography>
              <Typography sx={{ fontSize: ".85rem" }}>Full Time</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  color: (theme) => theme.palette.secondary.dark,
                  fontVariant: "small-caps",
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                Duration
              </Typography>
              <Typography sx={{ fontSize: ".85rem" }}>1 Year</Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <Stack>
            <Box>
              <Typography
                sx={{
                  color: (theme) => theme.palette.secondary.dark,
                  fontVariant: "small-caps",
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                Description
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: ".85rem" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem
                ipsum.....
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    fontSize: ".85rem",
                    textTransform: "capitalize",
                    ml: "auto",
                  }}
                >
                  View More
                </Button>
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default JobInfoCard;
