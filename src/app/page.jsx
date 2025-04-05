"use client"

import { Box, Container, Typography, Button, Stack, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Table
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          Filtering, URL synchronization, and pagination
        </Typography>
      </Box>
    </Container>
  );
}
