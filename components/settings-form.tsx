"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { SunIcon, BellIcon, LanguagesIcon } from "lucide-react"

interface Settings {
  language: string
  theme: string
  notifications: boolean
  transliteration: boolean
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    language: "english",
    theme: "light",
    notifications: true,
    transliteration: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage
    localStorage.setItem("appSettings", JSON.stringify(settings))

    setIsSaving(false)

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LanguagesIcon className="h-4 w-4 text-amber-600" />
              <Label htmlFor="language">Language</Label>
            </div>
            <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
              <SelectTrigger id="language" className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <SunIcon className="h-4 w-4 text-amber-600" />
              <Label>Theme</Label>
            </div>
            <RadioGroup
              value={settings.theme}
              onValueChange={(value) => setSettings({ ...settings, theme: value })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-2">
              <BellIcon className="h-4 w-4 text-amber-600" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Label htmlFor="transliteration">Gurbani Transliteration</Label>
              </div>
              <p className="text-sm text-muted-foreground">Show Gurbani in Roman script alongside Gurmukhi</p>
            </div>
            <Switch
              id="transliteration"
              checked={settings.transliteration}
              onCheckedChange={(checked) => setSettings({ ...settings, transliteration: checked })}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}
