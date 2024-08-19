"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, use } from "react";
import { getDoc, doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, SetFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        SetFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) return <></>;

  const handleCardClick = (id) => {
    router.push(`flashcard?id=${id}`);
  };

  return (
    <>
      <Container maxWidth="100vw"></Container>
    </>
  );
}
