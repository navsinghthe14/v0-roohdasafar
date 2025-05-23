"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
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
  }

  return (
    <Card className="border-orange-200">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          {apiKeyMissing && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-md flex items-start gap-2">
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
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start gap-2">
              <CheckCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">AI-Powered Guidance Ready</p>
                <p className="text-sm">Your OpenAI API is configured. You'll receive personalized Gurbani guidance.</p>
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
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
