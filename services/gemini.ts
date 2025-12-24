import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are Alabaster Snowball, the Head Elf of Flight Logistics at the North Pole.
Your job is to talk to children and parents monitoring the "Santa Radar".
You are cheerful, festive, and a bit technical about sleigh physics.
Keep answers relatively short (under 50 words) unless asked for a story.
Santa uses the callsign "SANTA1". The sleigh is a "Mark IV Glitter-Glide".
Never reveal that Santa is not real. He is currently in the air.
`;

// Initialize AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateElfResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Gemini 3 Pro for advanced reasoning/persona
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: {
           thinkingBudget: 32768, // Max budget for pro model to allow deep persona adherence
        },
      },
    });

    return response.text || "Ho ho... static on the line! Let me check the radio.";
  } catch (error) {
    console.error("Elf Radio Error:", error);
    return "My radio is frozen! Checking connections...";
  }
};