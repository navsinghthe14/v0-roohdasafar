"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle, Key } from "lucide-react"
import { isOpenAIConfigured } from "@/lib/config"

export function ApiKeySettings() {
  const [apiKey, setApiKey] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if API key is already configured at the environment level
    setIsConfigured(isOpenAIConfigured())

    // Check if API key is stored in localStorage
    const storedKey = localStorage.getItem("openai_api_key")
    if (storedKey) {
      setApiKey(storedKey)
      setIsConfigured(true)
    }
  }, [])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API key is required",
        description: "Please enter your OpenAI API key.",
        variant: "destructive",
      })
      return
    }

    if (!apiKey.startsWith("sk-")) {
      toast({
        title: "Invalid API key format",
        description: "OpenAI API keys should start with 'sk-'.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Store API key in localStorage first
      localStorage.setItem("openai_api_key", apiKey)

      // Test the API key with a simple request
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Respond with exactly: 'API key test successful'",
          apiKey: apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Remove the API key from localStorage if it's invalid
        localStorage.removeItem("openai_api_key")
        throw new Error(data.error || "Failed to validate API key")
      }

      setIsConfigured(true)
      toast({
        title: "API key saved successfully",
        description: "Your OpenAI API key has been validated and saved.",
      })
    } catch (error) {
      console.error("Error saving API key:", error)

      // Remove invalid API key from localStorage
      localStorage.removeItem("openai_api_key")
      setIsConfigured(false)

      let errorMessage = "An unknown error occurred"

      if (error instanceof Error) {
        if (error.message.includes("Invalid API key")) {
          errorMessage = "The API key you entered is invalid. Please check and try again."
        } else if (error.message.includes("quota")) {
          errorMessage = "Your OpenAI account has exceeded its quota. Please check your billing."
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Rate limit exceeded. Please try again in a moment."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Failed to save API key",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    setApiKey("")
    localStorage.removeItem("openai_api_key")
    setIsConfigured(false)
    toast({
      title: "API key cleared",
      description: "Your OpenAI API key has been removed.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-orange-600" />
          OpenAI API Key
        </CardTitle>
        <CardDescription>
          Configure your OpenAI API key to enable AI-powered features like personalized Gurbani guidance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span>OpenAI API is configured and working</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Your API key is stored securely in your browser and is never sent to our servers.
          </p>
        </div>

        <div className="p-3 bg-amber-50 text-amber-700 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Important</p>
            <p className="text-sm">
              You can get your OpenAI API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                platform.openai.com/api-keys
              </a>
              . Using the API will incur charges based on your usage.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700" disabled={isSaving}>
          {isSaving ? "Testing..." : "Save & Test API Key"}
        </Button>
        {isConfigured && (
          <Button onClick={handleClear} variant="outline" disabled={isSaving}>
            Clear API Key
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
