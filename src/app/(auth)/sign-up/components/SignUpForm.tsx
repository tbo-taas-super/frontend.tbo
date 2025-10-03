'use client';
import React, { useState } from 'react';
import {
  ApartmentOutlined,
  MailOutline,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '@/@core/utils/constants';
import { useEffect } from 'react';
import { GoogleAuthService } from '@/@core/services/user';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface RegistrationData {
  name: string;
  account_type: 'CLIENT' | 'TALENT';
  email: string;
  password: string;
  password_confirmation: string;
  termsAccepted: boolean;
}

const registerUser = async (registrationData: RegistrationData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: registrationData.name,
      account_type: registrationData.account_type,
      email: registrationData.email,
      password: registrationData.password,
      password_confirmation: registrationData.password_confirmation,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    if (response.status === 422 || responseData.message?.includes('email')) {
      throw new Error('This email is already registered. Please use another one.');
    }
    throw new Error(responseData.message || 'Registration failed. Please try again.');
  }

  return responseData;
};

const SignUpForm: React.FC = () => {
  const [activeAccountType, setActiveAccountType] = useState<'CLIENT' | 'TALENT'>('CLIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGoogleCallback(code);
    }
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    try {
      const { token, user } = await GoogleAuthService.handleCallback(code);
      localStorage.setItem('authToken', token);
      const returnTo = sessionStorage.getItem('preAuthRoute') || '/dashboard';
      router.replace(returnTo);
    } catch (error) {
      console.error('Google authentication failed:', error);
      router.replace('/signup?error=google_auth_failed');
    } finally {
      sessionStorage.removeItem('preAuthRoute');
      sessionStorage.removeItem('accountType');
    }
  };

  const googleLogin = () => {
    GoogleAuthService.initiateGoogleLogin(activeAccountType);
  };

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (session?.user) {
      router.replace('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || session?.user) {
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const isCompanyEmail = (email: string) => {
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !commonDomains.includes(domain);
  };

  const activeStyle = {
    backgroundColor: '#E61C31',
    color: 'white',
  };

  const inActiveStyle = {
    backgroundColor: '#F6F6F6',
    color: '#BCBCBC',
    border: '1px solid #D9D9D9',
  };

  const account_type = [
    {
      icon: '/icons/client_account.png',
      name: 'CLIENT',
    },
    {
      icon: '/icons/talent_account.png',
      name: 'TALENT',
    },
  ];

  const oAuthOptions = [
    {
      icon: '/icons/google.png',
      name: 'Google',
    },
  ];

  const fieldData: {
    label: string;
    name: 'name' | 'email';
    placeholder: string;
    icon: React.ReactNode;
  }[] = [
    {
      label: 'Full Name',
      name: 'name',
      placeholder: 'Enter Full Name',
      icon: <ApartmentOutlined />,
    },
    {
      label: activeAccountType === 'CLIENT' ? 'Company Domain Email' : 'Preferred Email Address',
      name: 'email',
      placeholder: 'Enter Email Address',
      icon: <MailOutline />,
    },
  ];

  const fieldErrorMessageStyle = {
    fontSize: '11px',
    marginTop: '5px',
    color: '#E61C31',
  };

  const passwordHintStyle = {
    fontSize: '10px',
    color: '#666',
    marginTop: '5px',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationData>();

  const password = watch('password');
  const termsAccepted = watch('termsAccepted');

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setShowSuccess(true);
      setTimeout(() => router.push(`/verifyOtp?email=${formEmail}`), 2000);
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: { xs: '10px', md: '30px' },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: '-5px' }}>
          <Link href="/">
            <Image
              style={{ marginBottom: '20px' }}
              src={'/talotamain.svg'}
              width={361}
              height={124.2}
              alt="TBO Icon"
            />
          </Link>
        </Box>
        <Box
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            gap: { xs: '10px', md: '0' },
          }}
        >
          {account_type.map((account, index) => (
            <Box
              key={index}
              onClick={() => setActiveAccountType(account.name as 'CLIENT' | 'TALENT')}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '15px',
                borderRadius: '8px',
                width: '100%',
                ...(activeAccountType === account.name ? activeStyle : inActiveStyle),
                cursor: 'pointer',
              }}
            >
              <Image
                src={account.icon}
                width={38.6}
                height={38.6}
                alt={`${account.name} Icon`}
              />
              <Box sx={{ fontSize: '14.3px', fontWeight: 700 }}>
                {account.name === 'CLIENT' ? 'Company Account' : 'Talent Account'}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Box sx={{ fontSize: { xs: '18px', md: '20px' }, fontWeight: 700 }}>Create Account</Box>
          <Box sx={{ fontSize: '12px' }}>
            Enter your credentials to create your account
          </Box>
        </Box>

        {authError && (
          <Alert
            sx={{ position: 'relative', mb: 2, width: '100%' }}
            variant="filled"
            severity="error"
          >
            Google authentication failed. Please try again.
          </Alert>
        )}

        <form
          onSubmit={handleSubmit((data) => {
            setFormEmail(data.email);
            mutation.mutate({
              name: data.name,
              account_type: activeAccountType,
              email: data.email,
              password: data.password,
              password_confirmation: data.password_confirmation,
              termsAccepted: data.termsAccepted,
            });
          })}
        >
          {fieldData.map((field, index) => (
            <Box key={index} sx={{ marginBottom: '14px' }}>
              <Box
                sx={{
                  color: '#101928',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginBottom: '5px',
                }}
              >
                {field.label}
              </Box>
              <TextField
                {...register(field.name, {
                  required: `${field.label} is required`,
                  ...(field.name === 'email' && {
                    validate: (value: string) =>
                      activeAccountType === 'CLIENT'
                        ? isCompanyEmail(value) || 'Please use a company domain email (e.g. not gmail.com)'
                        : true,
                  }),
                })}
                placeholder={field.placeholder}
                sx={{ width: '100%' }}
                inputProps={{ style: { fontSize: '12px' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {field.icon}
                    </InputAdornment>
                  ),
                }}
              />
              <p style={fieldErrorMessageStyle}>
                {(errors as Record<string, any>)[field.name]?.message as string}
              </p>
            </Box>
          ))}

          {/* Password Field */}
          <Box sx={{ marginBottom: '14px' }}>
            <Box
              sx={{
                color: '#101928',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '5px',
              }}
            >
              Password
            </Box>
            <TextField
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
                  message: 'Must include uppercase, lowercase, number, and special character (@$!%*?&.)',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password (min 8 chars with A-Z, a-z, 0-9, special)"
              sx={{ width: '100%' }}
              inputProps={{ style: { fontSize: '12px' } }}
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
            />
            <p style={fieldErrorMessageStyle}>
              {errors.password?.message as string}
            </p>
            <p style={passwordHintStyle}>
              Password must contain: 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&)
            </p>
          </Box>

          {/* Confirm Password Field */}
          <Box sx={{ marginBottom: '14px' }}>
            <Box
              sx={{
                color: '#101928',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '5px',
              }}
            >
              Confirm Password
            </Box>
            <TextField
              {...register('password_confirmation', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              sx={{ width: '100%' }}
              inputProps={{ style: { fontSize: '12px' } }}
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
            />
            <p style={fieldErrorMessageStyle}>
              {errors.password_confirmation?.message as string}
            </p>
          </Box>

          {/* Terms and Conditions Checkbox */}
          <Box sx={{ marginBottom: '14px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('termsAccepted', {
                    required: 'You must agree to the Terms and Privacy Policy',
                  })}
                  sx={{ color: '#E61C31', '&.Mui-checked': { color: '#E61C31' } }}
                />
              }
              label={
                <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>I agree to the</span>
                  <Link href="/terms"  target="_blank" style={{ color: '#E61C31', fontWeight: 500 }}>
                    Terms
                  </Link>
                  <span>and</span>
                  <Link href="/policies"  target="_blank" style={{ color: '#E61C31', fontWeight: 500 }}>
                    Privacy Policy
                  </Link>
                </Box>
              }
            />
            <p style={fieldErrorMessageStyle}>
              {errors.termsAccepted?.message as string}
            </p>
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending || mutation.isSuccess || !termsAccepted}
              sx={{
                textTransform: 'none',
                width: '100%',
                marginTop: '10px',
                marginBottom: '20px',
              }}
            >
              Create Your Account
            </Button>
            {/* <Box
              sx={{
                fontSize: '12px',
                textAlign: 'center',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <span>View our</span>
              <Link href="/terms" style={{ color: '#E61C31', fontWeight: 500 }}>
                Terms
              </Link>
              <span>|</span>
              <Link href="/policies" style={{ color: '#E61C31', fontWeight: 500 }}>
                Privacy Policy
              </Link>
            </Box> */}
          </Box>
        </form>

        <Box sx={{ fontSize: '12px', textAlign: 'center', mb: '20px' }}>
          Already have an account?{' '}
          <Link style={{ display: 'inline' }} href="/signin">
            <span style={{ color: '#E61C31', fontWeight: 500 }}>Log in</span>
          </Link>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            marginTop: '20px',
          }}
        >
          {/* <Divider sx={{ width: '45%' }} />
          <Box
            sx={{
              fontSize: '11.2px',
              textAlign: 'center',
              marginX: '5px',
            }}
          >
            Or
          </Box>
          <Divider sx={{ width: '45%' }} /> */}
        </Box>

        {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {oAuthOptions.map((option, index) => (
            <Box
              key={index}
              onClick={() => {
                if (option.name === 'Google') {
                  googleLogin();
                }
              }}
              sx={{
                display: 'flex',
                border: '1.5px solid #D0D5DD',
                borderRadius: '6px',
                padding: '6px 20px',
                alignItems: 'center',
                width: { xs: '100%', md: '320px' },
                height: '50px',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { border: '1.5px solid #E61C31' },
              }}
            >
              <Image
                style={{ marginRight: '8px' }}
                src={option.icon}
                width={14.3}
                height={14.3}
                alt={`${option.name} Icon`}
              />
              <Box sx={{ fontSize: '11.4px', fontWeight: 600 }}>
                {option.name}
              </Box>
            </Box>
          ))}
        </Box> */}

        {showSuccess && (
          <Alert
            sx={{ position: 'relative', mb: 2, width: '100%' }}
            variant="filled"
            severity="success"
          >
            Registration successful!
          </Alert>
        )}
        {mutation.isError && !mutation.isPending && (
          <Alert
            sx={{ position: 'relative', mb: 2, width: '100%' }}
            variant="filled"
            severity="error"
          >
            {mutation.error.message}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SignUpForm;