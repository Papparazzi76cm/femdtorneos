
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Ensure API key is available
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

const getChatInstance = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'Eres un asistente útil para una empresa de eventos de fútbol. Sé amable, conciso y céntrate en temas relacionados con el fútbol.',
            },
        });
    }
    return chat;
};

export const geminiService = {
    chatWithBot: async (history: ChatMessage[], newMessage: string): Promise<string> => {
        try {
            const chatInstance = getChatInstance();
            const result: GenerateContentResponse = await chatInstance.sendMessage({ message: newMessage });
            return result.text;
        } catch (error) {
            console.error("Error in chatWithBot:", error);
            return "Lo siento, estoy teniendo problemas para conectarme a mi cerebro en este momento. Por favor, inténtalo de nuevo más tarde.";
        }
    },

    generateImage: async (prompt: string, aspectRatio: string): Promise<string> => {
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                 const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                 return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
            throw new Error("No se ha generado ninguna imagen.");
        } catch (error) {
            console.error("Error generating image:", error);
            throw new Error("Error al generar la imagen.");
        }
    },
    
    fetchWithSearch: async (query: string): Promise<{text: string, sources: any[]}> => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query,
                config: {
                    tools: [{googleSearch: {}}]
                }
            });
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return { text: response.text, sources };
        } catch (error) {
            console.error("Error with Google Search grounding:", error);
            throw new Error("Error al obtener información con la Búsqueda de Google.");
        }
    },

    fetchWithMaps: async (query: string, latitude: number, longitude: number): Promise<{text: string, sources: any[]}> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: query,
                config: {
                    tools: [{googleMaps: {}}],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: { latitude, longitude }
                        }
                    }
                },
            });
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return { text: response.text, sources };
        } catch (error) {
            console.error("Error with Google Maps grounding:", error);
            throw new Error("Error al obtener información con Google Maps.");
        }
    },

    analyzeComplexQuery: async (query: string): Promise<string> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: query,
                config: {
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });
            return response.text;
        } catch (error) {
            console.error("Error with complex query analysis:", error);
            throw new Error("Error al analizar la consulta compleja.");
        }
    },
    
    generatePostDescription: async (topic: string): Promise<string> => {
        try {
            const prompt = `Escribe una descripción corta y atractiva para una entrada de blog (de unas 3-4 frases) para una empresa de eventos de fútbol sobre el siguiente tema: "${topic}". Usa un tono emocionante y moderno.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("Error generating post description:", error);
            throw new Error("Error al generar la descripción de la publicación.");
        }
    },

    generateFullPostContent: async (topic: string): Promise<string> => {
        try {
            const prompt = `Escribe un artículo de blog completo y atractivo para una empresa de eventos de fútbol sobre el siguiente tema: "${topic}". El artículo debe tener entre 300 y 400 palabras. Estructúralo con una introducción, un cuerpo principal con varios párrafos y una conclusión. Usa un tono emocionante y profesional.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("Error generating full post content:", error);
            throw new Error("Error al generar el contenido completo de la publicación.");
        }
    }
};