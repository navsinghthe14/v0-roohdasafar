"use client"

import { useState, useEffect } from "react"
import { ShareFeelingsForm } from "@/components/share-feelings-form"
import { GurbaniResponseCard } from "@/components/gurbani-response-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
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
  const [showResponse, setShowResponse] = useState(!!initialSubmission.feeling)
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
    setShowResponse(false)

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
        setShowResponse(true)

        toast({
          title: "Thank you for sharing",
          description: apiKeyMissing
            ? "Your response has been processed with a fallback guidance. Configure OpenAI API for personalized responses."
            : "Your response has been processed successfully.",
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
    setShowResponse(false)
  }

  return (
    <div className="space-y-8">
      {!showResponse && (
        <ShareFeelingsForm onSubmit={handleSubmitFeeling} isSubmitting={isSubmitting} apiKeyMissing={apiKeyMissing} />
      )}

      {isSubmitting && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-lg font-medium text-orange-900">Generating Gurbani guidance for you...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}

      {showResponse && currentSubmission.feeling && (
        <div className="space-y-4">
          <GurbaniResponseCard feeling={currentSubmission.feeling} response={currentSubmission.response} />
          <div className="flex justify-center">
            <Button onClick={handleNewCheck} variant="outline" className="mt-4">
              Share Another Feeling
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
