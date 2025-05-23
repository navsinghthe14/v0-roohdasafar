import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if OpenAI API key is configured at environment level
    const envApiKey = process.env.OPENAI_API_KEY

    // Check if there's a client-side API key (we can't access localStorage from server)
    // This will be checked on the client side

    return NextResponse.json({
      status: "ok",
      message: "Health check successful",
      openai: {
        environmentKey: !!envApiKey,
        // Client will need to check localStorage separately
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        openai: {
          environmentKey: false,
        },
      },
      { status: 500 },
    )
  }
}
