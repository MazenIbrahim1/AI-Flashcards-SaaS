"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!user || !search) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });

      setFlashcards(flashcards);
      console.log(flashcards);
    }
    try {
      getFlashcard();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) return <></>;

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Container maxWidth="100vw" disableGutters>
        <AppBar position="static">
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
      </Container>
      <Container maxWidth="100vw">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    handleCardClick(index);
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          width: "100%",
                          height: "200px",
                          transition: "transform 0.6s",
                          boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          transform: flipped[index]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        },
                        "& > div > div": {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 2,
                          boxSizing: "border-box",
                        },
                        "& > div > div:nth-of-type(2)": {
                          transform: "rotateY(180deg)",
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ml: 22,
            }}
          >
            <Button
              variant="contained"
              href="/flashcards"
              sx={{
                width: "10vw",
                height: "5vh",
                alignItems: "center",
              }}
            >
              Back
            </Button>
          </Box>
        </Grid>
      </Container>
    </>
  );
}
