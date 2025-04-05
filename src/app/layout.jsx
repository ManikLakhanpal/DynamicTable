import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CssBaseline,
} from "@mui/material";
import Provider from "@/components/Provider";
import Link from "next/link";

export const metadata = {
  title: "Table Component Demo",
  description: "By Manik :-)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <CssBaseline />

          {/* Navigation Bar */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link
                  href="/"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Table
                </Link>
              </Typography>
              <Button color="inherit" component={Link} href="/users">
                Users
              </Button>
              <Button color="inherit" component={Link} href="/products">
                Products
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth={false} sx={{ mt: 4 }}>
            <Box sx={{ minHeight: "calc(100vh - 120px)" }}>{children}</Box>

            {/* Footer */}
            <Box
              component="footer"
              sx={{
                py: 3,
                textAlign: "center",
                borderTop: "1px solid #eaeaea",
                mt: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {"Table Component by Manik :-)"}
              </Typography>
            </Box>
          </Container>
        </Provider>
      </body>
    </html>
  );
}
