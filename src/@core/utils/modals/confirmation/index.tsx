import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { withdrawJob } from '@/@core/services/jobVanciesService';

interface Props {
  open: boolean;
  closeFn: () => void;
  title: string;
  message?: string;
  customComponentsAsMessage?: ReactNode;
  buttonOneText: string;
  buttonTwoText: string;
  widthXS?: string;
  widthSM?: string;
  widthMD?: string;
  widthLG?: string;
  buttonOneClick?: (data?: any) => any;
  buttonTwoClick?: (data?: any) => any; // Optional for other actions
  jobId?: number; // New prop for withdrawal
  onWithdrawSuccess?: () => void; // Callback for successful withdrawal
}

export const ConfirmationModal: React.FC<Props> = ({
  open,
  closeFn,
  title,
  message,
  customComponentsAsMessage,
  buttonOneText,
  buttonTwoText,
  buttonOneClick,
  buttonTwoClick,
  widthXS,
  widthSM,
  widthMD,
  widthLG,
  jobId,
  onWithdrawSuccess,
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!jobId) {
      setError('No job selected. Please try again.');
      return;
    }

    setIsWithdrawing(true);
    setError(null);
    try {
      console.log('Attempting to withdraw job ID:', jobId);
      await withdrawJob(jobId);
      console.log('Withdrawal successful for job ID:', jobId);
      if (onWithdrawSuccess) {
        onWithdrawSuccess(); // Notify parent component
      }
      closeFn(); // Close modal on success
    } catch (error: any) {
      console.error('Error withdrawing job application:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to withdraw application. Please try again.';
      setError(errorMessage);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <Dialog open={open} onClose={isWithdrawing ? undefined : closeFn}>
      <Box
        sx={{
          width: {
            xs: `${widthXS || 'auto'}`,
            sm: `${widthSM || 'auto'}`,
            md: `${widthMD || 'auto'}`,
            lg: `${widthLG || 'auto'}`,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', position: 'relative', mb: '10px', mt: '10px' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography sx={{ color: '#0D0A0B', fontSize: '24px', fontWeight: 700, textAlign: 'center' }}>
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', right: 0, top: 4 }}>
              <Close
                onClick={isWithdrawing ? undefined : closeFn}
                sx={{ color: '#0D0A0B', cursor: isWithdrawing ? 'not-allowed' : 'pointer' }}
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {customComponentsAsMessage ? (
            customComponentsAsMessage
          ) : (
            <Box sx={{ mb: '20px', width: { xs: 'auto', sm: '500px' } }}>
              <Typography sx={{ color: '#0D0A0B', fontSize: '16px', textAlign: 'center' }}>
                {message}
              </Typography>
              {error && (
                <Typography sx={{ color: 'red', fontSize: '14px', textAlign: 'center', mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            mb: '50px',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'none' },
          }}
        >
          <Box>
            <Button
              onClick={() => {
                setError(null); // Clear error on cancel
                if (buttonOneClick) {
                  buttonOneClick();
                } else {
                  closeFn();
                }
              }}
              variant="outlined"
              disabled={isWithdrawing}
              sx={{
                fontSize: '14px',
                py: '10px',
                px: { xs: '45px', sm: '40px' },
                ml: { xs: 1, sm: 0 },
                mr: { xs: 0, sm: 1 },
                mb: { xs: '20px', sm: '0px' },
                textTransform: 'none',
                fontWeight: 'bold',
                border: '2px solid',
                '&:hover': { border: '2px solid' },
              }}
            >
              {buttonOneText}
            </Button>
          </Box>
          <Box>
            <Button
              onClick={() => {
                if (buttonTwoClick) {
                  buttonTwoClick(); // Call external handler if provided
                } else if (jobId) {
                  handleWithdraw(); // Call internal withdrawal logic
                }
              }}
              variant="contained"
              disabled={isWithdrawing}
              sx={{
                fontSize: '14px',
                py: '10px',
                px: '40px',
                ml: { xs: 0, sm: 1 },
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {isWithdrawing ? 'Withdrawing...' : buttonTwoText}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;