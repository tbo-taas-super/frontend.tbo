// *MUI Imports
import Stack from "@mui/material/Stack";

// *Components Imports
import Applications from "./Applications";
import Schedules from "./Schedules";

const EmploymentCards: React.FC = () => {
  return (
    <Stack spacing={3} direction={{ xs: "column", md: "row" }} sx={{ my: 4 }}>
      <Applications />
      {/* <Schedules /> */}
    </Stack>
  );
};

export default EmploymentCards;
