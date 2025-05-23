"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Calendar, Award, TrendingUp, CheckCircle2, BookOpen, Heart, HelpCircle } from "lucide-react"

export function DashboardContent() {
  const [points, setPoints] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(100)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for the dashboard
  const activityData = [
    { day: "Mon", points: 15 },
    { day: "Tue", points: 25 },
    { day: "Wed", points: 10 },
    { day: "Thu", points: 20 },
    { day: "Fri", points: 5 },
    { day: "Sat", points: 30 },
    { day: "Sun", points: 0 },
  ]

  const completedActivities = [
    { type: "Rooh Check", count: 5, icon: Heart },
    { type: "Hukamnama", count: 3, icon: BookOpen },
    { type: "Quiz", count: 2, icon: HelpCircle },
    { type: "Spiritual To-Do", count: 8, icon: CheckCircle2 },
  ]

  useEffect(() => {
    // Load Seva points from localStorage on client side
    const loadSevaPoints = () => {
      try {
        const storedPoints = localStorage.getItem("sevaPoints")
        const currentPoints = storedPoints ? Number.parseInt(storedPoints) : 0
        setPoints(currentPoints)
      } catch (error) {
        console.error("Error loading Seva points:", error)
        setPoints(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadSevaPoints()
  }, [])

  useEffect(() => {
    setProgress(Math.min((points / weeklyGoal) * 100, 100))
  }, [points, weeklyGoal])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-orange-200">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center p-6">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-900">Seva Points</CardTitle>
            <CardDescription>Your spiritual contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{points}</div>
              <Badge className="bg-orange-100 text-orange-800">This Week</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress toward weekly goal</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-900">Streak</CardTitle>
            <CardDescription>Days of consistent practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">7</div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              You've maintained your spiritual practice for 7 consecutive days. Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-900">Achievements</CardTitle>
            <CardDescription>Your spiritual milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">3</div>
              <Badge className="bg-blue-100 text-blue-800">Unlocked</Badge>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              <span className="text-sm">Early Riser: 5 days of morning practice</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6 space-y-6">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-900">Weekly Activity</CardTitle>
              <CardDescription>Your Seva points earned each day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <div className="flex h-full items-end justify-between gap-2">
                  {activityData.map((day) => (
                    <div key={day.day} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 bg-orange-500 rounded-t-md transition-all duration-500"
                        style={{
                          height: `${(day.points / 30) * 150}px`,
                          backgroundColor: day.points > 0 ? "rgb(249 115 22)" : "rgb(229 231 235)",
                        }}
                      ></div>
                      <span className="text-sm font-medium">{day.day}</span>
                      <span className="text-xs text-gray-500">{day.points}pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-900">Completed Activities</CardTitle>
              <CardDescription>Your spiritual practices this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {completedActivities.map((activity) => (
                  <div key={activity.type} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <activity.icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.count} completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-6">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-900">Spiritual Growth Insights</CardTitle>
              <CardDescription>Analysis of your spiritual journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-orange-50 p-4">
                  <h3 className="font-medium text-orange-900">Most Consistent Practice</h3>
                  <p className="text-gray-700">Morning Naam Simran (5 days this week)</p>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <h3 className="font-medium text-orange-900">Area for Growth</h3>
                  <p className="text-gray-700">Evening reflection and Ardaas (2 days this week)</p>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <h3 className="font-medium text-orange-900">Weekly Comparison</h3>
                  <p className="text-gray-700">You've earned 30% more Seva points than last week!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-900">Activity Calendar</CardTitle>
              <CardDescription>Your spiritual practice history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <p className="text-gray-500">Calendar view will be available in the next update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
