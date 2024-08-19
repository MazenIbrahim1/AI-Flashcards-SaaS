import { NextResponse } from "next/server";
import OpenAI from "openai";
import Stripe from "stripe";

const systemPrompt = `
  You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
  Both front and back should be one sentence long. Follow these guidelines:

  1. Create a clear and concise questions for the front of the flashcard.
  2. Provide accurate and informative answers for the back of the flashcard.
  3. Ensure that each flashcard focuses on a single concept of piece of information.
  4. Use simple language to make the flashcards accessible to a wide range of learners.
  5. Include a variety of question tyoes, such as definitions, examples, comparisons, and applications.
  6. Avoid overly complex or ambiguous phrasing in both the front and back of the flashcard.
  7. When appropriate, use mnemonics or memory aids to help reinforce the information.
  8. Tailor the difficulty level of the flashcards to the user's specified preferences.
  9. If given a body of text, extract the most important and relevant information for the flashcards.
  10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
  11. Only generate 10 flashcards.

  Remember the goal is to facilitate effective learning and retention of information through these flashcards.

  You should return in the following JSON format:
  {
    "flashcards":[
      {
        "front": "Front of the card",
        "back": "Back of the card"
      }
    ]
  }
`;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(flashcards.flashcards);
}

export async function generate(req) {}
