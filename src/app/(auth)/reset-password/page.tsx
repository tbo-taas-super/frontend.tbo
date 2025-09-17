'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { resetPassword } from '@/@core/services/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(2),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 1.5,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
  },
}));

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reset_token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const res = await resetPassword({
        reset_token,
        password,
        email,
        password_confirmation: confirmPassword,
      });

      if (res.status) {
        setMessage(res.message || 'Password reset successful');
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetToken');
        setTimeout(() => router.push('/signin'), 1500);
      } else {
        setError(res.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Fade in timeout={600}>
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Reset Your Password
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              Enter your new password below
            </Typography>
            {message && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <SubmitButton
                variant="contained"
                fullWidth
                type="submit"
                disabled={isLoading}
                sx={{ mt: 3 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
              </SubmitButton>
            </Box>
          </CardContent>
        </StyledCard>
      </Fade>
    </Box>
  );
}