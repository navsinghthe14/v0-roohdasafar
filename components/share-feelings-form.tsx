"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Heart } from "lucide-react"
import Link from "next/link"

interface ShareFeelingsFormProps {
  onSubmit: (feeling: string) => Promise<void>
  isSubmitting: boolean
  apiKeyMissing: boolean
}

export function ShareFeelingsForm({ onSubmit, isSubmitting, apiKeyMissing }: ShareFeelingsFormProps) {
  const [feeling, setFeeling] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(feeling)
    setFeeling("") // Clear the form after submission
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Heart className="h-5 w-5 text-orange-600" />
            How is your rooh (soul) feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeyMissing && (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">API Key Not Configured</p>
                <p className="text-sm mb-2">
                  You'll receive fallback guidance. For personalized AI-powered responses, configure your OpenAI API
                  key.
                </p>
                <Link href="/settings/api-settings">
                  <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                    Configure API Key
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!apiKeyMissing && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-start gap-2">
              <CheckCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">AI-Powered Guidance Ready</p>
                <p className="text-sm">Your OpenAI API is configured. You'll receive personalized Gurbani guidance.</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder="Share what's in your heart... 

Examples:
• I feel anxious about my future
• I'm grateful for my family's health  
• I feel lost and need direction
• I'm struggling with anger
• I feel peaceful after meditation"
              className="min-h-[150px] resize-none bg-white border-orange-200 focus:border-orange-400"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Express yourself freely. There's no judgment here, only compassion and guidance.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setFeeling("")}
            type="button"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Clear
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting || !feeling.trim()}
          >
            {isSubmitting ? "Getting Guidance..." : "Get Gurbani Guidance"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
