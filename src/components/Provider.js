"use client"

import { ThemeProvider } from "@mui/material";
import theme from "@/components/theme";

function Provider({ children }) {
  return (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
  );
}

export default Provider;
