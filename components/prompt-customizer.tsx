"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function PromptCustomizer() {
  const [customPrompt, setCustomPrompt] = useState("")
  const [promptType, setPromptType] = useState("standard")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1500)
  const { toast } = useToast()

  const handleSaveSettings = () => {
    // Save custom prompt settings to localStorage
    const settings = {
      customPrompt,
      promptType,
      temperature,
      maxTokens,
    }

    localStorage.setItem("promptSettings", JSON.stringify(settings))

    toast({
      title: "Prompt settings saved",
      description: "Your custom prompt configuration has been saved.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize AI Prompts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prompt-type">Prompt Type</Label>
          <Select value={promptType} onValueChange={setPromptType}>
            <SelectTrigger>
              <SelectValue placeholder="Select prompt type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Guidance</SelectItem>
              <SelectItem value="difficulty">Times of Difficulty</SelectItem>
              <SelectItem value="gratitude">Gratitude & Joy</SelectItem>
              <SelectItem value="growth">Spiritual Growth</SelectItem>
              <SelectItem value="custom">Custom Prompt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {promptType === "custom" && (
          <div>
            <Label htmlFor="custom-prompt">Custom Prompt Template</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Enter your custom prompt template..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="temperature">Temperature (Creativity)</Label>
            <Select value={temperature.toString()} onValueChange={(value) => setTemperature(Number.parseFloat(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.3">0.3 (Very Consistent)</SelectItem>
                <SelectItem value="0.5">0.5 (Balanced)</SelectItem>
                <SelectItem value="0.7">0.7 (Creative)</SelectItem>
                <SelectItem value="0.9">0.9 (Very Creative)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="max-tokens">Max Response Length</Label>
            <Select value={maxTokens.toString()} onValueChange={(value) => setMaxTokens(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">Short (1000 tokens)</SelectItem>
                <SelectItem value="1500">Medium (1500 tokens)</SelectItem>
                <SelectItem value="2000">Long (2000 tokens)</SelectItem>
                <SelectItem value="3000">Very Long (3000 tokens)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full bg-orange-600 hover:bg-orange-700">
          Save Prompt Settings
        </Button>
      </CardContent>
    </Card>
  )
}
