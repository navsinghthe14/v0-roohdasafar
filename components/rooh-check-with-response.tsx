"use client"

import { useState, useEffect } from "react"
import { ShareFeelingsForm } from "@/components/share-feelings-form"
import { GurbaniResponseCard } from "@/components/gurbani-response-card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowDown } from "lucide-react"
import { submitFeeling } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface RoohCheckWithResponseProps {
  initialSubmission: {
    feeling: string
    response: {
      gurbaniTuk: string
      transliteration: string
      translation: string
      actions: string[]
      ardaas: string
      explanation: string
    }
  }
}

export function RoohCheckWithResponse({ initialSubmission }: RoohCheckWithResponseProps) {
  const [feeling, setFeeling] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasResponse, setHasResponse] = useState(!!initialSubmission.feeling)
  const [currentSubmission, setCurrentSubmission] = useState(initialSubmission)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const { toast } = useToast()

  // Check if API key is configured
  useEffect(() => {
    const clientApiKey = localStorage.getItem("openai_api_key")
    const isApiConfigured = !!clientApiKey || !!process.env.OPENAI_API_KEY
    setApiKeyMissing(!isApiConfigured)
  }, [])

  const handleSubmitFeeling = async (submittedFeeling: string) => {
    if (!submittedFeeling.trim()) {
      toast({
        title: "Please share your feelings",
        description: "We need to know how you're feeling to provide guidance.",
        variant: "destructive",
      })
      return
    }

    setFeeling(submittedFeeling)
    setIsSubmitting(true)

    try {
      await submitFeeling(submittedFeeling)

      // Add Seva points on the client side
      const currentPoints = localStorage.getItem("sevaPoints")
        ? Number.parseInt(localStorage.getItem("sevaPoints") as string)
        : 0
      const newPoints = currentPoints + 5
      localStorage.setItem("sevaPoints", newPoints.toString())

      // Fetch the updated response
      const response = await fetch("/api/last-response")
      const data = await response.json()

      if (data.success) {
        setCurrentSubmission(data.submission)
        setHasResponse(true)

        // Scroll to response section
        setTimeout(() => {
          const responseElement = document.getElementById("gurbani-response")
          if (responseElement) {
            responseElement.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)

        toast({
          title: "Thank you for sharing",
          description: apiKeyMissing
            ? "Your response has been processed with fallback guidance. Configure OpenAI API for personalized responses."
            : "Your personalized Gurbani guidance is ready below.",
        })
      } else {
        throw new Error("Failed to fetch response")
      }
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

  const handleNewCheck = () => {
    // Scroll back to the form
    const formElement = document.getElementById("rooh-check-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-8">
      {/* Rooh Check Form Section */}
      <div id="rooh-check-form">
        <ShareFeelingsForm onSubmit={handleSubmitFeeling} isSubmitting={isSubmitting} apiKeyMissing={apiKeyMissing} />
      </div>

      {/* Loading State */}
      {isSubmitting && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-lg font-medium text-orange-900">Generating your personalized Gurbani guidance...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          <ArrowDown className="h-5 w-5 text-orange-400 mt-4 animate-bounce" />
        </div>
      )}

      {/* Gurbani Response Section */}
      {hasResponse && currentSubmission.feeling && !isSubmitting && (
        <div id="gurbani-response" className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-900 mb-2">Your Gurbani Guidance</h2>
            <p className="text-gray-600">Based on what you shared, here's wisdom from Sikh teachings</p>
          </div>

          <GurbaniResponseCard feeling={currentSubmission.feeling} response={currentSubmission.response} />

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleNewCheck}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Share Another Feeling
            </Button>
          </div>
        </div>
      )}

      {/* Welcome message when no response yet */}
      {!hasResponse && !isSubmitting && (
        <div className="text-center p-8 border rounded-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-orange-900">Welcome to Rooh Check</h3>
            <p className="text-gray-700">
              Share what's in your heart above, and receive personalized guidance from Gurbani. Your feelings matter,
              and Sikh teachings offer wisdom for every emotional state.
            </p>
            <div className="text-sm text-orange-600 font-medium">✨ Earn 5 Seva points for each check-in</div>
          </div>
        </div>
      )}
    </div>
  )
}
