import { NextResponse } from "next/server"
import { getLastResponse } from "@/app/actions"

export async function GET() {
  try {
    const lastSubmission = await getLastResponse()

    return NextResponse.json({
      success: true,
      submission: lastSubmission,
    })
  } catch (error) {
    console.error("Error fetching last response:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch last response",
      },
      { status: 500 },
    )
  }
}
