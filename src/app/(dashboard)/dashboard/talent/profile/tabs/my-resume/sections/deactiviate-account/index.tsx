'use client';
import { Button, Checkbox, Grid, Typography } from '@mui/material';
import { useState } from 'react';

const DeactivateAccount = () => {
  const [deactivateCheck, setDeactivateCheck] = useState(false);
  return (
    <Grid container rowGap={3} sx={{ mt: '30px' }}>
      <Grid item xs={12} lg={3.5}>
        <Typography
          sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}
        >
          Deactivate Account
        </Typography>
        <Typography sx={{ fontSize: '13px', mb: { xs: '0px', lg: '20px' } }}>
          Delete your account
        </Typography>
      </Grid>
      <Grid item display='flex' alignItems='flex-start' gap={1} xs={12} lg={4}>
        <Checkbox
          onChange={(e) =>
            e.target.checked
              ? setDeactivateCheck(true)
              : setDeactivateCheck(false)
          }
        />
        <Typography sx={{ pr: '30px', fontSize: '14px' }}>
          Warning by clicking this box, it means you have agreed to delete your
          record from our database
        </Typography>
      </Grid>
      <Grid item lg={4.5}>
        <Button
          variant='contained'
          sx={{ textTransform: 'none', width: '100%' }}
        >
          Deactivate
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeactivateAccount;
