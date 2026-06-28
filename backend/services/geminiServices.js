import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const translateMessage = async (text, targetLanguage) => {
    try {
        if (!targetLanguage) return null;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a real-time instant chat application backend translator hook. 
            Translate this exact message cleanly into ${targetLanguage}. 
            Provide ONLY the raw translated text output string. Do not wrap in quotes, do not include meta explanations, and do not use conversational intros.
            
            Text to translate: "${text}"`,
        });

        return response.text ? response.text.trim() : null;
    } catch (error) {
        console.error("❌ Gemini Service Error:", error);
        return null;
    }
};