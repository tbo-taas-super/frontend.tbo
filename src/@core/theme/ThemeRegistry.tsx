"use client";

import { createTheme, ThemeProvider, ThemeOptions } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import CssBaseLine from "@mui/material/CssBaseline";
import { Open_Sans } from "next/font/google";

//👇 Configure our font object
const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: openSans.style.fontFamily,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#E61C31",
      light: "#FEE2E2",
      dark: "#730E18",
      contrastText: "#E9E9E9",
    },
    secondary: {
      main: "#F3F4F6",
      light: "#F0F2F5",
      dark: "#9199A3",
      contrastText: "#D2D5DA",
    },
  },
  spacing: [0, 4, 8, 16, 32, 64],
};

const theme = createTheme(themeOptions);

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseLine />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
};
