"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SevaPointsWidget() {
  const [points, setPoints] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(100)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // In a real app, fetch this from a database
    const storedPoints = localStorage.getItem("sevaPoints")
    if (storedPoints) {
      setPoints(Number.parseInt(storedPoints))
    } else {
      // Set some initial points for demo
      const initialPoints = 35
      setPoints(initialPoints)
      localStorage.setItem("sevaPoints", initialPoints.toString())
    }
  }, [])

  useEffect(() => {
    setProgress(Math.min((points / weeklyGoal) * 100, 100))
  }, [points, weeklyGoal])

  return (
    <Card className="border-orange-200 bg-white">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-amber-900">Your Seva Points</h3>
              <p className="text-sm text-gray-500">Weekly progress</p>
            </div>
            <div className="text-3xl font-bold text-orange-600">{points}</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress toward weekly goal</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{weeklyGoal} points</span>
            </div>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 text-sm">
            <p className="font-medium text-orange-800">Weekly Reset: Sunday at midnight</p>
            <p className="mt-1 text-gray-600">
              Your points contribute to your spiritual growth journey. Keep engaging daily!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
