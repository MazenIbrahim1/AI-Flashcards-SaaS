"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getDoc, doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { fetchImage } from "@/utils/fetchImage";

import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Box,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      try {
        const docRef = doc(collection(db, "users"), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);

          const imagePromises = collections.map(async (flashcard) => {
            try {
              const imageUrl = await fetchImage(flashcard.name);
              console.log(`Image URL for ${flashcard.name}:`, imageUrl); // Log URL for each flashcard
              return { name: flashcard.name, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { name: flashcard.name, imageUrl: null };
            }
          });

          const imageResults = await Promise.all(imagePromises);
          const imagesMap = imageResults.reduce((acc, { name, imageUrl }) => {
            console.log(`Image result for ${name}:`, imageUrl); // Log each image result
            acc[name] = imageUrl;
            return acc;
          }, {});

          console.log("Images Map:", imagesMap); // Log images map
          setImages(imagesMap);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setError("Failed to fetch flashcards.");
      } finally {
        setLoading(false); // Set loading to false once done
      }
    }
    getFlashcards();
  }, [user]);

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
    ); // Show loading indicator
  if (error) return <Typography color="error">{error}</Typography>; // Show error message

  const handleCardClick = (id) => {
    router.push(`flashcard?id=${id}`);
  };

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h2">My Flashcards</Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  boxShadow: 4,
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  {images[flashcard.name] ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={images[flashcard.name]}
                      alt={flashcard.name}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 140,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">No Image</Typography>
                    </Box>
                  )}

                  <CardContent>
                    <Typography variant="h6" align="center">
                      {flashcard.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Generate More
          </Typography>
          <Button variant="contained" href="/generate" sx={{ width: "200px" }}>
            Add
          </Button>
        </Box>
      </Container>
    </>
  );
}
