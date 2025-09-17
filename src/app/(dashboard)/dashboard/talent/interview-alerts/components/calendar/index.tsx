'use client';
import { Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const InterviewAlertsCalendar: React.FC = () => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
            width: '100%',
            display: 'flex',
          }}
          disablePast
        />
      </LocalizationProvider>
    </Box>
  );
};

export default InterviewAlertsCalendar;
