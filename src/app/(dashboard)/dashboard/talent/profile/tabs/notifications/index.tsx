import { Box, Button, Divider, Stack, Switch, Typography } from '@mui/material';

const NotificationsTab = () => {
  return (
    <section>
      <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>
        Notifications Management
      </Typography>
     
      {/* <Divider sx={{ mb: '20px' }} />
      <Stack gap={3}>
        {[
          {
            name: 'New Job Created',
            details: 'Receive an alert when a new job is created',
          },
          {
            name: 'Interview Alert',
            details: 'Receive an alert when you have a new interview scheduled',
          },
          {
            name: 'Notification Alerts',
            details: 'Be notified when an alert drops',
          },
        ].map((item, index) => (
          <>
            <Stack key={index} direction='row' alignItems='center'>
              <Stack flexGrow={1}>
                <Typography>{item.name}</Typography>
                <Typography>{item.details}</Typography>
              </Stack>
              <Box>
                <Switch />
              </Box>
            </Stack>
            {index !== 2 && <Divider />}
          </>
        ))}
      </Stack>
      <Divider sx={{ my: '20px' }} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant='contained'
          type='submit'
          sx={{ textTransform: 'none', px: '100px', py: '10px' }}
        >
          Save Changes
        </Button>
      </Box> */}
    </section>
  );
};

export default NotificationsTab;
