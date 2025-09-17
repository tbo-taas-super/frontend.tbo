'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordSchema } from '@/@core/formSchema';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/@core/component/mui/text-field';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { InputAdornment, IconButton, Divider, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ListItem } from '@mui/material';
import { changePassword } from '@/@core/services/user';
import { signOut } from 'next-auth/react';

const defaultValues = {
  password: '',
  newPassword: '',
  confirmPassword: '',
};

const Password = () => {
  const [focusNewPassword, setFocusNewPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); // State for dialog
  const { data: session } = useSession();
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(passwordSchema),
  });

  const handleDialogClose = () => {
    setDialogOpen(false);
    signOut({ callbackUrl: '/signin' }); // Sign out and redirect to login page
  };

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      const changePasswordResponse = await changePassword({
        current_password: data.password,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      });
      console.log('changePassword Response:', changePasswordResponse);

      // Show success message in snackbar
      setSnackbar({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });

      reset();

      // Open dialog to prompt re-authentication
      setDialogOpen(true);
    } catch (error: any) {
      console.error('Password change error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to change password',
        severity: 'error',
      });
    }
  };

  return (
    <main>
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
          Password Management
        </Typography>
        <Typography sx={{ fontSize: '13px', mb: '10px' }}>Make changes to your password</Typography>
      </Box>

      <Divider variant="middle" />

      <Box sx={{ my: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: '10px' }}>Password</Typography>
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    size="medium"
                    onChange={onChange}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: '10px' }}>New password</Typography>
              <Controller
                name="newPassword"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    size="medium"
                    onChange={onChange}
                    onFocus={() => setFocusNewPassword(true)}
                    onBlur={() => setFocusNewPassword(false)}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(errors.newPassword)}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />
              {focusNewPassword && <ListItem>{errors?.newPassword?.message}</ListItem>}
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: '10px' }}>Confirm password</Typography>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    size="medium"
                    onChange={onChange}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Box>
          </Stack>

          <Divider variant="middle" />
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', my: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ width: { xs: 'fit-content', md: '30%' }, textTransform: 'capitalize' }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
            transition: 'all 0.3s ease-in-out',
            maxWidth: '400px',
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1a202c',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Password Updated
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: '1rem',
              color: '#4a5568',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Your password has been successfully changed. Please log in again with your new password.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            pb: 2,
          }}
        >
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{
              backgroundColor: '#c90000ff',
              color: '#fff',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '12px',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#eb253fff',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Password;