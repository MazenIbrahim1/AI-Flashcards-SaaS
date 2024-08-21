"use client";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { useTheme } from "@mui/material/styles"; // Import useTheme

//testing

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (!isSignedIn) {
      alert("You must be signed in to generate flashcards.");
      return;
    }
    router.push("/flashcards");
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch("api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3001",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSessionJson.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };
  const theme = useTheme(); // Access the theme

  return (
    <>
      <Container maxWidth="false" disableGutters>
        <AppBar
          position="static"
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          <Toolbar>
            <Button color="inherit" href="/" style={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                Flashcard SaaS
              </Typography>
            </Button>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Head>
          <title>Flashcard SaaS</title>
          <meta name="description" content="Create flashcards from your text" />
        </Head>
      </Container>
      <Container maxWidth="false">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mt={4}
          sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: "77vh",
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{ color: theme.palette.primary.main }}
          >
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" gutterBottom>
            The Easiest Way to Make Flashcards From Your Text
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, padding: "12px 24px" }}
            onClick={handleGetStarted}
          >
            Get Started!
          </Button>
        </Box>
        <Box
          sx={{
            my: 6,
            textAlign: "center",
            backgroundColor: "grey.100",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  padding: 3,
                  boxShadow: 1,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Easy Text Input
                </Typography>
                <Typography>
                  Simply input your text and let our software do the rest!
                  Creating flashcards has never been easier.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  padding: 3,
                  boxShadow: 1,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Smart Flashcards
                </Typography>
                <Typography>
                  Our AI intelligently breaks down your text into concise
                  flashcards. Perfect for studying.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  padding: 3,
                  boxShadow: 1,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Accessible Anywhere
                </Typography>
                <Typography>
                  Access your flashcards from any device, at any time! Study on
                  the go with ease.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ my: 6, textAlign: "center", backgroundColor: "grey.100" }}>
          <Typography variant="h4" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  boxShadow: 4,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5 / month
                </Typography>
                <Typography>
                  Access to basic flashcard features and limited storage.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  boxShadow: 4,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $10 / month
                </Typography>
                <Typography>
                  Unlimited flashcards and storage with priority support!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                >
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
