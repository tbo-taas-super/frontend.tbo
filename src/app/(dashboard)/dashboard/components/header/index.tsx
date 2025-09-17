'use client';
import { Menu } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const DashboardHeader: React.FC<{
  openNavBar: boolean;
  setOpenNavBar: (arg: boolean) => void;
}> = ({ openNavBar, setOpenNavBar }) => {
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: '40px',
        py: '10px',
        boxShadow: '0px 0px 3px 0px',
        color: 'rgba(0, 0, 0, 0.3)',
        position: 'fixed',
        zIndex: 1200,
        backgroundColor: '#FFFFFF',
        width: '100%',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Link href='/'>
          <Image
            src={'/TBO.svg'}
            width={203.4}
            height={46.8}
            alt={'TBO logo'}
          />
        </Link>
      </Box>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
        }}
      >
        <Box sx={{ mr: '10px' }}>
          <Avatar />
        </Box>
        <Box>
          <Typography
            sx={{ fontSize: '14px', fontWeight: 600, color: '#E61C31' }}
          >
            {session?.user?.name}
          </Typography>
          <Typography
            sx={{ fontSize: '14px', fontWeight: 600, color: '#CCCED1' }}
          >
            {session?.user?.email}
          </Typography>
        </Box>
      </Box>
      <Menu
        onClick={() => {
          setOpenNavBar(!openNavBar);
        }}
        sx={{ display: { xs: 'flex', md: 'none' }, color: 'black' }}
      />
    </Box>
  );
};

export default DashboardHeader;
