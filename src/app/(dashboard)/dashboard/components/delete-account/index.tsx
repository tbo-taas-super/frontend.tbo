"use client";
import {
  Button,
  Box,
  Checkbox,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";

const DeactivateAccount = () => {
  const [deactivateCheck, setDeactivateCheck] = useState(false);
  return (
    <>
      <Box sx={{ mt: 2, mb: 3 }}>
        <Typography
          sx={{ fontWeight: 600, color: "#39353D", fontSize: "16px" }}
        >
          Deactivate Account
        </Typography>
        <Typography sx={{ fontSize: "13px", mb: { xs: "0px", lg: "20px" } }}>
          Delete your account
        </Typography>
      </Box>
      <Divider variant="middle" />

      <Grid container rowGap={3} sx={{ my: 4 }}>
        <Grid item display="flex" alignItems="center" gap={1} xs={12} lg={8}>
          <Checkbox
            onChange={(e) =>
              e.target.checked
                ? setDeactivateCheck(true)
                : setDeactivateCheck(false)
            }
          />
          <Typography
            sx={{
              pr: "30px",
              fontSize: "14px",
              width: { xs: "100%", sm: "70%" },
            }}
          >
            Warning by clicking this box, it means you have agreed to delete
            your record from our database
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          lg={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              width: { xs: "70%", md: "50%" },
            }}
          >
            Deactivate
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default DeactivateAccount;
