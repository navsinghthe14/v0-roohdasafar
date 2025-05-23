"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { submitFeeling, addToSpiritualTodo } from "@/app/actions"
import { scrollToElement, vibrate } from "@/lib/mobile-utils"
import {
  Heart,
  Loader2,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Lightbulb,
  PlusCircle,
  Clock,
  HandIcon as Hands,
  MessageSquare,
  Sparkles,
  Send,
} from "lucide-react"
import Link from "next/link"

interface EnhancedRoohCheckProps {
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

export function EnhancedRoohCheck({ initialSubmission }: EnhancedRoohCheckProps) {
  const [feeling, setFeeling] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasResponse, setHasResponse] = useState(!!initialSubmission.feeling)
  const [currentSubmission, setCurrentSubmission] = useState(initialSubmission)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [addingAction, setAddingAction] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(!initialSubmission.feeling)
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Enhanced suggested feelings with emojis and better categorization
  const suggestedFeelings = [
    "😰 I feel anxious about my future",
    "🙏 I'm grateful for my family's health",
    "😔 I feel lost and need spiritual direction",
    "😤 I'm struggling with anger and frustration",
    "🧘‍♀️ I feel peaceful after meditation",
    "😟 I'm worried about my loved ones",
    "💔 I feel disconnected from Waheguru",
    "😊 I'm happy and want to share this joy",
    "😢 I'm going through a difficult time",
    "✨ I want to grow spiritually",
    "🤲 I need strength to face challenges",
    "💝 I feel blessed and want to give back",
  ]

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
      vibrate([100, 50, 100])
      return
    }

    setFeeling(submittedFeeling)
    setIsSubmitting(true)
    setShowWelcome(false)
    vibrate(50)

    // Scroll to loading section
    setTimeout(() => {
      scrollToElement("loading-section", 100)
    }, 100)

    try {
      await submitFeeling(submittedFeeling)

      // Add Seva points
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
          scrollToElement("gurbani-response", 80)
        }, 500)

        toast({
          title: "🙏 Gurbani guidance received",
          description: apiKeyMissing
            ? "Fallback guidance provided. Configure OpenAI for personalized responses."
            : "Your personalized Gurbani guidance from Guru Granth Sahib Ji is ready.",
        })
        vibrate([50, 100, 50])
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
        } else if (error.message.includes("network")) {
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
      vibrate([100, 50, 100, 50, 100])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickFeeling = (selectedFeeling: string) => {
    // Remove emoji from the feeling text
    const cleanFeeling = selectedFeeling.replace(/^[^\w\s]+\s/, "")
    setFeeling(cleanFeeling)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleAddToTodo = async (action: string) => {
    setAddingAction(action)
    vibrate(50)

    try {
      await addToSpiritualTodo(action)
      toast({
        title: "✅ Added to your list",
        description: "View it in your Spiritual To-Do page.",
      })
    } catch (error) {
      toast({
        title: "Failed to add",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setAddingAction(null)
    }
  }

  const handleNewCheck = () => {
    setHasResponse(false)
    setFeeling("")
    setShowWelcome(true)
    scrollToElement("rooh-check-form", 100)
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome/Form Section */}
      {(!hasResponse || showWelcome) && (
        <div id="rooh-check-form" className="space-y-4 sm:space-y-6">
          {/* Welcome Message */}
          {showWelcome && (
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="space-y-4">
                  <div className="text-4xl sm:text-6xl mb-2">🙏</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-orange-900">Welcome to Rooh Check</h2>
                  <p className="text-sm sm:text-base text-gray-700 max-w-md mx-auto leading-relaxed">
                    Share what's in your heart and receive authentic guidance from <strong>Guru Granth Sahib Ji</strong>
                    . Your feelings matter, and Gurbani offers wisdom for every emotional state.
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs sm:text-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Authentic Gurbani • Earn 5 Seva points
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Form */}
          <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-orange-900">
                <Heart className="h-5 w-5 text-orange-600" />
                How is your rooh (soul) feeling today?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* API Status */}
              {apiKeyMissing ? (
                <div className="p-3 bg-amber-50 text-amber-700 rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium">Limited AI Features</p>
                    <p className="text-xs">
                      You'll receive authentic Gurbani guidance. For AI-enhanced personalization, configure your OpenAI
                      API key.
                    </p>
                    <Link href="/settings/api-settings">
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 h-7 text-xs">
                        Configure API Key
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">🤖 AI-Enhanced Gurbani Guidance Ready</p>
                    <p className="text-xs">Personalized responses from Guru Granth Sahib Ji with AI assistance.</p>
                  </div>
                </div>
              )}

              {/* Quick Feeling Suggestions with Emojis */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">💭 Quick suggestions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedFeelings.slice(0, 6).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto p-2 text-xs sm:text-sm border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                      onClick={() => handleQuickFeeling(suggestion)}
                    >
                      <span className="truncate">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Main Textarea */}
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Share what's in your heart...

Examples:
😰 I feel anxious about my future
🙏 I'm grateful for my family's health  
😔 I feel lost and need direction
😤 I'm struggling with anger
🧘‍♀️ I feel peaceful after meditation"
                  className="min-h-[120px] sm:min-h-[150px] resize-none bg-white border-orange-200 focus:border-orange-400 text-sm sm:text-base"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Express yourself freely. You'll receive authentic guidance from <strong>Guru Granth Sahib Ji</strong>.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setFeeling("")}
                type="button"
                className="w-full sm:w-auto border-orange-300 text-orange-600 hover:bg-orange-50 order-2 sm:order-1"
              >
                Clear
              </Button>
              <Button
                onClick={() => handleSubmitFeeling(feeling)}
                className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
                disabled={isSubmitting || !feeling.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Getting Gurbani Guidance...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get Gurbani Guidance
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Loading Section */}
      {isSubmitting && (
        <div id="loading-section" className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
          <div className="space-y-4">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-orange-600 mx-auto" />
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-medium text-orange-900">
                🙏 Seeking guidance from Guru Granth Sahib Ji...
              </p>
              <p className="text-sm text-gray-500">Finding the perfect Gurbani verse for your heart</p>
            </div>
            <ArrowDown className="h-5 w-5 text-orange-400 animate-bounce mx-auto" />
          </div>
        </div>
      )}

      {/* Response Section */}
      {hasResponse && currentSubmission.feeling && !isSubmitting && (
        <div id="gurbani-response" className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-900">📿 Your Gurbani Guidance</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Based on "{currentSubmission.feeling}", here's wisdom from <strong>Guru Granth Sahib Ji</strong>
            </p>
          </div>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-orange-900 flex items-center gap-2 text-lg sm:text-xl">
                <BookOpen className="h-5 w-5" />
                <span className="truncate">Divine Guidance</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="gurbani" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                  <TabsTrigger
                    value="gurbani"
                    className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm"
                  >
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>📿 Gurbani</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="explanation"
                    className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm"
                  >
                    <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>💡 Meaning</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="actions"
                    className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm"
                  >
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>✨ Actions</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="ardaas"
                    className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm"
                  >
                    <Hands className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>🤲 Prayer</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gurbani" className="p-4 sm:p-6 bg-white rounded-lg mt-4 shadow-sm">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="border-l-4 border-orange-500 pl-4 sm:pl-6">
                      <div className="space-y-3">
                        <p className="text-lg sm:text-xl font-medium text-orange-900 leading-relaxed">
                          {currentSubmission.response.gurbaniTuk}
                        </p>
                        <p className="text-sm sm:text-base italic text-gray-600 leading-relaxed">
                          {currentSubmission.response.transliteration}
                        </p>
                        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                          {currentSubmission.response.translation}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge className="bg-orange-100 text-orange-800 text-xs sm:text-sm">
                        <MessageSquare className="h-3 w-3 mr-1" />📖 From Guru Granth Sahib Ji
                      </Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="explanation" className="p-4 sm:p-6 bg-white rounded-lg mt-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-orange-900 mb-2 text-sm sm:text-base">
                          💡 How this Gurbani relates to your feeling:
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {currentSubmission.response.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="p-4 sm:p-6 bg-white rounded-lg mt-4 shadow-sm">
                  <div className="space-y-4">
                    <h3 className="font-medium text-orange-900 flex items-center gap-2 text-sm sm:text-base">
                      <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />✨ Spiritual Actions to Take:
                    </h3>
                    <div className="space-y-3">
                      {currentSubmission.response.actions.map((action, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 bg-orange-50 rounded-lg"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm sm:text-base text-gray-800 leading-relaxed">{action}</span>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 text-xs h-7"
                              onClick={() => handleAddToTodo(action)}
                              disabled={addingAction === action}
                            >
                              <PlusCircle className="h-3 w-3" />
                              {addingAction === action ? "Adding..." : "Add"}
                            </Button>
                            <Link href={`/reminders?action=${encodeURIComponent(action)}`}>
                              <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs h-7">
                                <Clock className="h-3 w-3" />
                                Remind
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ardaas" className="p-4 sm:p-6 bg-white rounded-lg mt-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Hands className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-orange-900 mb-3 text-sm sm:text-base">
                          🤲 Suggested Prayer (Ardaas):
                        </h3>
                        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                          <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
                            {currentSubmission.response.ardaas}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center pt-4">
                      <Link href="/ardaas">
                        <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                          🙏 Go to Ardaas Page
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Link href="/spiritual-todo" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                  📋 View Spiritual To-Do
                </Button>
              </Link>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  +5 Seva points earned
                </Badge>
              </div>
            </CardFooter>
          </Card>

          {/* New Check Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleNewCheck}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              💭 Share Another Feeling
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
