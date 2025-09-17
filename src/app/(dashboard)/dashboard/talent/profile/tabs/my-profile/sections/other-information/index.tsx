import { Box, Grid, Typography } from '@mui/material';
import DocumentUpload from './components/document-upload';

const OtherInformationTab = () => {
  const documents = [
    'CV/Resume Upload',
    'Cover Letter Upload',
    'ID Card Upload',
  ];

  return (
    <section>
      <Box sx={{ mt: '30px' }}>
        <Typography
          sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}
        >
          Other Information
        </Typography>
        <Typography sx={{ fontSize: '13px', mb: '20px' }}>
          Details about yourself
        </Typography>
        <Grid columnSpacing={4} rowSpacing={4} container>
          {documents.map((document, index) => (
            <Grid key={index} xs={12} lg={4} item>
              <DocumentUpload label={document} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </section>
  );
};

export default OtherInformationTab;
