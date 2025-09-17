// * Icon Import
import Icon from "@/@core/component/icon";

// * MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";

const QuickActions = () => {
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  return (
    <main>
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: "1rem", sm: "1.3rem" }, mb: 2 }}
        >
          Quick Actions
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 1, md: 3 } }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "Capitalize",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Icon icon="ion:briefcase-outline" fontSize="1.2rem" />
            {smallScreen && (
              <Typography sx={{ fontSize: "0.875rem" }}>
                Add New Job Listing
              </Typography>
            )}
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "Capitalize",
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: (theme) => theme.palette.secondary.dark,
              border: (theme) => `1px solid ${theme.palette.secondary.dark}`,
            }}
          >
            <Icon icon="prime:user-edit" fontSize="1.5rem" />
            {smallScreen && <Typography>Manage Users</Typography>}
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "Capitalize",
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: (theme) => theme.palette.secondary.dark,
              border: (theme) => `1px solid ${theme.palette.secondary.dark}`,
            }}
          >
            <Icon icon="pepicons-print:file" fontSize="1.2rem" />
            {smallScreen && <Typography>Generate Report</Typography>}
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "Capitalize",
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: (theme) => theme.palette.secondary.dark,
              border: (theme) => `1px solid ${theme.palette.secondary.dark}`,
            }}
          >
            <Icon icon="solar:calendar-line-duotone" fontSize="1.2rem" />
            {smallScreen && <Typography>Schedule Interview</Typography>}
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "Capitalize",
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: (theme) => theme.palette.secondary.dark,
              border: (theme) => `1px solid ${theme.palette.secondary.dark}`,
            }}
          >
            <Icon icon="mdi:file-edit" fontSize="1.2rem" />
            {smallScreen && <Typography> Generate Report</Typography>}
          </Button>
        </Box>
      </Box>
    </main>
  );
};

export default QuickActions;
