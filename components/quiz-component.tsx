"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitQuizResults } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { Award, ArrowRight, RotateCcw } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

interface QuizComponentProps {
  questions: Question[]
}

export function QuizComponent({ questions }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateScore()
    }
  }

  const calculateScore = async () => {
    let correctAnswers = 0

    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    setScore(correctAnswers)
    setShowResults(true)

    setIsSubmitting(true)
    try {
      await submitQuizResults(correctAnswers)
      toast({
        title: `Quiz completed! You earned ${correctAnswers * 3} Seva points`,
        description: `You answered ${correctAnswers} out of ${questions.length} questions correctly.`,
      })
    } catch (error) {
      toast({
        title: "Failed to submit quiz results",
        description: "Your score was calculated but couldn't be saved.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  if (showResults) {
    return (
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-center text-orange-900">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Award className="h-16 w-16 text-orange-500" />
            <h2 className="text-2xl font-bold text-orange-900">
              You scored {score} out of {questions.length}!
            </h2>
            <p className="text-center text-gray-700">
              {score === questions.length
                ? "Perfect score! Amazing knowledge of Sikh teachings!"
                : score >= questions.length / 2
                  ? "Good job! You have a solid understanding of Sikh teachings."
                  : "Keep learning! Every step on the spiritual path is valuable."}
            </p>
            <div className="mt-4 text-center">
              <p className="font-medium text-orange-600">+{score * 3} Seva Points Earned!</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-orange-900">Review Your Answers:</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 rounded-md bg-orange-50">
                <p className="font-medium">
                  {index + 1}. {question.question}
                </p>
                <div className="mt-2 flex items-start gap-2">
                  <span className="font-medium">Your answer:</span>
                  <span className={answers[question.id] === question.correctAnswer ? "text-green-600" : "text-red-600"}>
                    {answers[question.id]}
                  </span>
                </div>
                {answers[question.id] !== question.correctAnswer && (
                  <div className="mt-1 flex items-start gap-2">
                    <span className="font-medium">Correct answer:</span>
                    <span className="text-green-600">{question.correctAnswer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetQuiz} className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            Take Another Quiz
          </Button>
          <Link href="/dashboard">
            <Button className="bg-orange-600 hover:bg-orange-700">View Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-normal text-gray-500">+3 Seva points per correct answer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-orange-900">{currentQuestion.question}</h2>

          <RadioGroup value={answers[currentQuestion.id]} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-orange-50">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="ml-auto bg-orange-600 hover:bg-orange-700 flex items-center gap-1"
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex < questions.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            "Finish Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
