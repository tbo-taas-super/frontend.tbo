'use client';

import {
  Box,
  Button,
  TextField,
  Alert,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { verifyOtp, resendOtp } from '@/@core/services/user'; // Adjust import path to your service file

const VerifyOtpForm = () => {
  const [otp, setOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendSuccessMsg, setResendSuccessMsg] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setSuccessMsg(data.message || 'OTP verified successfully');
      setTimeout(() => router.push('/signin'), 1500); // Redirect to sign-in after verification
    },
    onError: (error: any) => {
      console.error('OTP verification error:', error);
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      setResendSuccessMsg(data.message || 'OTP resent successfully');
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 30000); // Disable resend for 30 seconds
    },
    onError: (error: any) => {
      console.error('Resend OTP error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Missing email');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      alert('OTP must be a 6-digit number');
      return;
    }
    verifyMutation.mutate({ email, otp });
  };

  const handleResendOtp = () => {
    if (!email) {
      alert('Missing email');
      return;
    }
    setResendSuccessMsg('');
    resendMutation.mutate({ email });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e8ff 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Verify OTP
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Enter the 6-digit OTP sent to <strong>{email}</strong>
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="OTP Code"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Allow only digits
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 3 }}
              required
              aria-describedby="otp-error"
              InputProps={{
                sx: {
                  borderRadius: '8px',
                  '&:focus-within': {
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={verifyMutation.isPending}
              sx={{ py: 1.5, borderRadius: '8px', mb: 2 }}
              aria-label="Verify OTP"
            >
              {verifyMutation.isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <Button
              onClick={handleResendOtp}
              variant="text"
              color="primary"
              fullWidth
              disabled={resendMutation.isPending || resendDisabled}
              sx={{ py: 1, borderRadius: '8px' }}
              aria-label="Resend OTP"
            >
              {resendMutation.isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Resending...
                </>
              ) : (
                'Resend OTP'
              )}
            </Button>
          </form>

          {verifyMutation.isError && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }} id="otp-error">
              {(verifyMutation.error as Error).message}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: '8px' }}>
              {successMsg}
            </Alert>
          )}

          {resendMutation.isError && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }} id="resend-error">
              {(resendMutation.error as Error).message}
            </Alert>
          )}

          {resendSuccessMsg && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: '8px' }}>
              {resendSuccessMsg}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyOtpForm;