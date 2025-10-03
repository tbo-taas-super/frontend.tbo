'use client';

import { MailOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, signIn, useSession } from 'next-auth/react';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import { useEffect } from 'react';

const SigninForm: FC = () => {
  const router = useRouter();

  const [isError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accountType && isLoginSuccess) {
      router.push(`/dashboard/${session.user.accountType.toLowerCase()}`);
    }
  }, [session, isLoginSuccess, router]);

  const login = async (data: any) => {
    setIsLoading(true);
    setShowError(false);
    
    const res = await signIn('credentials', { 
      redirect: false, 
      ...data 
    });
  
    if (res?.ok) {
      setIsLoginSuccess(true);
    } else {
      setShowError(true);
    }
    
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
    
           
      }}
    >
      <Container component="main" maxWidth="xs">
        {isError && !isLoading && !isLoginSuccess &&  (
          <Alert sx={{ position: 'fixed', right: 20, top: 10, zIndex: 1000 }} variant="filled" severity="error">
            Invalid login credentials!
          </Alert>
        )}
       <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 14,
          borderRadius: 3,
          px: 4,
          py: 4,
          transition: 'box-shadow',
          boxShadow: 4,
          backgroundColor: 'background.paper',
          justifyContent: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <Link href="/">
          <Image 
            src={'/talotamain.svg'}
            width={325.4}
            height={124.2}
            alt={'TBO logo'}
            style={{ marginBottom: '10px' }}
          />
        </Link>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '20.8px',
              lineHeight: '131%',
              my: 1,
              mb: '15px'
            }}
          >
            Welcome back!
          </Typography>
          <Typography
            component="p"
            variant="subtitle1"
            sx={{
              color: 'text.disabled',
              fontWeight: 600,
              fontSize: '12.8px',
              lineHeight: '131%',
              textAlign: 'center',
              mb: '30px'
            }}
          >
            Please enter your credentials to access your account
          </Typography>
          <form onSubmit={handleSubmit(login)}>
            <Grid container spacing={2}>
              <Grid sx={{ mb: '18px' }} item xs={12}>
              <Box sx={{ color: '#101928', fontSize: '12px', fontWeight: 600, marginBottom: '5px' }}>EMAIL</Box>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id="email"
                      name="email"
                      autoComplete="email"
                      placeholder='Enter Email Address'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      inputProps={{style: {fontSize: '12px'}}} InputProps={{ endAdornment: (
                        <InputAdornment position="end">
                            <MailOutline />
                        </InputAdornment>
                    ) }}
                    />
                  )}
                />
              </Grid>
              <Grid sx={{ mb: '15px' }} item xs={12}>
              <Box sx={{ color: '#101928', fontSize: '12px', fontWeight: 600, marginBottom: '5px' }}>PASSWORD</Box>
                <FormControl fullWidth required>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter Password"
                        inputProps={{style: {fontSize: '12px'}}} InputProps={{ endAdornment: (
                          <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ) }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {/* <Grid container justifyContent="end">
                <Grid item>
                  <Link href="/forgot-password" style={{ color: '#007a27' }}>
                    <Typography
                      component="p"
                      variant="subtitle1"
                      sx={{ mt: 1, color: '#007A28' }}
                    >
                      Forgot Password?
                    </Typography>
                  </Link>
                </Grid>
              </Grid> */}
               <Box sx={{ fontSize: '13px', mt: '20px', textAlign: 'center' }}> <Link style={{ display: 'inline' }} href="/forget-password"><span style={{ color: '#E61C31', fontWeight: 900 }}>Forget Password ?</span></Link></Box>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: '100%', textTransform: 'capitalize', py: '10px', mt: '15px' }}
                //   size="xlarge"
                  disabled={isLoading || isLoginSuccess}
                >
                  {isLoading || isLoginSuccess ? 'Logging in...' : 'Login to your account'}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Box sx={{ fontSize: '13px', mt: '20px', textAlign: 'center' }}>Are you new here? <Link style={{ display: 'inline' }} href="/sign-up"><span style={{ color: '#E61C31', fontWeight: 500 }}>Create Account</span></Link></Box>
          
        </Box>
      </Container>
    </Box>
  );
};

export default SigninForm;