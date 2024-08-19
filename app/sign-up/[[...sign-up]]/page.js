import { SignIn, SignUp } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <Container maxWidth="100vw" disableGutters>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Flashcard SaaS
            </Typography>
            <Button color="inherit">
              <Link href="/sign-in" passHref>
                Login
              </Link>
            </Button>
            <Button color="inherit">
              <Link href="/sign-up" passHref>
                Sign Up
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      </Container>
      <Container maxWidth="100vw">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={4}
        >
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          <SignUp />
        </Box>
      </Container>
    </>
  );
}
