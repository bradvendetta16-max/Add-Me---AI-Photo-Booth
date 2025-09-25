
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `You are an expert photo editor. Your task is to seamlessly integrate the person from the second image into the first image (the group photo). The person in the second image is the one who took the group photo. Add them to the group in a natural and realistic way, paying attention to lighting, shadows, scale, and the overall style of the photo. Ensure the final result looks like a single, cohesive photograph. Only return the final edited image.`;

const parseGeminiResponse = (response: any): { image: string | null; text: string | null } => {
  let imageResult: string | null = null;
  let textResult: string | null = null;

  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageResult = part.inlineData.data;
      } else if (part.text) {
        textResult = part.text;
      }
    }
  }
  
  return { image: imageResult, text: textResult };
};


export const addPersonToPhoto = async (
  groupPhoto: ImageFile,
  personPhoto: ImageFile
): Promise<{ image: string | null; text: string | null }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: groupPhoto.base64, mimeType: groupPhoto.mimeType } },
          { inlineData: { data: personPhoto.base64, mimeType: personPhoto.mimeType } },
          { text: PROMPT },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    return parseGeminiResponse(response);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image with AI. Please check your API key and try again.");
  }
};

export const refinePhoto = async (
  currentPhoto: ImageFile,
  prompt: string
): Promise<{ image: string | null; text: string | null }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: currentPhoto.base64, mimeType: currentPhoto.mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    return parseGeminiResponse(response);

  } catch (error) {
    console.error("Error calling Gemini API during refinement:", error);
    throw new Error("Failed to refine image with AI. Please check your API key and try again.");
  }
};
