"use server"

import { getGeminiClient, validateApiKey } from "@/lib/gemini"

export interface GossipContent {
  headline: string
  summary: string
  content: string
  imagePrompt: string
}

export interface SavedGossip {
  id: string
  celebrity: string
  category: string
  headline: string
  summary: string
  content: string
  imagePrompt?: string
  imageUrl?: string
  timestamp: number
  theme: string
}

export interface ApiKeyStatus {
  isValid: boolean
  message: string
}

// Cache the API key status to prevent too many validation calls
let cachedApiKeyStatus: ApiKeyStatus | null = null
let lastChecked = 0
const CACHE_DURATION = 60000 // 1 minute

// Validate the Gemini API key from environment variables
export async function checkApiKeyStatus(): Promise<ApiKeyStatus> {
  const now = Date.now()

  // Return cached result if it's recent enough
  if (cachedApiKeyStatus && now - lastChecked < CACHE_DURATION) {
    return cachedApiKeyStatus
  }

  try {
    const status = await validateApiKey()
    cachedApiKeyStatus = status
    lastChecked = now
    return status
  } catch (error) {
    const errorStatus = {
      isValid: false,
      message: error instanceof Error ? error.message : "Failed to validate API key",
    }
    cachedApiKeyStatus = errorStatus
    lastChecked = now
    return errorStatus
  }
}

// Generate gossip content using Gemini
export async function generateGossip(celebrity: string, category: string): Promise<GossipContent> {
  try {
    const model = getGeminiClient()

    const prompt = `Create a funny, harmless, and completely fictional gossip story about ${celebrity} focused on the category: ${category}.
    Make it entertaining and obviously fake, like something from a satirical tabloid.
    The story should be lighthearted and never mean-spirited.
    
    Format your response as a JSON object with the following structure:
    {
      "headline": "A catchy, tabloid-style headline for the gossip story",
      "summary": "A brief 1-2 sentence summary/lead for the story",
      "content": "The full gossip story content (3-4 paragraphs)",
      "imagePrompt": "A detailed prompt for generating an image that represents the story in a humorous, obviously fake way without using the celebrity's real name (to avoid creating a realistic deepfake)"
    }
    
    Only return the JSON object, nothing else.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Extract JSON from text - sometimes the API returns additional text before or after JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonText);

      // Validate the response structure
      if (!parsedResponse.headline || !parsedResponse.summary || !parsedResponse.content) {
        console.error("Invalid Gemini response structure:", parsedResponse);
        throw new Error("Invalid response format from Gemini");
      }

      return {
        headline: parsedResponse.headline,
        summary: parsedResponse.summary,
        content: parsedResponse.content,
        imagePrompt:
          parsedResponse.imagePrompt || `A humorous, fictional image related to ${celebrity} and ${category}`,
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw response text:", text);
      
      // Fallback with a default structure if parsing fails
      return {
        headline: `${celebrity} Involved in Outrageous ${category} Scandal (That's Completely Made Up)`,
        summary: `Our AI couldn't create a proper story format, but here's some fictional ${category} gossip about ${celebrity}.`,
        content: `We tried to generate a funny story about ${celebrity} related to ${category}, but our AI had trouble formatting it properly. 
        
        Rest assured that no real gossip exists - this is all meant to be fictional entertainment! 
        
        Please try again, and our AI will do better next time.`,
        imagePrompt: `A cartoon of a confused AI trying to write a gossip story about ${celebrity} and ${category}, clearly fictional and humorous`,
      };
    }
  } catch (error) {
    console.error("Error generating gossip:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid API key. Please check your environment variables.");
      } else if (error.message.includes("quota")) {
        throw new Error("API quota exceeded. Please try again later or check your Gemini API usage limits.");
      } else if (error.message.includes("network")) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
    }

    throw new Error(error instanceof Error ? error.message : "Failed to generate gossip");
  }
}

// Generate an image using Gemini
export async function generateImage(prompt: string): Promise<string> {
  try {
    const model = getGeminiClient()

    // Enhance the prompt to ensure it's suitable for image generation
    const enhancedPrompt = `Create a humorous, obviously fictional image based on this description: ${prompt}. 
    Make it look like a satirical tabloid photo, clearly fake and not realistic.
    The image should be colorful, exaggerated, and cartoonish in style.`

    // Generate the image
    const result = await model.generateContent([enhancedPrompt])
    const response = await result.response

    // Check if there are parts with image data
    if (response.candidates && 
        response.candidates[0] && 
        response.candidates[0].content && 
        response.candidates[0].content.parts) {
      const parts = response.candidates[0].content.parts
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
          // Return the base64 data URL
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        }
      }
    } else {
      console.error("Unexpected response structure:", JSON.stringify(response))
    }

    // If no image was found in the response, return a placeholder
    return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(prompt.substring(0, 30))}...`
  } catch (error) {
    console.error("Error generating image:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid API key. Please check your environment variables.")
      } else if (error.message.includes("quota")) {
        throw new Error("API quota exceeded. Please try again later or check your Gemini API usage limits.")
      } else if (error.message.includes("network")) {
        throw new Error("Network error. Please check your internet connection and try again.")
      }
    }

    // Return a placeholder image URL if the real generation fails
    return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(prompt.substring(0, 30))}...`
  }
}

// Save a gossip story to favorites
export async function saveGossip(gossip: SavedGossip): { success: boolean; message: string } {
  try {
    // In a real application, you might save this to a database
    // For this example, we'll just return success
    return {
      success: true,
      message: "Gossip saved successfully!",
    }
  } catch (error) {
    console.error("Error saving gossip:", error)
    return {
      success: false,
      message: "Failed to save gossip",
    }
  }
}

