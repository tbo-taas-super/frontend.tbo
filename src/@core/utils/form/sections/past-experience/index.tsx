import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const PastExperienceFormSection = () => {
  const fieldsData = [
    {
      label: 'Years of Experience',
      items: ['1', '2', '3'],
    },
    {
      label: 'Exiting Job Salary Range',
      items: ['1', '2', '3'],
    },
    {
      label: 'Notice of Departure/Availability',
      items: ['1', '2', '3'],
    },
    {
      label: 'Other Message to Hiring Manager (Optional)',
      placeholder: 'Enter Text',
    },
  ];

  return (
    <section>
      <Box>
        <Typography
          sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}
        >
          Past Experience/Availability
        </Typography>
        <Typography sx={{ fontSize: '13px', mb: '10px' }}>
          Details about yourself
        </Typography>
        <Grid columnSpacing={4} rowSpacing={3} container>
          {fieldsData.map((field, index) =>
            field.items ? (
              <Grid key={index} item xs={12} sm={6} lg={4}>
                <Box
                  sx={{
                    color: '#101928',
                    fontSize: '12px',
                    fontWeight: 500,
                    marginBottom: '5px',
                  }}
                >
                  {field.label}
                </Box>
                <Select
                  sx={{ width: '100%' }}
                  inputProps={{ style: { fontSize: '14px' } }}
                  defaultValue='Select'
                >
                  <MenuItem value='Select'>Select</MenuItem>
                  {field.items.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            ) : (
              <Grid key={index} item xs={12} sm={8} lg={8}>
                <Box
                  sx={{
                    color: '#101928',
                    fontSize: '12px',
                    fontWeight: 500,
                    marginBottom: '5px',
                  }}
                >
                  {field.label}
                </Box>
                <TextField
                  placeholder={field.placeholder}
                  sx={{ width: '100%' }}
                  inputProps={{ style: { fontSize: '14px' } }}
                  multiline
                  minRows={4}
                ></TextField>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </section>
  );
};

export default PastExperienceFormSection;
