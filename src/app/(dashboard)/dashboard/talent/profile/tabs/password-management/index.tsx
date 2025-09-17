"use client";

// * React Imports
import { useState } from "react";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "@/@core/formSchema";

// * MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { InputAdornment, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ListItem, Snackbar, Alert } from "@mui/material";

// * Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import { changePassword } from "@/@core/services/user";

const defaultValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

const Password = () => {
  const [focusNewPassword, setFocusNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
    mode: "onChange",
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (formData: any) => {
    try {
      await changePassword({
        current_password: formData.password,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });
      setSnackbar({ open: true, message: "Password changed successfully", severity: "success" });
      reset();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Failed to change password", severity: "error" });
    }
  };

  return (
    <main>
      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            fontWeight: 600,
            color: "#39353D",
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          Password Management
        </Typography>
        <Typography sx={{ fontSize: "13px", mb: "10px" }}>
          Make changes to your password
        </Typography>
      </Box>

      <Divider variant="middle" />

      <Box sx={{ my: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ width: { xs: "100%", sm: "50%" } }}>
            {/* Current Password */}
            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>Password</Typography>
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    size="medium"
                    onChange={onChange}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
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

            {/* New Password */}
            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>New password</Typography>
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
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
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
              {focusNewPassword && (
                <ListItem sx={{ color: "error.main", pl: 0 }}>{errors?.newPassword?.message}</ListItem>
              )}
            </Box>

            {/* Confirm Password */}
            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>Confirm password</Typography>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    size="medium"
                    onChange={onChange}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
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

          {/* Submit Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 4,
            }}
          >
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={isSubmitting}
              sx={{
                width: { xs: "fit-content", md: "30%" },
                textTransform: "capitalize",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Password;
