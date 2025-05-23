"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { addToSpiritualTodo, addSevaPoints } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import {
  PlusCircle,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Download,
  Type,
  Palette,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react"
import Link from "next/link"

interface HukamnamaDisplayProps {
  hukamnamaData: {
    date: string
    hukamnama: {
      gurmukhi: string
      transliteration: string
      translation: string
      explanation: string
      actions: string[]
      source: string
      pageNumber: string
      writer: string
      raag: string
      audioLinks: {
        gurmukhi: string
        english: string
        punjabi: string
      }
    }
  }
}

export function HukamnamaDisplay({ hukamnamaData }: HukamnamaDisplayProps) {
  const { toast } = useToast()
  const [addingAction, setAddingAction] = useState<string | null>(null)
  const [pointsAdded, setPointsAdded] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [displayStyle, setDisplayStyle] = useState("default")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioLanguage, setCurrentAudioLanguage] = useState<"gurmukhi" | "english" | "punjabi">("gurmukhi")
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  const handleAddSevaPoints = async () => {
    if (pointsAdded) return

    try {
      await addSevaPoints(10)
      setPointsAdded(true)
      toast({
        title: "+10 Seva Points Added!",
        description: "Thank you for reading today's Hukamnama.",
      })
    } catch (error) {
      toast({
        title: "Failed to add Seva points",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handlePlayAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(hukamnamaData.hukamnama.audioLinks[currentAudioLanguage])
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false)
      })
    } else {
      // Update source if language changed
      audioRef.current.src = hukamnamaData.hukamnama.audioLinks[currentAudioLanguage]
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleAudioLanguageChange = (language: "gurmukhi" | "english" | "punjabi") => {
    setCurrentAudioLanguage(language)
    if (isPlaying && audioRef.current) {
      audioRef.current.src = hukamnamaData.hukamnama.audioLinks[language]
      audioRef.current.play()
    }
  }

  const getDisplayStyleClass = () => {
    switch (displayStyle) {
      case "light":
        return "bg-white text-gray-800"
      case "dark":
        return "bg-gray-900 text-white"
      case "sepia":
        return "bg-amber-50 text-amber-900"
      default:
        return "bg-white"
    }
  }

  const handleShare = (platform: string) => {
    const shareText = `Today's Hukamnama: ${hukamnamaData.hukamnama.translation}`
    const shareUrl = window.location.href

    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "email":
        shareLink = `mailto:?subject=Today's%20Hukamnama&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle className="text-orange-900">Hukamnama for {hukamnamaData.date}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{hukamnamaData.hukamnama.source}</span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-500">{hukamnamaData.hukamnama.writer}</span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-500">{hukamnamaData.hukamnama.raag}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Audio Controls */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePlayAudio} className="h-10 w-10 rounded-full">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm font-medium">Hukamnama Audio</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={currentAudioLanguage === "gurmukhi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAudioLanguageChange("gurmukhi")}
                    className={currentAudioLanguage === "gurmukhi" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    Gurmukhi
                  </Button>
                  <Button
                    variant={currentAudioLanguage === "english" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAudioLanguageChange("english")}
                    className={currentAudioLanguage === "english" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    English
                  </Button>
                  <Button
                    variant={currentAudioLanguage === "punjabi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAudioLanguageChange("punjabi")}
                    className={currentAudioLanguage === "punjabi" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    Punjabi
                  </Button>
                </div>
              </div>
            </div>

            {/* Display Controls */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Type className="h-4 w-4" /> Font Size
                    </span>
                    <span className="text-xs bg-orange-100 px-2 py-1 rounded-full">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={12}
                    max={32}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Palette className="h-4 w-4" />
                    <span className="text-sm font-medium">Display Style</span>
                  </div>
                  <Select value={displayStyle} onValueChange={setDisplayStyle}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="sepia">Sepia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => window.print()}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="gurmukhi"
              className="w-full"
              onValueChange={(value) => {
                if (value === "translation" && !pointsAdded) {
                  handleAddSevaPoints()
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="gurmukhi">Gurmukhi</TabsTrigger>
                <TabsTrigger value="transliteration">Transliteration</TabsTrigger>
                <TabsTrigger value="translation">Translation</TabsTrigger>
                <TabsTrigger value="actions">Spiritual Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="gurmukhi" className={`p-6 rounded-md mt-4 ${getDisplayStyleClass()}`}>
                <div className="text-center">
                  <p style={{ fontSize: `${fontSize}px` }} className="font-medium leading-relaxed">
                    {hukamnamaData.hukamnama.gurmukhi}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="transliteration" className={`p-6 rounded-md mt-4 ${getDisplayStyleClass()}`}>
                <div className="text-center">
                  <p style={{ fontSize: `${fontSize}px` }} className="italic leading-relaxed">
                    {hukamnamaData.hukamnama.transliteration}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="translation" className={`p-6 rounded-md mt-4 ${getDisplayStyleClass()}`}>
                <div className="space-y-4">
                  <p style={{ fontSize: `${fontSize}px` }} className="leading-relaxed">
                    {hukamnamaData.hukamnama.translation}
                  </p>
                  <div className="pt-4 border-t border-orange-200">
                    <h3 className="font-medium text-orange-900 mb-2">Explanation:</h3>
                    <p className="text-gray-700">{hukamnamaData.hukamnama.explanation}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="p-4 bg-white rounded-md mt-4">
                <ul className="space-y-4">
                  {hukamnamaData.hukamnama.actions.map((action, index) => (
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
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Share:</span>
            <Button variant="outline" size="icon" onClick={() => handleShare("facebook")}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare("twitter")}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")}>
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare("email")}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/spiritual-todo">
            <Button className="bg-orange-600 hover:bg-orange-700">View Spiritual To-Do</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
