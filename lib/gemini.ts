import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Safety settings to ensure appropriate content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

// Get the API key from environment variables
export function getApiKey(): string {
  const apiKey = process.env.GOOGLE_AI_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not defined in environment variables. Please add it to your .env.local file.")
  }

  return apiKey
}

// Initialize the Gemini client
export function getGeminiClient() {
  const apiKey = getApiKey()
  const genAI = new GoogleGenerativeAI(apiKey)

  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    safetySettings,
  })
}

// Validate the API key by making a simple request
export async function validateApiKey(): Promise<{ isValid: boolean; message: string }> {
  try {
    const apiKey = getApiKey()
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Make a simple test request
    const result = await model.generateContent("Hello, are you working?")
    await result.response

    return {
      isValid: true,
      message: "API key is valid",
    }
  } catch (error) {
    console.error("API key validation error:", error)

    // Determine the specific error message
    let message = "Invalid API key or API error"

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        message = "Invalid API key. Please check your GOOGLE_AI_API_KEY environment variable."
      } else if (error.message.includes("not defined")) {
        message = "API key is not defined. Please add GOOGLE_AI_API_KEY to your .env.local file."
      } else {
        message = `API error: ${error.message}`
      }
    }

    return {
      isValid: false,
      message,
    }
  }
}

