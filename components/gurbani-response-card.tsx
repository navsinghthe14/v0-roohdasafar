"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addToSpiritualTodo } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Clock, BookOpen, Lightbulb, HandIcon as Hands, MessageSquare } from "lucide-react"

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
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader>
        <CardTitle className="text-orange-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Guidance for: "{feeling}"
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gurbani" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gurbani" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Gurbani</span>
            </TabsTrigger>
            <TabsTrigger value="explanation" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Meaning</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="ardaas" className="flex items-center gap-1">
              <Hands className="h-4 w-4" />
              <span className="hidden sm:inline">Prayer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gurbani" className="p-6 bg-white rounded-md mt-4 shadow-sm">
            <div className="space-y-6">
              <div className="border-l-4 border-orange-500 pl-6">
                <div className="space-y-3">
                  <p className="text-xl font-medium text-orange-900 leading-relaxed">{response.gurbaniTuk}</p>
                  <p className="text-base italic text-gray-600 leading-relaxed">{response.transliteration}</p>
                  <p className="text-base text-gray-800 leading-relaxed">{response.translation}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-sm text-orange-800">
                  <MessageSquare className="h-4 w-4" />
                  Wisdom from Guru Granth Sahib
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="explanation" className="p-6 bg-white rounded-md mt-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-900 mb-2">How this relates to your feeling:</h3>
                  <p className="text-gray-700 leading-relaxed">{response.explanation}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="p-6 bg-white rounded-md mt-4 shadow-sm">
            <div className="space-y-4">
              <h3 className="font-medium text-orange-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Spiritual Actions to Take:
              </h3>
              <ul className="space-y-4">
                {response.actions.map((action, index) => (
                  <li key={index} className="flex items-start justify-between gap-4 p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-800">{action}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                        onClick={() => handleAddToTodo(action)}
                        disabled={addingAction === action}
                      >
                        <PlusCircle className="h-3 w-3" />
                        {addingAction === action ? "Adding..." : "Add"}
                      </Button>
                      <Link href={`/reminders?action=${encodeURIComponent(action)}`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          Remind
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="ardaas" className="p-6 bg-white rounded-md mt-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Hands className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-900 mb-3">Suggested Prayer (Ardaas):</h3>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                    <p className="text-gray-800 leading-relaxed italic">{response.ardaas}</p>
                  </div>
                </div>
              </div>
              <div className="text-center pt-4">
                <Link href="/ardaas">
                  <Button className="bg-orange-600 hover:bg-orange-700">Go to Ardaas Page</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/spiritual-todo">
          <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
            View Spiritual To-Do
          </Button>
        </Link>
        <div className="text-sm text-gray-500">+5 Seva points earned</div>
      </CardFooter>
    </Card>
  )
}
