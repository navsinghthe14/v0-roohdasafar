"use server"

import { revalidatePath } from "next/cache"
import { fetchDailyHukamnama, fetchHukamnamaByDate, type SikhNetHukamnama } from "@/lib/sikhnet-service"
import { config } from "@/lib/config"

// Type for the OpenAI response
interface GurbaniResponse {
  gurbaniTuk: {
    gurmukhi: string
    transliteration: string
    translation: string
  }
  actions: string[]
  ardaas: string
  explanation: string
}

// This would connect to your database or external service in a real app
// For now, we'll simulate storage with a simple in-memory object
const lastSubmission = {
  feeling: "",
  response: {
    gurbaniTuk: "",
    transliteration: "",
    translation: "",
    actions: [],
    ardaas: "",
    explanation: "",
  },
}

// Store for spiritual todos
const spiritualTodos: { id: string; text: string; completed: boolean; createdAt: string }[] = []

// Cache for the daily Hukamnama
let cachedHukamnama: SikhNetHukamnama | null = null
let cachedHukamnamaDate: string | null = null

export async function submitFeeling(feeling: string) {
  try {
    // Store the feeling
    lastSubmission.feeling = feeling

    // Create the prompt for OpenAI
    const prompt = `
      As a Sikh spiritual guide, provide guidance for someone who is feeling: "${feeling}".
      
      Respond with a JSON object in the following format:
      {
        "gurbaniTuk": {
          "gurmukhi": "Gurbani verse in Gurmukhi script",
          "transliteration": "Transliteration of the verse",
          "translation": "English translation of the verse"
        },
        "actions": [
          "First actionable step based on Sikh teachings",
          "Second actionable step based on Sikh teachings",
          "Third actionable step based on Sikh teachings"
        ],
        "ardaas": "A suggested prayer (Ardaas) related to their feeling",
        "explanation": "Brief explanation of how this Gurbani relates to their feeling"
      }
      
      Ensure the Gurbani tuk is relevant to their emotional state. The actions should be practical and rooted in Sikh teachings. The Ardaas should be compassionate and supportive.
    `

    // Check if we have a valid app URL
    if (!config.app.url) {
      throw new Error("App URL is not configured. Please set NEXT_PUBLIC_APP_URL environment variable.")
    }

    // Call our API route using the configured app URL
    const response = await fetch(`${config.app.url}/api/openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Response Error:", errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Validate that we received a proper response
    if (!data.text) {
      throw new Error("Invalid response from OpenAI API")
    }

    // Try to parse the response, with fallback if parsing fails
    let parsedResponse: GurbaniResponse
    try {
      parsedResponse = JSON.parse(data.text)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", data.text)

      // Fallback response if parsing fails
      parsedResponse = {
        gurbaniTuk: {
          gurmukhi: "ਸਰਬੱਤ ਦਾ ਭਲਾ ਕਰੇ ਵਾਹਿਗੁਰੂ",
          transliteration: "Sarbat da bhala kare Waheguru",
          translation: "May Waheguru bless all with prosperity and peace",
        },
        actions: [
          "Take a few deep breaths and center yourself",
          "Spend 10 minutes in quiet reflection or meditation",
          "Practice gratitude by listing three things you're thankful for",
        ],
        ardaas:
          "Waheguru, please grant me peace and clarity in this moment. Help me find strength in your teachings and wisdom in your guidance.",
        explanation:
          "This blessing reminds us that seeking the welfare of all beings brings inner peace and aligns us with divine will.",
      }
    }

    // Validate the parsed response structure
    if (!parsedResponse.gurbaniTuk || !parsedResponse.actions || !parsedResponse.ardaas) {
      throw new Error("Incomplete response from AI service")
    }

    // Update the last submission with the API response
    lastSubmission.response = {
      gurbaniTuk: parsedResponse.gurbaniTuk.gurmukhi,
      transliteration: parsedResponse.gurbaniTuk.transliteration,
      translation: parsedResponse.gurbaniTuk.translation,
      actions: parsedResponse.actions,
      ardaas: parsedResponse.ardaas,
      explanation: parsedResponse.explanation,
    }

    // Automatically add the actions to the spiritual to-do list
    for (const action of parsedResponse.actions) {
      await addToSpiritualTodo(action)
    }

    // Add Seva points for completing a Rooh Check
    await addSevaPoints(5)

    revalidatePath("/gurbani-response")
    revalidatePath("/spiritual-todo")
    return { success: true }
  } catch (error) {
    console.error("Error submitting feeling:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to submit feeling")
  }
}

export async function getLastResponse() {
  // In a real app, you would fetch this from a database
  return lastSubmission
}

export async function addToSpiritualTodo(action: string) {
  try {
    // In a real app, you would add this to a database
    const newTodo = {
      id: Date.now().toString(),
      text: action,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    // Add to our in-memory store
    spiritualTodos.push(newTodo)

    // For localStorage persistence, we'll handle this in the client component

    revalidatePath("/spiritual-todo")
    return { success: true }
  } catch (error) {
    console.error("Error adding to spiritual todo:", error)
    throw new Error("Failed to add to spiritual todo")
  }
}

export async function getSpiritualTodos() {
  // In a real app, you would fetch this from a database
  return spiritualTodos
}

export async function setReminder(action: string, time: string) {
  try {
    // In a real app, you would store this in a database and set up a notification
    // For now, we'll just log it
    console.log("Set reminder:", action, "at", time)

    revalidatePath("/reminders")
    return { success: true }
  } catch (error) {
    console.error("Error setting reminder:", error)
    throw new Error("Failed to set reminder")
  }
}

// Seva Points Management
export async function addSevaPoints(points: number) {
  try {
    // In a real app, you would update this in a database
    const currentPoints = localStorage.getItem("sevaPoints")
      ? Number.parseInt(localStorage.getItem("sevaPoints") as string)
      : 0

    const newPoints = currentPoints + points
    localStorage.setItem("sevaPoints", newPoints.toString())

    return { success: true, points: newPoints }
  } catch (error) {
    console.error("Error adding Seva points:", error)
    throw new Error("Failed to add Seva points")
  }
}

export async function getSevaPoints() {
  try {
    // In a real app, you would fetch this from a database
    const points = localStorage.getItem("sevaPoints")
      ? Number.parseInt(localStorage.getItem("sevaPoints") as string)
      : 0

    return { points }
  } catch (error) {
    console.error("Error getting Seva points:", error)
    throw new Error("Failed to get Seva points")
  }
}

export async function resetSevaPoints() {
  try {
    // In a real app, you would update this in a database
    localStorage.setItem("sevaPoints", "0")

    return { success: true }
  } catch (error) {
    console.error("Error resetting Seva points:", error)
    throw new Error("Failed to reset Seva points")
  }
}

// Hukamnama
export async function getDailyHukamnama() {
  try {
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

    // Check if we have a cached Hukamnama for today
    if (cachedHukamnama && cachedHukamnamaDate === today) {
      return {
        date: cachedHukamnama.date,
        hukamnama: {
          gurmukhi: cachedHukamnama.gurmukhi,
          transliteration: cachedHukamnama.punjabi, // Using Punjabi as transliteration
          translation: cachedHukamnama.english,
          explanation: "This is today's Hukamnama from Sri Harmandir Sahib, Amritsar.",
          actions: [
            "Reflect on the meaning of today's Hukamnama",
            "Share the wisdom with someone who might benefit",
            "Apply the teachings in your daily life",
          ],
          source: cachedHukamnama.source,
          pageNumber: cachedHukamnama.pageNumber,
          writer: cachedHukamnama.writer,
          raag: cachedHukamnama.raag,
          audioLinks: cachedHukamnama.audioLinks,
        },
      }
    }

    // Fetch fresh Hukamnama from SikhNet
    const sikhnetHukamnama = await fetchDailyHukamnama()

    // Cache the result
    cachedHukamnama = sikhnetHukamnama
    cachedHukamnamaDate = today

    // Return formatted Hukamnama
    return {
      date: sikhnetHukamnama.date,
      hukamnama: {
        gurmukhi: sikhnetHukamnama.gurmukhi,
        transliteration: sikhnetHukamnama.punjabi, // Using Punjabi as transliteration
        translation: sikhnetHukamnama.english,
        explanation: "This is today's Hukamnama from Sri Harmandir Sahib, Amritsar.",
        actions: [
          "Reflect on the meaning of today's Hukamnama",
          "Share the wisdom with someone who might benefit",
          "Apply the teachings in your daily life",
        ],
        source: sikhnetHukamnama.source,
        pageNumber: sikhnetHukamnama.pageNumber,
        writer: sikhnetHukamnama.writer,
        raag: sikhnetHukamnama.raag,
        audioLinks: sikhnetHukamnama.audioLinks,
      },
    }
  } catch (error) {
    console.error("Error getting daily Hukamnama:", error)

    // Fallback to static Hukamnama if API fails
    return {
      date: new Date().toLocaleDateString(),
      hukamnama: {
        gurmukhi: "ਜੈਤਸਰੀ ਮਹਲਾ ੪ ਘਰੁ ੧ ਚਉਪਦੇ ॥ ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥ ਮੇਰੇ ਹੀਅਰੇ ਰਤਨੁ ਨਾਮੁ ਹਰਿ ਬਸਿਆ ਗੁਰਿ ਹਾਥੁ ਧਰਿਓ ਮੇਰੈ ਮਾਥਾ ॥",
        transliteration:
          "Jaitsree, Fourth Mehl, First House, Chau-Padas: One Universal Creator God. By The Grace Of The True Guru: The Jewel of the Lord's Name abides within my heart; the Guru has placed His hand on my forehead.",
        translation:
          "Jaitsree, Fourth Mehl, First House, Chau-Padas: One Universal Creator God. By The Grace Of The True Guru: The Jewel of the Lord's Name abides within my heart; the Guru has placed His hand on my forehead.",
        explanation: "This is a fallback Hukamnama as we couldn't connect to SikhNet.",
        actions: [
          "Spend 15 minutes in Naam Simran meditation",
          "Work honestly and diligently in your daily tasks",
          "Help others find spiritual peace through your example",
        ],
        source: "Ang 696",
        pageNumber: "696",
        writer: "Guru Ram Das Ji",
        raag: "Jaitsree",
        audioLinks: {
          gurmukhi: "https://www.sikhnet.com/audio/hukamnama/gurmukhi/today.mp3",
          english: "https://www.sikhnet.com/audio/hukamnama/english/today.mp3",
          punjabi: "https://www.sikhnet.com/audio/hukamnama/punjabi/today.mp3",
        },
      },
    }
  }
}

export async function getHukamnamaByDate(year: string, month: string, day: string) {
  try {
    // Fetch Hukamnama from SikhNet archives
    const sikhnetHukamnama = await fetchHukamnamaByDate(year, month, day)

    // Return formatted Hukamnama
    return {
      date: sikhnetHukamnama.date,
      hukamnama: {
        gurmukhi: sikhnetHukamnama.gurmukhi,
        transliteration: sikhnetHukamnama.punjabi,
        translation: sikhnetHukamnama.english,
        explanation: `This is the Hukamnama from ${sikhnetHukamnama.date}.`,
        actions: [
          "Reflect on the meaning of this Hukamnama",
          "Share the wisdom with someone who might benefit",
          "Apply the teachings in your daily life",
        ],
        source: sikhnetHukamnama.source,
        pageNumber: sikhnetHukamnama.pageNumber,
        writer: sikhnetHukamnama.writer,
        raag: sikhnetHukamnama.raag,
        audioLinks: sikhnetHukamnama.audioLinks,
      },
    }
  } catch (error) {
    console.error("Error getting Hukamnama by date:", error)
    throw new Error("Failed to get Hukamnama for the specified date")
  }
}

// Feedback
export async function submitFeedback(feedback: string) {
  try {
    // In a real app, you would store this in a database
    console.log("Feedback submitted:", feedback)

    return { success: true }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw new Error("Failed to submit feedback")
  }
}

// Quiz
export async function getQuizQuestions() {
  try {
    // In a real app, you would fetch this from a database
    return [
      {
        id: "1",
        question: "Who was the first Guru of Sikhism?",
        options: ["Guru Nanak Dev Ji", "Guru Angad Dev Ji", "Guru Amar Das Ji", "Guru Ram Das Ji"],
        correctAnswer: "Guru Nanak Dev Ji",
      },
      {
        id: "2",
        question: "What is the name of the Sikh holy scripture?",
        options: ["Guru Granth Sahib", "Dasam Granth", "Adi Granth", "Sarbloh Granth"],
        correctAnswer: "Guru Granth Sahib",
      },
      {
        id: "3",
        question: "How many Gurus are there in Sikhism?",
        options: ["5", "10", "11", "12"],
        correctAnswer: "10",
      },
      {
        id: "4",
        question: "What is the name of the Sikh place of worship?",
        options: ["Mandir", "Gurdwara", "Masjid", "Temple"],
        correctAnswer: "Gurdwara",
      },
      {
        id: "5",
        question: "What does 'Waheguru' mean?",
        options: ["Great Teacher", "Wonderful Lord", "Divine Light", "Eternal Truth"],
        correctAnswer: "Wonderful Lord",
      },
    ]
  } catch (error) {
    console.error("Error getting quiz questions:", error)
    throw new Error("Failed to get quiz questions")
  }
}

export async function submitQuizResults(score: number) {
  try {
    // Add Seva points based on score
    await addSevaPoints(score * 3)

    return { success: true }
  } catch (error) {
    console.error("Error submitting quiz results:", error)
    throw new Error("Failed to submit quiz results")
  }
}
