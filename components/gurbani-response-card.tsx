"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addToSpiritualTodo } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Clock } from "lucide-react"

interface GurbaniResponseCardProps {
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

export function GurbaniResponseCard({ feeling, response }: GurbaniResponseCardProps) {
  const { toast } = useToast()
  const [addingAction, setAddingAction] = useState<string | null>(null)

  const handleAddToTodo = async (action: string) => {
    setAddingAction(action)

    try {
      await addToSpiritualTodo(action)
      toast({
        title: "Added to your Spiritual To-Do list",
        description: "You can view and manage it in the Spiritual To-Do page.",
      })
    } catch (error) {
      toast({
        title: "Failed to add to To-Do list",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setAddingAction(null)
    }
  }

  // Check if we have a valid response
  const hasValidResponse = response && response.gurbaniTuk && response.transliteration && response.translation

  if (!hasValidResponse) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">For your feeling: "{feeling}"</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-lg text-orange-900">
              We couldn't generate a proper response for your feeling. Please try again or check your API configuration.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/rooh-check" className="w-full">
            <Button variant="outline" className="w-full">
              Share Another Feeling
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-900">For your feeling: "{feeling}"</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gurbani" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gurbani">Gurbani Tuk</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="actions">Spiritual Actions</TabsTrigger>
            <TabsTrigger value="ardaas">Suggested Ardaas</TabsTrigger>
          </TabsList>
          <TabsContent value="gurbani" className="p-4 bg-white rounded-md mt-4">
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-lg font-medium text-orange-900">{response.gurbaniTuk}</p>
                <p className="text-sm italic mt-2">{response.transliteration}</p>
                <p className="mt-2">{response.translation}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="explanation" className="p-4 bg-white rounded-md mt-4">
            <p className="text-gray-700">{response.explanation}</p>
          </TabsContent>
          <TabsContent value="actions" className="p-4 bg-white rounded-md mt-4">
            <ul className="space-y-4">
              {response.actions.map((action, index) => (
                <li key={index} className="flex items-start justify-between gap-4">
                  <span>{action}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleAddToTodo(action)}
                      disabled={addingAction === action}
                    >
                      <PlusCircle className="h-4 w-4" />
                      {addingAction === action ? "Adding..." : "Add to To-Do"}
                    </Button>
                    <Link href={`/reminders?action=${encodeURIComponent(action)}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Set Reminder
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="ardaas" className="p-4 bg-white rounded-md mt-4">
            <p className="text-gray-700">{response.ardaas}</p>
            <div className="mt-4">
              <Link href="/ardaas">
                <Button className="bg-orange-600 hover:bg-orange-700">Go to Ardaas Page</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/rooh-check">
          <Button variant="outline">Share Another Feeling</Button>
        </Link>
        <Link href="/spiritual-todo">
          <Button className="bg-orange-600 hover:bg-orange-700">View Spiritual To-Do</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
