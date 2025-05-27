"use server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const GEMINI_AI = new GoogleGenAI({
  apiKey,
});

export const modal = "gemini-2.5-flash-preview-04-17";

export const chatSession = GEMINI_AI.chats.create({
  model: modal,
  config: {
    maxOutputTokens: 8192,
    temperature: 1,
  },
});
