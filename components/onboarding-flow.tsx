"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, BookOpen, Sparkles, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"

const onboardingSteps = [
  {
    id: 1,
    title: "🙏 Welcome to Rooh da Safar",
    subtitle: "Your Spiritual Journey Begins",
    content: (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🕉️</div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-orange-900">
            <span className="text-orange-600">ਰੂਹ ਦਾ ਸਫ਼ਰ</span> - Journey of the Soul
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to your personal spiritual companion, rooted in the timeless wisdom of{" "}
            <strong>Guru Granth Sahib Ji</strong>. This app is designed to provide authentic Gurbani guidance for every
            emotion and life situation.
          </p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-900 font-medium">"ਸਰਬੱਤ ਦਾ ਭਲਾ" - May all prosper and be blessed</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "📿 Authentic Gurbani Guidance",
    subtitle: "Real wisdom from Guru Granth Sahib Ji",
    content: (
      <div className="space-y-6">
        <div className="text-center text-5xl mb-4">📖</div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-orange-900">How Rooh Check Works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Heart className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-900">1. Share Your Feelings</p>
                <p className="text-sm text-gray-700">
                  Express what's in your heart - joy, sadness, anxiety, gratitude, or any emotion
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-900">2. Receive Gurbani Wisdom</p>
                <p className="text-sm text-gray-700">
                  Get authentic verses from Guru Granth Sahib Ji with exact Ang (page) references
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Sparkles className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-900">3. Take Spiritual Action</p>
                <p className="text-sm text-gray-700">
                  Follow practical actions based on Sikh principles and earn Seva points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "🏆 Your Spiritual Progress",
    subtitle: "Track your journey with Seva points",
    content: (
      <div className="space-y-6">
        <div className="text-center text-5xl mb-4">⭐</div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-orange-900">Seva Points System</h3>
          <p className="text-gray-700">
            Earn Seva points by engaging with spiritual practices. These points reflect your dedication to spiritual
            growth.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-green-600" />
                <span className="text-sm">Daily Rooh Check</span>
              </div>
              <Badge className="bg-green-100 text-green-800">+5 points</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Reading Hukamnama</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">+10 points</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Completing Quiz</span>
              </div>
              <Badge className="bg-purple-100 text-purple-800">+15 points</Badge>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "🌟 Complete Spiritual Toolkit",
    subtitle: "Everything you need for your spiritual journey",
    content: (
      <div className="space-y-6">
        <div className="text-center text-5xl mb-4">🛠️</div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-orange-900">App Features</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-900">📿 Daily Hukamnama</p>
              <p className="text-sm text-gray-700">Divine guidance from Sri Harmandir Sahib</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-900">📋 Spiritual To-Do</p>
              <p className="text-sm text-gray-700">Track your spiritual practices and goals</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-900">🤲 Ardaas (Prayer)</p>
              <p className="text-sm text-gray-700">Personalized prayers and traditional Ardaas</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-900">🧠 Knowledge Quiz</p>
              <p className="text-sm text-gray-700">Test your understanding of Sikh teachings</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-orange-900">⏰ Spiritual Reminders</p>
              <p className="text-sm text-gray-700">Set reminders for your daily practices</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Ready to begin your spiritual journey with authentic Gurbani guidance?
            </p>
          </div>
        </div>
      </div>
    ),
  },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push("/")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  const currentStepData = onboardingSteps.find((step) => step.id === currentStep)
  const progress = (currentStep / onboardingSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-orange-900">
              Step {currentStep} of {onboardingSteps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-orange-600 hover:text-orange-700">
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
        </div>

        {/* Content */}
        <Card className="border-orange-200 mb-8">
          <CardContent className="p-6">{currentStepData?.content}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={handleNext} className="bg-orange-600 hover:bg-orange-700">
            {currentStep === onboardingSteps.length ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Start Journey
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {onboardingSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-2 h-2 rounded-full transition-colors ${
                step.id === currentStep ? "bg-orange-600" : step.id < currentStep ? "bg-orange-300" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
