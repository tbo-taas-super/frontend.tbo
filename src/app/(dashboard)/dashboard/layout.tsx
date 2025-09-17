'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '../../globals.css';
import { Box, Stack, Typography } from '@mui/material';
import DashboardHeader from './components/header';
import DashboardNav from './components/nav';
import SmallNav from './components/nav/small';
import ConfirmationModal from '@/@core/utils/modals/confirmation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import InactivityLogout from '../InactivityLogout';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openNav, setOpenNav] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSetOpenNavBar = (arg: boolean) => {
    setOpenNav(!arg);
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('Session Data:', session.user); // Debug session data
      if (
        session.user.accountType === 'ADMIN' &&
        session.user.isPasswordChange === false &&
        pathname !== '/dashboard/settings'
      ) {
        router.push('/dashboard/settings?tab=password');
      }
    }
  }, [status, session, router, pathname]);

  return (
    <>
      <InactivityLogout />
      <SmallNav
        setOpenNavBar={setOpenNav}
        openNavBar={openNav}
        setOpenLogoutModal={() => setOpenLogoutModal(true)}
      />
      <DashboardHeader
        openNavBar={openNav}
        setOpenNavBar={handleSetOpenNavBar}
      />
      <Box sx={{ display: 'flex', backgroundColor: '#F9F9FB' }}>
        <DashboardNav setOpenLogoutModal={() => setOpenLogoutModal(true)} />
        <Box
          sx={{
            p: '20px',
            width: '100%',
            ml: { md: '279px' },
            mt: '100px',
            minHeight: '100vh',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}
          </LocalizationProvider>
        </Box>
      </Box>
      <ConfirmationModal
        title=''
        widthSM='500px'
        customComponentsAsMessage={
          <Stack alignItems='center'>
            <Image
              src='/logout_face.svg'
              width={97}
              height={97}
              alt='Logout Face'
            />
            <Typography sx={{ fontWeight: 600, fontSize: '28px' }}>
              Logout?
            </Typography>
            <Typography
              sx={{ fontWeight: 400, fontSize: '16px', textAlign: 'center' }}
            >
              We hope to see you soon!
              <br />
              Are you sure you want to logout now?
            </Typography>
          </Stack>
        }
        buttonOneText='No, Cancel'
        buttonTwoText='Yes, Continue'
        buttonOneClick={() => setOpenLogoutModal(false)}
        buttonTwoClick={() => signOut()}
        open={openLogoutModal}
        closeFn={() => setOpenLogoutModal(false)}
      />
    </>
  );
}