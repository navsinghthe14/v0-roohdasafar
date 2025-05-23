"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { setReminder } from "@/app/actions"
import { Bell, Trash2, Clock } from "lucide-react"

interface Reminder {
  id: string
  action: string
  time: string
  days: string[]
  createdAt: string
}

interface RemindersManagerProps {
  initialAction?: string
}

export function RemindersManager({ initialAction = "" }: RemindersManagerProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [action, setAction] = useState(initialAction)
  const [time, setTime] = useState("08:00")
  const [selectedDays, setSelectedDays] = useState<string[]>(["everyday"])
  const { toast } = useToast()

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem("spiritualReminders")
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    } else {
      // Set some example reminders for first-time users
      const exampleReminders = [
        {
          id: "1",
          action: "Morning Naam Simran",
          time: "06:00",
          days: ["everyday"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          action: "Evening Prayer",
          time: "19:00",
          days: ["everyday"],
          createdAt: new Date().toISOString(),
        },
      ]
      setReminders(exampleReminders)
      localStorage.setItem("spiritualReminders", JSON.stringify(exampleReminders))
    }
  }, [])

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("spiritualReminders", JSON.stringify(reminders))
    }
  }, [reminders])

  const addReminder = async () => {
    if (!action.trim()) {
      toast({
        title: "Action cannot be empty",
        description: "Please enter what you want to be reminded about.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would set up a notification
      await setReminder(action, time)

      const newReminder: Reminder = {
        id: Date.now().toString(),
        action,
        time,
        days: selectedDays,
        createdAt: new Date().toISOString(),
      }

      setReminders([...reminders, newReminder])

      // Only clear the action if it wasn't passed in from URL params
      if (!initialAction) {
        setAction("")
      }

      toast({
        title: "Reminder set",
        description: `You will be reminded to "${action}" at ${time}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to set reminder",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))

    toast({
      title: "Reminder removed",
      description: "The reminder has been deleted.",
    })
  }

  const formatDays = (days: string[]) => {
    if (days.includes("everyday")) {
      return "Every day"
    }
    return days.join(", ")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Spiritual Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">What do you want to be reminded about?</Label>
            <Input
              id="action"
              placeholder="e.g., Morning meditation, Read Gurbani"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">What time?</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Which days?</Label>
            <Select value={selectedDays[0]} onValueChange={(value) => setSelectedDays([value])}>
              <SelectTrigger id="days">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyday">Every day</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addReminder} className="w-full bg-amber-600 hover:bg-amber-700">
            <Bell className="h-4 w-4 mr-2" />
            Set Reminder
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Reminders</h3>

          {reminders.length === 0 ? (
            <div className="text-center p-6 border rounded-lg bg-amber-50">
              <p className="text-amber-900">You don't have any reminders set. Create one above.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="flex items-center justify-between p-3 rounded-md border bg-amber-50">
                  <div className="flex items-start flex-col">
                    <span className="font-medium">{reminder.action}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {reminder.time} • {formatDays(reminder.days)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
