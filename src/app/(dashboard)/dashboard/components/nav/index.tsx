'use client';
import {
  CasesOutlined,
  Dashboard,
  List,
  Logout,
  Luggage,
  Pages,
  Person,
} from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { clientNavItemsData } from './data/items/client';
import { talentNavItemsData } from './data/items/talent';
import { adminNavItemsData } from "./data/items/admin";

const DashboardNav: React.FC<{ setOpenLogoutModal: () => void }> = ({
  setOpenLogoutModal,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navItemsData =
    session?.user.accountType == 'CLIENT'
      ? clientNavItemsData
      : session?.user.accountType == "ADMIN"
      ? adminNavItemsData
      : talentNavItemsData;

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        backgroundColor: '#730E19',
        mt: '60px',
        height: "calc(100vh - 60px)",
        position: "fixed",
        top: "60px",
        left: 0,
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          ml: '30px',
          pt: '30px',
        }}
      >
        {navItemsData.map((item, index) => (
          <Box
            key={index}
            onClick={() => router.push(item.path)}
            sx={{
              display: 'flex',
              color: '#E9E9E9',
              pt: '15px',
              pb: '10px',
              pr: '70px',
              pl: '15px',
              borderRadius: '10px 0px 0px 10px',
              mb: '20px',
              cursor: 'pointer',
              ...(pathname == item.path && { backgroundColor: '#F3FCFF66' }),
              '&:hover': {
                backgroundColor: '#F3FCFF66',
              },
            }}
          >
            <Box sx={{ mr: '18px' }}>{item.icon}</Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ bgcolor: '#D7D7D7', mx: '40px', mb: '50px' }} />
      <Box
        // onClick={() => signOut()}
        onClick={setOpenLogoutModal}
        sx={{
          display: 'flex',
          color: '#E9E9E9',
          pt: '15px',
          pb: '10px',
          pr: '70px',
          pl: '15px',
          borderRadius: '10px 0px 0px 10px',
          mb: '20px',
          ml: '30px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#F3FCFF66',
          },
        }}
      >
        <Box sx={{ mr: '18px' }}>
          <Logout />
        </Box>
        <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
          Log Out
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardNav;
