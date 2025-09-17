"use client";

import { useRouter } from "next/navigation";

import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          height: "100vh",
          background: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.light,
        }}
      >
        <Typography sx={{ fontSize: { xs: "1rem", md: "1.752rem" } }}>
          404:Page Does Not Exist
        </Typography>
        <p>The page has been changed, renamed or removed</p>

        <Button
          size="large"
          sx={{
            background: (theme) => theme.palette.primary.light,
            textTransform: "capitalize",
            minWidth: 150,
            "&:hover": {
              background: (theme) => theme.palette.primary.dark,
              color: (theme) => theme.palette.primary.light,
              transition: "all ease-in 0.4",
            },
          }}
          onClick={() => goBack()}
        >
          Go Back
        </Button>
      </Box>
    </main>
  );
}
