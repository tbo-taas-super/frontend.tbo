import { Box, Button } from '@mui/material';

const PaginationControl: React.FC = () => {
  const buttonStyle = {
    textTransform: 'none',
    border: '2px solid #D0D5DD',
    color: '#344054',
    borderRadius: '8px',
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        px: '20px',
        py: '10px',
      }}
    >
      <Button disabled sx={buttonStyle} variant='outlined'>
        Previous
      </Button>
      <Box
        sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
      ></Box>
      <Button disabled sx={buttonStyle} variant='outlined'>
        Next
      </Button>
    </Box>
  );
};

export default PaginationControl;
