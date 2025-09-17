import { useState } from "react";
import Icon from "@/@core/component/icon";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newAdminSchema } from "@/@core/formSchema";
import ProfileImage from "../component/ProfileImage";
import CustomTextField from "@/@core/component/mui/text-field";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerAdmin } from "@/@core/services/user";

interface Props {
  open: boolean;
  close: () => void;
}

interface FormData {
  name: string;
  account_type: "ADMIN" | "SUPER_ADMIN" | "TECH";
  email: string;
  password: string;
  password_confirmation: string;
}

const defaultValues: FormData = {
  name: "",
  account_type: "" as "ADMIN" | "SUPER_ADMIN" | "TECH",
  email: "",
  password: "",
  password_confirmation: "",
};

const NewAdmin = ({ open, close }: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(newAdminSchema),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const user = {
    name: "Test User",
    job: "Developer",
    avatar: "",
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerAdmin(data);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      reset(); // Reset form on success
      setTimeout(() => {
        setSuccessMessage(null);
        close(); // Close dialog after 2 seconds
      }, 2000);
    } catch (error: any) {
      setSuccessMessage(null);
      if (error.message) {
        try {
          // Parse validation errors if they exist
          const errors = JSON.parse(error.message);
          const errorMessages = Object.values(errors).flat().join(", ");
          setErrorMessage(errorMessages);
        } catch {
          setErrorMessage(error.message || "Failed to register admin");
        }
      } else {
        setErrorMessage("Failed to register admin");
      }
    }
  };

  // Reset form when dialog closes
  const handleClose = () => {
    reset();
    setSuccessMessage(null);
    setErrorMessage(null);
    close();
  };

  return (
    <main>
      <Dialog
        open={open}
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
            minWidth: { md: 800 },
            borderRadius: "8px",
            mx: "auto",
          },
        }}
        disableScrollLock
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 3, mt: 2 }}>
          <Button onClick={handleClose} sx={{ color: "#111" }}>
            <Icon icon="basil:caret-left-solid" fontSize={25} />
          </Button>

          <Typography
            sx={{
              flex: 1,
              textAlign: "center",
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.2rem" },
              mr: "4rem",
            }}
          >
            Add New Admin
          </Typography>
        </Box>

        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(4)} !important`,
            px: (theme) => [`${theme.spacing(4)} !important`],
            m: (theme) => theme.spacing(3),
            borderRadius: "10px",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {/* <ProfileImage user={user} /> */}
          <Box sx={{ my: 1 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4} sx={{ my: 4 }}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Full Name
                  </Typography>

                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="ABC Holdings..."
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Role
                  </Typography>

                  <Controller
                    name="account_type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        select
                        value={value}
                        onChange={onChange}
                        size="medium"
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                              },
                            },
                            disableScrollLock: true,
                          },
                        }}
                        error={Boolean(errors.account_type)}
                        helperText={errors.account_type?.message}
                      >
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                   
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Email
                  </Typography>

                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="example@gmail.com"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Password
                  </Typography>

                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
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
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Confirm Password
                  </Typography>

                  <Controller
                    name="password_confirmation"
                    control={control}
                    rules={{ required: true }}
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
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors.password_confirmation)}
                        helperText={errors.password_confirmation?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider variant="middle" />

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {successMessage && (
                  <Typography color="success.main">
                    {successMessage}
                  </Typography>
                )}
                {errorMessage && (
                  <Typography color="error.main">{errorMessage}</Typography>
                )}
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
                  {isSubmitting ? "Submitting..." : "Add Admin"}
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default NewAdmin;