import { NextResponse } from "next/server";
import OpenAI from "openai";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();
  const number = data.quantity || 10;

  const systemPrompt = `
  You are a flashcard creator. Given the input text, produce flashcards where both the front and back are one sentence long.
  
  Instructions:
  1. Create a concise, clear question for the front.
  2. Provide an accurate, informative answer for the back.
  3. Focus each flashcard on a single concept.
  4. Use simple language.
  5. Include diverse question types (definitions, examples, comparisons, applications).
  6. Avoid ambiguity and overly complex phrasing.
  7. Use mnemonics when helpful.
  8. Tailor difficulty to the provided preferences.
  9. Extract only the most important information.
  10. Ensure the flashcards cover the topic comprehensively.
  
  Return the result in the following JSON format exactly, with exactly ${number} flashcards:
  {
    "flashcards":[
      {
        "front": "Front of the card",
        "back": "Back of the card"
      },
      // ... total of ${number} objects
    ]
  }
`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data.text },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(flashcards.flashcards);
}

export async function generate(req) {}

export async function GET(req) {
  return Response.json({ message: "API is working" });
}
