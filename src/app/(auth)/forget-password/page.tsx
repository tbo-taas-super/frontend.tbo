'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import { requestPasswordReset, resendOtp } from '@/@core/services/user';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) {
    setError('Email is required');
    return;
  }

  try {
    setIsLoading(true);
    setError('');
    console.log('Requesting password reset for:', email);
    
    const res = await requestPasswordReset(email);
    console.log('Reset response:', res);
    
    if (res.status) {
      setMessage(res.message || 'OTP sent to your email');
      
      // Store both email AND token in sessionStorage
      sessionStorage.setItem('resetEmail', email);
      sessionStorage.setItem('resetToken', res.reset_token);
      
      console.log('Stored reset token:', res.reset_token);
      
      // Pass both email and token to verify page
      router.push(`/verify-otp-form?email=${encodeURIComponent(email)}&token=${encodeURIComponent(res.reset_token)}`);
    } else {
      setError(res.message || 'Failed to send OTP');
    }
  } catch (err: any) {
    console.error('Password reset error:', err);
    setError(err.message || 'Error requesting password reset');
  } finally {
    setIsLoading(false);
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
            Forgot Password
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Enter your email to receive a one-time password (OTP).
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              required
              aria-describedby="email-error"
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
              disabled={isLoading}
              sx={{ py: 1.5, borderRadius: '8px', mb: 2 }}
              aria-label="Send OTP"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }} id="email-error">
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: '8px' }}>
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}