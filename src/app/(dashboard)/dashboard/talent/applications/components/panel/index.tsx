import { Search } from '@mui/icons-material';
import { Box, TextField } from '@mui/material';

// Define props interface for JobApplicationsPanel
interface JobApplicationsPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobApplicationsPanel: React.FC<JobApplicationsPanelProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        padding: '20px',
        gap: 3,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          placeholder="Role Applied For"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            sx: {
              height: '38px',
              borderRadius: '8px',
              width: { xs: '100%', md: '400px' },
              fontSize: '14px',
            },
            startAdornment: <Search sx={{ mr: '10px', fill: '#E9384A' }} />,
          }}
        />
      </Box>
      {/* Removed the "Select dates" Button and CalendarMonthOutlined icon */}
    </Box>
  );
};

export default JobApplicationsPanel;