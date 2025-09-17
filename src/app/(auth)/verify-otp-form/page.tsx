'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import { verifyResetOtp } from '@/@core/services/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from "@/@core/utils/constants";

const resendOtp = async ({ email }: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }

  return data;
};

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Reset countdown when OTP is resent
  const resetCountdown = () => {
    setCountdown(120); // Reset to 2 minutes
  };

  // Format countdown time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage for CircularProgress
  const progress = (countdown / 120) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }
    if (countdown <= 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Get token from either URL params or sessionStorage
      const urlToken = searchParams.get('token');
      const storedToken = sessionStorage.getItem('resetToken') || '';
      const reset_token = urlToken || storedToken;
      
      console.log('Verifying OTP with token:', reset_token);
      
      const res = await verifyResetOtp({ 
        email, 
        otp,
        reset_token 
      });

      console.log('Verification response:', res);

      if (res.status) {
        setMessage(res.message || 'OTP verified successfully');
        
        // Update token if a new one was returned
        const finalToken = res.reset_token || reset_token;
        sessionStorage.setItem('resetToken', finalToken);
        
        // Proceed to password reset
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(finalToken)}`);
      } else {
        setError(res.message || 'Invalid OTP');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Missing email');
      return;
    }
    try {
      setIsResendLoading(true);
      setResendMessage('');
      setError('');
      
      const res = await resendOtp({ email });
      
      if (res.status !== false) {
        setResendMessage(res.message || 'OTP resent successfully');
        resetCountdown();
      } else {
        setError(res.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResendLoading(false);
    }
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
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={4}
              sx={{
                color: countdown > 30 ? 'primary.main' : 'error.main',
                transition: 'color 0.3s ease-in-out',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color={countdown > 30 ? 'textPrimary' : 'error.main'}
              >
                {formatTime(countdown)}
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
              disabled={isLoading || countdown <= 0}
              sx={{ py: 1.5, borderRadius: '8px', mb: 2 }}
              aria-label="Verify OTP"
            >
              {isLoading ? (
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
              disabled={isResendLoading || countdown > 0}
              sx={{ py: 1, borderRadius: '8px' }}
              aria-label="Resend OTP"
            >
              {isResendLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Resending...
                </>
              ) : (
                'Resend OTP'
              )}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }} id="otp-error">
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: '8px' }}>
              {message}
            </Alert>
          )}

          {resendMessage && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: '8px' }}>
              {resendMessage}
            </Alert>
          )}

          {countdown <= 0 && (
            <Alert severity="warning" sx={{ mt: 3, borderRadius: '8px' }}>
              OTP has expired. Please request a new one.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}