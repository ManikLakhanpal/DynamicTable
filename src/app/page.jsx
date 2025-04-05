"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8, textAlign: "center" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Table Component
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          gutterBottom
        >
          {"By Manik :-)"}
        </Typography>

        <Box sx={{ mt: 6, mb: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Card sx={{ minWidth: 275, maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Users Table
                </Typography>
                <Button
                  component={Link}
                  href="/users"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  View Users
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ minWidth: 275, maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Products Table
                </Typography>
                <Button
                  component={Link}
                  href="/products"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  View Products
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
