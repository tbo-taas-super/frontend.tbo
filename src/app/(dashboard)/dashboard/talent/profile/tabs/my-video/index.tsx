import { Divider, Grid } from '@mui/material';
import PictureSection from './sections/picture';
import VideoUploadSection from './sections/video';
import OtherInformationTab from './sections/other-information';
import DeactivateAccount from './sections/deactiviate-account';

const MyVideoTab = () => {
  return (
    <section>
      <Grid rowSpacing={3} columnSpacing={5} container>
       
      
      </Grid>
     
      <VideoUploadSection />
      <Divider sx={{ mt: '35px' }} />
     
    </section>
  );
};

export default MyVideoTab;
