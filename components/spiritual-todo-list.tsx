"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import { getSpiritualTodos, addToSpiritualTodo } from "@/app/actions"

// In a real app, this would be fetched from a database
// For demo purposes, we'll use localStorage to persist data
interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export function SpiritualTodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load todos from server and localStorage on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // Fetch todos from server
        const serverTodos = await getSpiritualTodos()

        // Also check localStorage for any existing todos
        const savedTodos = localStorage.getItem("spiritualTodos")
        let localTodos: TodoItem[] = []

        if (savedTodos) {
          localTodos = JSON.parse(savedTodos)
        }

        // Merge server and local todos, removing duplicates by text
        const allTexts = new Set()
        const mergedTodos: TodoItem[] = []

        // Add server todos first
        for (const todo of serverTodos) {
          if (!allTexts.has(todo.text)) {
            allTexts.add(todo.text)
            mergedTodos.push(todo)
          }
        }

        // Then add local todos if not already added
        for (const todo of localTodos) {
          if (!allTexts.has(todo.text)) {
            allTexts.add(todo.text)
            mergedTodos.push(todo)
          }
        }

        setTodos(mergedTodos)
      } catch (error) {
        console.error("Error fetching todos:", error)

        // Fallback to localStorage if server fetch fails
        const savedTodos = localStorage.getItem("spiritualTodos")
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos))
        } else {
          // Set some example todos for first-time users
          const exampleTodos = [
            {
              id: "1",
              text: "Practice Naam Simran for 15 minutes",
              completed: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              text: "Read 5 pages of Guru Granth Sahib",
              completed: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: "3",
              text: "Perform an act of seva (selfless service)",
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ]
          setTodos(exampleTodos)
          localStorage.setItem("spiritualTodos", JSON.stringify(exampleTodos))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0 && !loading) {
      localStorage.setItem("spiritualTodos", JSON.stringify(todos))
    }
  }, [todos, loading])

  const addTodo = async () => {
    if (!newTodo.trim()) {
      toast({
        title: "Cannot add empty task",
        description: "Please enter a spiritual practice to add.",
        variant: "destructive",
      })
      return
    }

    try {
      // Add to server
      await addToSpiritualTodo(newTodo)

      // Add to local state
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      setTodos([...todos, newItem])
      setNewTodo("")

      toast({
        title: "Spiritual practice added",
        description: "Your new spiritual practice has been added to your to-do list.",
      })
    } catch (error) {
      toast({
        title: "Failed to add practice",
        description: "There was an error adding your practice. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))

    toast({
      title: "Item removed",
      description: "The spiritual practice has been removed from your to-do list.",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading your spiritual practices...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Spiritual Practices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Add a new spiritual practice..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo()
              }
            }}
          />
          <Button onClick={addTodo} className="bg-orange-600 hover:bg-orange-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {todos.length === 0 ? (
          <div className="text-center p-6 border rounded-lg bg-orange-50">
            <p className="text-orange-900">
              Your spiritual to-do list is empty. Add practices from Gurbani responses or create new ones.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  todo.completed ? "bg-orange-50 border-orange-200" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="border-orange-500"
                  />
                  <span className={`${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.text}</span>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/reminders?action=${encodeURIComponent(todo.text)}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Reminder
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
