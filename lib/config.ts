// Environment configuration

// Check if we're running on the server
const isServer = typeof window === "undefined"

export const config = {
  // OpenAI API configuration
  openai: {
    apiKey: isServer ? process.env.OPENAI_API_KEY : undefined,
  },

  // App configuration
  app: {
    // Use NEXT_PUBLIC_APP_URL as the definitive source of truth
    url: process.env.NEXT_PUBLIC_APP_URL || "",
  },
}

// Helper function to check if OpenAI API is configured
export function isOpenAIConfigured(): boolean {
  return !!config.openai.apiKey
}
