import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Set the runtime to edge for better performance
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Get the request body
    const body = await req.json()
    const { prompt, apiKey: clientApiKey } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use client-provided API key if available, otherwise use environment variable
    const apiKey = clientApiKey || process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add it to your settings." },
        { status: 500 },
      )
    }

    // Call OpenAI API with the API key
    const response = await generateText({
      model: openai("gpt-4o", {
        apiKey: apiKey,
      }),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Validate response
    if (!response.text) {
      throw new Error("Empty response from OpenAI")
    }

    // Return the response
    return NextResponse.json({
      text: response.text,
      success: true,
    })
  } catch (error: any) {
    console.error("OpenAI API error:", error)

    // Return more specific error messages
    if (error.message?.includes("API key") || error.message?.includes("Incorrect API key")) {
      return NextResponse.json(
        {
          error: "Invalid API key. Please check your OpenAI API key configuration.",
        },
        { status: 401 },
      )
    }

    if (error.message?.includes("quota") || error.message?.includes("billing")) {
      return NextResponse.json(
        {
          error: "OpenAI API quota exceeded. Please check your billing.",
        },
        { status: 429 },
      )
    }

    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again in a moment.",
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        error: error.message || "An error occurred while processing your request",
      },
      { status: 500 },
    )
  }
}
