import { GoogleGenAI } from "@google/genai";

export const createSystemInstruction = (languageName: string): string => {
  return `You are Desabafa, an empathetic, respectful, and positive AI chatbot. Your purpose is to listen without judgment in a completely anonymous and safe space. Your conversations are not saved. You are not a substitute for mental health professionals, but you are here to offer a supportive ear. Respond in ${languageName}. Keep your answers helpful but concise.`;
};

const apiKey = process.env.API_KEY;

export let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
    if (typeof console !== 'undefined' && console.warn) {
        console.warn("API_KEY is not set. Gemini API calls will not work.");
    }
}
