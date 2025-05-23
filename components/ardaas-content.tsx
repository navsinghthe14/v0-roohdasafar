"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addSevaPoints } from "@/app/actions"

interface ArdaasContentProps {
  suggestedArdaas: string
}

export function ArdaasContent({ suggestedArdaas }: ArdaasContentProps) {
  const [personalArdaas, setPersonalArdaas] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pointsAdded, setPointsAdded] = useState(false)
  const { toast } = useToast()

  // Set the suggested Ardaas as the initial value for personal Ardaas if available
  useEffect(() => {
    if (suggestedArdaas && !personalArdaas) {
      setPersonalArdaas(suggestedArdaas)
    }
  }, [suggestedArdaas])

  const handleSubmit = async () => {
    if (!personalArdaas.trim()) {
      toast({
        title: "Ardaas cannot be empty",
        description: "Please write your prayer before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you might want to save this to a journal or database
      // For now, we'll just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add Seva points if not already added
      if (!pointsAdded) {
        await addSevaPoints(5)
        setPointsAdded(true)
      }

      toast({
        title: "Ardaas submitted",
        description: "Your prayer has been offered. Waheguru will listen. +5 Seva points added.",
      })
    } catch (error) {
      toast({
        title: "Failed to submit Ardaas",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const traditionalArdaas = `
    Ik Onkar. Waheguru ji ki Fateh!
    
    Sri Bhagauti ji Sahai. Var Sri Bhagauti Ji Ki Patshahi Dasvin.
    
    Pritham Bhagauti Simar Kai, Gur Nanak Lai Dhiai.
    Fir Angad Gur Te Amar Das, Ramdas Hoye Sahai.
    Arjan Hargobind No Simro, Sri Har Rai.
    Sri HarKrishan Dhiaiai, Jis Dithe Sabh Dukh Jaye.
    Teg Bahadur Simariai, Ghar Nau Nidh Avai Dhai.
    Sabh Thai Hoye Sahai.
    
    Dasan Patshah, Sri Guru Gobind Singh Ji Maharaj! Sabh Thai Hoye Sahai.
    
    Panj Piare, Char Sahibzade, Chalih Mukte, Hathian, Japian, Tapian, Jinhan Nam Japian, Vand Chakian, Deg Chalai, Teg Vahi, Dekh Ke Andith Kita, Tinhaan Piarean, Sachiaarean Di Kamaaee, Da Dhian Dhar Ke Bolo Ji Waheguru!
  `

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offer Your Ardaas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={suggestedArdaas ? "suggested" : "traditional"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggested">Suggested Ardaas</TabsTrigger>
            <TabsTrigger value="traditional">Traditional Ardaas</TabsTrigger>
            <TabsTrigger value="personal">Personal Ardaas</TabsTrigger>
          </TabsList>

          <TabsContent value="suggested" className="p-4 bg-amber-50 rounded-md mt-4">
            {suggestedArdaas ? (
              <div className="space-y-4">
                <p className="italic text-amber-900">{suggestedArdaas}</p>
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    setPersonalArdaas(suggestedArdaas)
                    document
                      .querySelector('[data-value="personal"]')
                      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                  }}
                >
                  Use This Ardaas
                </Button>
              </div>
            ) : (
              <p className="text-amber-900">Share your feelings first to receive a suggested Ardaas.</p>
            )}
          </TabsContent>

          <TabsContent value="traditional" className="p-4 bg-amber-50 rounded-md mt-4">
            <div className="space-y-4">
              <div className="whitespace-pre-line text-amber-900">{traditionalArdaas}</div>
            </div>
          </TabsContent>

          <TabsContent value="personal" className="p-4 bg-amber-50 rounded-md mt-4">
            <div className="space-y-4">
              <Textarea
                placeholder="Write your personal Ardaas (prayer) here..."
                className="min-h-[200px] resize-none bg-white"
                value={personalArdaas}
                onChange={(e) => setPersonalArdaas(e.target.value)}
              />
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Ardaas"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-center text-muted-foreground">
          Offer your Ardaas with a sincere heart. Waheguru listens to all prayers.
        </p>
      </CardFooter>
    </Card>
  )
}
