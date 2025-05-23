"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitFeeling } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { config } from "@/lib/config"

export function ShareFeelingsForm() {
  const [feeling, setFeeling] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [appUrlMissing, setAppUrlMissing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check if API key and app URL are configured
  useEffect(() => {
    const clientApiKey = localStorage.getItem("openai_api_key")
    const isApiConfigured = !!clientApiKey || process.env.OPENAI_API_KEY
    setApiKeyMissing(!isApiConfigured)

    // Check if app URL is configured
    setAppUrlMissing(!config.app.url)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feeling.trim()) {
      toast({
        title: "Please share your feelings",
        description: "We need to know how you're feeling to provide guidance.",
        variant: "destructive",
      })
      return
    }

    // Check if API key and app URL are configured
    if (apiKeyMissing || appUrlMissing) {
      toast({
        title: "Configuration missing",
        description: appUrlMissing
          ? "The app URL is not configured. Please set NEXT_PUBLIC_APP_URL environment variable."
          : "OpenAI API key is not configured. Please add it to your settings.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitFeeling(feeling)
      toast({
        title: "Thank you for sharing",
        description: "Your response has been processed successfully.",
      })

      // Redirect to the response page after a short delay
      setTimeout(() => {
        router.push("/gurbani-response")
      }, 1500)
    } catch (error) {
      console.error("Submit error:", error)

      let errorMessage = "Please try again later."

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "Please check your OpenAI API key configuration."
        } else if (error.message.includes("quota")) {
          errorMessage = "OpenAI API quota exceeded. Please check your billing."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-orange-200">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          {(apiKeyMissing || appUrlMissing) && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Configuration Required</p>
                {appUrlMissing && (
                  <p className="text-sm mb-2">
                    The app URL is not configured. Please set the NEXT_PUBLIC_APP_URL environment variable in your
                    Vercel project.
                  </p>
                )}
                {apiKeyMissing && (
                  <p className="text-sm mb-2">
                    To receive personalized Gurbani guidance, you need to configure your OpenAI API key.
                  </p>
                )}
                {apiKeyMissing && (
                  <Link href="/settings/api-settings">
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                      Configure API Key
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          <Textarea
            placeholder="I feel..."
            className="min-h-[150px] resize-none"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setFeeling("")} type="button">
            Clear
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting || apiKeyMissing || appUrlMissing}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
