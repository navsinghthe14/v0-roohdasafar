"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitFeedback, addSevaPoints } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("")
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.trim()) {
      toast({
        title: "Please enter your feedback",
        description: "We need your input to improve the app.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitFeedback(feedback)
      // Add Seva points for providing feedback
      await addSevaPoints(5)

      toast({
        title: "Thank you for your feedback!",
        description: "You've earned 5 Seva points for helping improve Rooh da Safar.",
      })

      // Reset form after successful submission
      setFeedback("")
      setFeedbackType("suggestion")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
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
          <CardTitle>Share Your Thoughts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggestion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug">Bug Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature" id="feature" />
                <Label htmlFor="feature">Feature Request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Please share your thoughts, suggestions, or report any issues..."
              className="min-h-[150px] resize-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setFeedback("")} type="button">
            Clear
          </Button>
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
