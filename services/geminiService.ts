// services/geminiService.ts

import { ChatMessage } from "../types";

// !! IMPORTANTE: Reemplaza esto con la URL base de tus funciones de Supabase !!
const FUNCTIONS_BASE_URL = 'https://iqxequahexzheggucfmk.supabase.co/functions/v1';

// Función auxiliar para manejar las peticiones fetch al backend
const fetchFromBackend = async (endpoint: string, body: any) => {
    // Construye la URL completa
    const url = `${FUNCTIONS_BASE_URL}/${endpoint}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // La API key de Supabase (anon) es segura de exponer y necesaria para llamar a las funciones
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeGVxdWFoZXh6aGVnZ3VjZm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODYyMjEsImV4cCI6MjA3ODI2MjIyMX0.JNWN_wmI0sbdrn0IBveykhFpetfSSmBbo3QuJgW3y-4`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido en el backend.' }));
        throw new Error(errorData.error || `La petición al backend falló con estado ${response.status}`);
    }

    return response.json();
};


export const geminiService = {
    chatWithBot: async (history: ChatMessage[], newMessage: string): Promise<string> => {
        try {
            // Llama al endpoint 'chat'
            const data = await fetchFromBackend('chat', { history, newMessage });
            return data.text;
        } catch (error) {
            console.error("Error in chatWithBot:", error);
            return "Lo siento, estoy teniendo problemas para comunicarme con el servidor. Por favor, inténtalo de nuevo más tarde.";
        }
    },

    generateImage: async (prompt: string, aspectRatio: string): Promise<string> => {
        try {
            // Llama al endpoint 'generate-image'
            const data = await fetchFromBackend('generate-image', { prompt, aspectRatio });
            return data.imageUrl;
        } catch (error) {
            console.error("Error generating image:", error);
            throw new Error("Error al generar la imagen a través del servidor.");
        }
    },
    
    // ... y así sucesivamente para el resto de funciones ...
    fetchWithSearch: async (query: string): Promise<{text: string, sources: any[]}> => {
        try {
            const data = await fetchFromBackend('search', { query });
            return data;
        } catch (error) {
            console.error("Error with Google Search grounding:", error);
            throw new Error("Error al obtener información con la Búsqueda de Google a través del servidor.");
        }
    },
    
    fetchWithMaps: async (query: string, latitude: number, longitude: number): Promise<{text: string, sources: any[]}> => {
         try {
            const data = await fetchFromBackend('maps', { query, latitude, longitude });
            return data;
        } catch (error) {
            console.error("Error with Google Maps grounding:", error);
            throw new Error("Error al obtener información con Google Maps a través del servidor.");
        }
    },
    
    analyzeComplexQuery: async (query: string): Promise<string> => {
        try {
            const data = await fetchFromBackend('analyze', { query });
            return data.text;
        } catch (error) {
            console.error("Error with complex query analysis:", error);
            throw new Error("Error al analizar la consulta compleja a través del servidor.");
        }
    },
    
    generatePostDescription: async (topic: string): Promise<string> => {
         try {
            const data = await fetchFromBackend('generate-description', { topic });
            return data.text;
        } catch (error) {
            console.error("Error generating post description:", error);
            throw new Error("Error al generar la descripción de la publicación a través del servidor.");
        }
    },
    
    generateFullPostContent: async (topic: string): Promise<string> => {
        try {
             const data = await fetchFromBackend('generate-content', { topic });
             return data.text;
        } catch (error) {
            console.error("Error generating full post content:", error);
            throw new Error("Error al generar el contenido completo de la publicación a través del servidor.");
        }
    }
};