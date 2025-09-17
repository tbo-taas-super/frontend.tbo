import { Restore, Search } from '@mui/icons-material';
import { Box, Button, Grid, SxProps, TextField } from '@mui/material';
import { useState } from 'react';

interface JobFindProps {
  sx?: SxProps;
  onSearch: (searchParams: { titleOrCompany: string; location: string }) => void;
  onReset: () => void;
}

const JobFind: React.FC<JobFindProps> = ({ sx, onSearch, onReset }) => {
  const [titleOrCompany, setTitleOrCompany] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch({ titleOrCompany, location });
  };

  const handleReset = () => {
    setTitleOrCompany('');
    setLocation('');
    onReset();
  };

  return (
    <Box
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'white',
        padding: '20px',
      }}
    >
      <Box>Find Your Dream Job</Box>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 4, md: 5 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Grid flexGrow={1} columnSpacing={3} rowSpacing={3} container>
          {[
            {
              placeholder: 'Job Title, Company name or Anything',
              xs: 12,
              lg: 6,
              value: titleOrCompany,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setTitleOrCompany(e.target.value),
            },
            {
              placeholder: 'Location',
              xs: 12,
              sm: 6,
              lg: 3,
              value: location,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value),
            },
          ].map((item, index) => (
            <Grid key={index} xs={item.xs} sm={item.sm} lg={item.lg} item>
              <TextField
                placeholder={item.placeholder}
                value={item.value}
                onChange={item.onChange}
                InputProps={{
                  startAdornment: <Search />,
                  sx: { height: '36px' },
                }}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{ textTransform: 'none' }}
            onClick={handleReset}
          >
            <Restore sx={{ marginRight: '5px' }} />
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default JobFind;