import { Box } from '@mui/material';
import Image from 'next/image';

const SignUpInfo: React.FC = () => {
  const suitableAccountsInfo = [
    {
      icon: '/icons/client_account.png',
      name: 'Company Account',
      description:
        'This account is suitable for employers and organizations. With this client account, you can post, update and delete jobs.',
    },
    {
      icon: '/icons/talent_account.png',
      name: 'Talent Account',
      description:
        'This account is suitable for freelancers and job seekers. With this talent account, you can view and apply for jobs.',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#E61C31',
        color: 'white',
        width: '50%',
        // display: 'flex',
        display: {xs: 'none', md: 'flex'},
        flexDirection: 'column',
        alignItems: 'center',
        paddingX: '70px',
      }}
    >
      <Box
        sx={{ width: '250px', height: '180px', backgroundColor: '#E61C31' }}
      ></Box>
      <Box sx={{ fontWeight: '500px', fontSize: '34.3px' }}>
        Welcome to <span style={{ fontWeight: 900 }}>TBO</span>
      </Box>
      <Box sx={{ fontSize: '17.1px', fontWeight: 400, marginBottom: '30px' }}>
        Your one stop hiring management system
      </Box>
      <Box
        sx={{
          width: '100%',
          fontSize: '22.9px',
          fontWeight: 700,
          marginBottom: '30px',
        }}
      >
        <Box>Choose a suitable account</Box>
      </Box>
      {suitableAccountsInfo.map((account, index) => (
        <Box key={index} sx={{ display: 'flex', marginBottom: '30px' }}>
          <Image
            style={{ marginRight: '30px' }}
            src={account.icon}
            height={40}
            width={40}
            alt={`${account.name} Icon`}
          />
          <Box>
            <Box
              sx={{ fontWeight: 700, fontSize: '17.1px', marginBottom: '10px' }}
            >
              {account.name}
            </Box>
            <Box sx={{ fontWeight: 400, fontSize: '17.1px' }}>
              {account.description}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SignUpInfo;