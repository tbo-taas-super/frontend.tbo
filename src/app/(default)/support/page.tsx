"use client";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import Icon from "@/@core/component/icon";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomTextField from "@/@core/component/mui/text-field";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supportSchema } from "../../../@core/formSchema";
import { submitSupportRequest } from "@/@core/services/email";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const defaultValues: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const Support: React.FC = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(supportSchema),
  });

 const onSubmit = async (data: FormData) => {
  try {
    const success = await submitSupportRequest(data);
    if (success) {
      reset();
      setAlert({
        open: true,
        message: "Your message has been sent successfully!",
        severity: "success",
      });
    }
  } catch (error) {
    setAlert({
      open: true,
      message: "Failed to send message. Please try again later.",
      severity: "error",
    });
  }
};

  return (
 
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.5rem" },
          fontWeight: 400,
          textTransform: "capitalize",
          my: 2,
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Need Personalized Assistance?
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "1.25rem",
            sm: "1.75rem",
            md: "1.75rem",
          },
        }}
      >
        You can send us a message via the form below
      </Typography>

      <Paper
        sx={{
          px: { xs: 2, sm: 4 },
          py: 4,
          my: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4} rowSpacing={4}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  autoFocus
                  value={value}
                  onChange={onChange}
                  size={smallScreen ? "medium" : "small"}
                  placeholder="John Doe"
                  label="Name"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  size={smallScreen ? "medium" : "small"}
                  placeholder="Email"
                  label="Email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  size={smallScreen ? "medium" : "small"}
                  placeholder="+234 000 000 0000"
                  label="Phone Number"
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="subject"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  size={smallScreen ? "medium" : "small"}
                  placeholder="I want to ..."
                  label="Subject"
                  error={Boolean(errors.subject)}
                  helperText={errors.subject?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="message"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  multiline
                  rows={6}
                  placeholder="Enter your Message"
                  label="Message"
                  error={Boolean(errors.message)}
                  helperText={errors.message?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size={smallScreen ? "medium" : "small"}
              sx={{ background: "#A50214", textTransform: "capitalize" }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <Icon icon="mdi:loading" spin /> : null}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </Box>
          </form>
      </Paper>
       <Snackbar
      open={alert.open}
      autoHideDuration={6000}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseAlert}
        severity={alert.severity}
        sx={{ width: "100%" }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
    </Box>
  );
};

export default Support;
