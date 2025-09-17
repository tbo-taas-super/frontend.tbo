import { Divider, Grid } from '@mui/material';
import PictureSection from './sections/picture';
import PersonalInformation from './sections/personal-information';
import OtherInformationTab from './sections/other-information';
import DeactivateAccount from './sections/deactiviate-account';

const MyResumeTab = () => {
  return (
    <section>
      <Grid rowSpacing={3} columnSpacing={5} container>
        
      
      </Grid>
      <Divider sx={{ mt: '35px' }} />
      <OtherInformationTab />
      <Divider sx={{ mt: '35px' }} />
    
    </section>
  );
};

export default MyResumeTab;
