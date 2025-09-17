'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Icon from '@/@core/component/icon';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import { profileTabs } from './Tabs/data';
import Profile from './Tabs/profile/Profile';
import Password from './Tabs/password/Password';
import Notification from './Tabs/notification/Notification';

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'password') {
      const passwordTabIndex = profileTabs.findIndex((t) => t.name.toLowerCase() === 'password');
      if (passwordTabIndex !== -1) {
        setActiveTab(passwordTabIndex);
      }
      // Show toast if isPasswordChange is false
      if (session?.user?.isPasswordChange === false) {
        setShowToast(true);
      }
    }
  }, [searchParams, session]);

  const hoverTabStyle = {
    backgroundColor: '#F5F0F0',
    color: '#E61C31',
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          minWidth: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#FFFFFF',
            mb: '20px',
            width: 'fit-content',
          }}
        >
          {profileTabs.map((tab, index) => (
            <Box
              onClick={() => setActiveTab(index)}
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#98A2B3',
                border: '1px solid #EEEEEE',
                px: '10px',
                py: '5px',
                cursor: 'pointer',
                '&:hover': hoverTabStyle,
                ...(activeTab === index && hoverTabStyle),
              }}
            >
              {tab.icon}
              {smallScreen && (
                <Typography sx={{ fontSize: '14px', ml: '5px' }}>
                  {tab.name}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        {activeTab === 0 && (
          <Button
            size="small"
            sx={{
              px: { md: 4 },
              textTransform: 'capitalize',
              color: '#910917',
              border: '1px solid #910917',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Icon icon="solar:pen-2-linear" />
            Edit Profile
          </Button>
        )}
      </Box>

      <section>
        <Box sx={{ backgroundColor: '#FFFFFF', padding: '20px', width: '100%' }}>
          {activeTab === 0 && <Profile />}
          {activeTab === 1 && <Password />}
          {activeTab === 2 && <Notification />}
        </Box>
      </section>

      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="info" sx={{ width: '100%' }}>
          Please change your password for security reasons.
        </Alert>
      </Snackbar>
    </Box>
  );
}