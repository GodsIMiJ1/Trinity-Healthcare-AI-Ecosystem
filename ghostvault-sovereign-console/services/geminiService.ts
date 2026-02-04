
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;
  private modelName: string = 'gemini-3-pro-preview';

  constructor() {
    // Initialized using process.env.API_KEY directly as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  async queryGhostAGA(query: string, history: { role: string; parts: { text: string }[] }[], moduleContext: string) {
    try {
      // Create a fresh instance to ensure the latest API key is used right before the call
      const client = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const response = await client.models.generateContent({
        model: this.modelName,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: `[Context: ${moduleContext}] User Input: ${query}` }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              system_message: { type: Type.STRING },
              analysis: { type: Type.STRING },
              guidance_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              warnings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    severity: { type: Type.STRING }
                  }
                }
              },
              governance_check: { type: Type.STRING }
            },
            required: ["system_message", "analysis", "guidance_steps", "warnings", "governance_check"]
          },
          temperature: 0.3, // Lower temperature for technical precision
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      const text = response.text || "{}";
      return JSON.parse(text.trim());
    } catch (error) {
      console.error("Ghost-AGA Query Error:", error);
      return {
        system_message: "Intelligence communication failure.",
        analysis: "The system intelligence layer is unresponsive or returned invalid telemetry.",
        guidance_steps: ["Check API Key status", "Verify network connectivity to Gemini endpoints"],
        warnings: [{ text: "System is operating in blind mode", severity: "critical" }],
        governance_check: "denied"
      };
    }
  }
}

export const geminiService = new GeminiService();
