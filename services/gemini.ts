import { GoogleGenAI, Type } from "@google/genai";
import { LevelData, ThemeType, WordPosition } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAILevel = async (theme: ThemeType, levelId: number): Promise<LevelData | null> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Create a word puzzle level with the theme "${theme}".
    Provide exactly 5 to 7 letters that form multiple valid English words.
    Create a simple crossword-style layout with 4 to 6 intersecting words using ONLY these letters.
    
    Output strictly JSON matching the schema.
    Coordinate system: Grid starts at 0,0 (top-left). x increases right, y increases down.
    Ensure words intersect at least once.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            letters: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  startX: { type: Type.INTEGER },
                  startY: { type: Type.INTEGER },
                  direction: { type: Type.STRING, enum: ["horizontal", "vertical"] }
                }
              }
            }
          },
          required: ["name", "letters", "words"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      id: levelId,
      theme: theme,
      name: data.name || "AI Generated",
      letters: data.letters.map((l: string) => l.toUpperCase()),
      words: data.words.map((w: any) => ({
        word: w.word.toUpperCase(),
        startX: w.startX,
        startY: w.startY,
        direction: w.direction,
        found: false
      }))
    };

  } catch (error) {
    console.error("Failed to generate AI level:", error);
    return null;
  }
};

export const getHintForWord = async (word: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Give a very short, fun hint definition for the word "${word}" in less than 6 words. No quotes.`,
        });
        return response.text?.trim() || "A mystery word!";
    } catch (e) {
        return "Hidden word";
    }
}
