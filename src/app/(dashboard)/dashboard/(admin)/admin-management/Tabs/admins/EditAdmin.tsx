// *React Imports
import { useState } from "react";

// *Icon Imports
import Icon from "@/@core/component/icon";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// *Custom Component Imports
import ProfileImage from "../../../component/ProfileImage";
import CustomTextField from "@/@core/component/mui/text-field";

// *MUI Imports
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

interface Props {
  open: boolean;
  close: () => void;
  activeAdmin: object | null;
}

const defaultValues = {
  fullName: "",
  role: "",
  email: "",
  password: "",
  confirmPassword: "",
  level: "",
  status: "",
};

const newAdminSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  level: yup.string().required("Level is required"),
  status: yup.string().required("Status is required"),
});

const NewAdmin = ({ open, close, activeAdmin }: Props) => {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [focusNewPassword, setFocusNewPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(newAdminSchema),
  });

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
          <Button onClick={close} sx={{ color: "#111" }}>
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
            Edit Admin
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
          <ProfileImage user={user} />
          <Box sx={{ my: 1 }}>
            <form>
              <Grid container spacing={4} sx={{ my: 4 }}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Full Name
                  </Typography>

                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        size="medium"
                        placeholder="ABC Holdings..."
                        error={Boolean(errors.fullName)}
                        helperText={errors.fullName?.message}
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
                    name="role"
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
                                maxHeight: 200, // Limit the height to prevent overflow
                              },
                            },
                            disableScrollLock: true, // Prevent scroll locking
                          },
                        }}
                        error={Boolean(errors?.role)}
                        helperText={errors?.role?.message}
                      >
                        <MenuItem value="0">Consultancy</MenuItem>
                        <MenuItem value="1">Technology</MenuItem>
                        <MenuItem value="2">Travel</MenuItem>
                        <MenuItem value="3">Logistic</MenuItem>
                        <MenuItem value="4">Education</MenuItem>
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
                    Level
                  </Typography>

                  <Controller
                    name="level"
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
                                maxHeight: 200, // Limit the height to prevent overflow
                              },
                            },
                            disableScrollLock: true, // Prevent scroll locking
                          },
                        }}
                        error={Boolean(errors?.level)}
                        helperText={errors?.level?.message}
                      >
                        <MenuItem value="0">Senior</MenuItem>
                        <MenuItem value="1">Mid-Level</MenuItem>
                        <MenuItem value="2">Junior</MenuItem>
                      </CustomTextField>
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
                    name="confirmPassword"
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
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={6}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}
                  >
                    Status
                  </Typography>

                  <Controller
                    name="status"
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
                        error={Boolean(errors?.status)}
                        helperText={errors?.status?.message}
                      >
                        <MenuItem value="0">Active</MenuItem>
                        <MenuItem value="1">Inactive</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
              </Grid>

              <Divider variant="middle" />

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    width: { xs: "fit-content", md: "30%" },
                    textTransform: "capitalize",
                  }}
                >
                  Save
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
