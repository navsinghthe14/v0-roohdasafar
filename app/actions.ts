"use server"

import { revalidatePath } from "next/cache"
import { fetchDailyHukamnama, fetchHukamnamaByDate, type SikhNetHukamnama } from "@/lib/sikhnet-service"
import { selectPromptTemplate } from "@/lib/prompt-templates"
import { processGurbaniResponse } from "@/lib/response-processor"
import {
  supabaseService,
  type UserSubmission,
  type SpiritualTodo,
  type QuizResult,
  type Feedback,
  type Reminder,
} from "@/lib/supabase-service"
import { headers } from "next/headers"

// In-memory storage for fallback (when not using auth)
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

// Cache for the daily Hukamnama
let cachedHukamnama: SikhNetHukamnama | null = null
let cachedHukamnamaDate: string | null = null

export async function submitFeeling(feeling: string, userId?: string) {
  try {
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || "Unknown"

    lastSubmission.feeling = feeling

    const prompt = selectPromptTemplate(feeling)
    const envApiKey = process.env.OPENAI_API_KEY

    if (!envApiKey) {
      console.log("No API key found, using fallback response")

      lastSubmission.response = {
        gurbaniTuk: "ਸਰਬੱਤ ਦਾ ਭਲਾ ਕਰੇ ਵਾਹਿਗੁਰੂ",
        transliteration: "Sarbat da bhala kare Waheguru",
        translation: "May Waheguru bless all with prosperity and peace",
        actions: [
          "Take a few deep breaths and center yourself",
          "Spend 10 minutes in quiet reflection or meditation",
          "Practice gratitude by listing three things you're thankful for",
        ],
        ardaas:
          "Waheguru, please grant me peace and clarity in this moment. Help me find strength in your teachings and wisdom in your guidance.",
        explanation:
          "This blessing reminds us that seeking the welfare of all beings brings inner peace and aligns us with divine will. (Note: This is a fallback response as the AI service is not configured.)",
      }

      // Store in Supabase
      const submission: UserSubmission = {
        user_id: userId,
        feeling: feeling,
        gurbani_tuk: lastSubmission.response.gurbaniTuk,
        transliteration: lastSubmission.response.transliteration,
        translation: lastSubmission.response.translation,
        explanation: lastSubmission.response.explanation,
        actions: lastSubmission.response.actions,
        ardaas: lastSubmission.response.ardaas,
        seva_points: 5,
        user_agent: userAgent,
      }

      await supabaseService.storeUserSubmission(submission)

      // Add seva points if user is logged in
      if (userId) {
        await supabaseService.addSevaPoints(userId, 5)
      }

      for (const action of lastSubmission.response.actions) {
        await addToSpiritualTodo(action, userId)
      }

      revalidatePath("/rooh-check")
      revalidatePath("/spiritual-todo")
      return { success: true }
    }

    console.log("Using OpenAI API")

    const { openai } = await import("@ai-sdk/openai")
    const { generateText } = await import("ai")

    const response = await generateText({
      model: openai("gpt-4o", { apiKey: envApiKey }),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    if (!response.text) {
      throw new Error("Invalid response from OpenAI API")
    }

    console.log("OpenAI response received")

    const parsedResponse = processGurbaniResponse(response.text, feeling)

    lastSubmission.response = {
      gurbaniTuk: parsedResponse.gurbaniTuk.gurmukhi,
      transliteration: parsedResponse.gurbaniTuk.transliteration,
      translation: parsedResponse.gurbaniTuk.translation,
      actions: parsedResponse.actions,
      ardaas: parsedResponse.ardaas,
      explanation: parsedResponse.explanation,
    }

    // Store in Supabase
    const submission: UserSubmission = {
      user_id: userId,
      feeling: feeling,
      gurbani_tuk: lastSubmission.response.gurbaniTuk,
      transliteration: lastSubmission.response.transliteration,
      translation: lastSubmission.response.translation,
      explanation: lastSubmission.response.explanation,
      actions: lastSubmission.response.actions,
      ardaas: lastSubmission.response.ardaas,
      seva_points: 5,
      user_agent: userAgent,
    }

    await supabaseService.storeUserSubmission(submission)

    // Add seva points if user is logged in
    if (userId) {
      await supabaseService.addSevaPoints(userId, 5)
    }

    for (const action of parsedResponse.actions) {
      await addToSpiritualTodo(action, userId)
    }

    revalidatePath("/rooh-check")
    revalidatePath("/spiritual-todo")
    return { success: true }
  } catch (error) {
    console.error("Error submitting feeling:", error)

    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("not configured"))) {
      lastSubmission.response = {
        gurbaniTuk: "ਸਰਬੱਤ ਦਾ ਭਲਾ ਕਰੇ ਵਾਹਿਗੁਰੂ",
        transliteration: "Sarbat da bhala kare Waheguru",
        translation: "May Waheguru bless all with prosperity and peace",
        actions: [
          "Take a few deep breaths and center yourself",
          "Spend 10 minutes in quiet reflection or meditation",
          "Practice gratitude by listing three things you're thankful for",
        ],
        ardaas:
          "Waheguru, please grant me peace and clarity in this moment. Help me find strength in your teachings and wisdom in your guidance.",
        explanation:
          "This blessing reminds us that seeking the welfare of all beings brings inner peace and aligns us with divine will. (Note: This is a fallback response as the AI service is not configured.)",
      }

      // Store fallback response in Supabase
      const submission: UserSubmission = {
        user_id: userId,
        feeling: feeling,
        gurbani_tuk: lastSubmission.response.gurbaniTuk,
        transliteration: lastSubmission.response.transliteration,
        translation: lastSubmission.response.translation,
        explanation: lastSubmission.response.explanation,
        actions: lastSubmission.response.actions,
        ardaas: lastSubmission.response.ardaas,
        seva_points: 5,
        user_agent: "fallback",
      }

      await supabaseService.storeUserSubmission(submission)

      // Add seva points if user is logged in
      if (userId) {
        await supabaseService.addSevaPoints(userId, 5)
      }

      for (const action of lastSubmission.response.actions) {
        await addToSpiritualTodo(action, userId)
      }

      revalidatePath("/rooh-check")
      revalidatePath("/spiritual-todo")
      return { success: true }
    }

    throw new Error(error instanceof Error ? error.message : "Failed to submit feeling")
  }
}

export async function getLastResponse(userId?: string) {
  try {
    // Try to get from Supabase first
    const lastDbSubmission = await supabaseService.getLastSubmission(userId)

    if (lastDbSubmission) {
      return {
        feeling: lastDbSubmission.feeling,
        response: {
          gurbaniTuk: lastDbSubmission.gurbani_tuk,
          transliteration: lastDbSubmission.transliteration,
          translation: lastDbSubmission.translation,
          actions: lastDbSubmission.actions,
          ardaas: lastDbSubmission.ardaas,
          explanation: lastDbSubmission.explanation,
        },
      }
    }

    // Fallback to in-memory
    return lastSubmission
  } catch (error) {
    console.error("Error getting last response:", error)
    return lastSubmission
  }
}

export async function addToSpiritualTodo(action: string, userId?: string) {
  try {
    // Store in Supabase
    const todo: SpiritualTodo = {
      user_id: userId,
      text: action,
      completed: false,
      source: "rooh-check",
    }

    await supabaseService.storeSpiritualTodo(todo)

    revalidatePath("/spiritual-todo")
    return { success: true }
  } catch (error) {
    console.error("Error adding to spiritual todo:", error)
    throw new Error("Failed to add to spiritual todo")
  }
}

export async function getSpiritualTodos(userId?: string) {
  try {
    const todos = await supabaseService.getSpiritualTodos(userId)

    // Convert to the format expected by the UI
    return todos.map((todo) => ({
      id: todo.id!,
      text: todo.text,
      completed: todo.completed,
      createdAt: todo.created_at!,
    }))
  } catch (error) {
    console.error("Error getting spiritual todos:", error)
    return []
  }
}

export async function setReminder(action: string, time: string, userId?: string) {
  try {
    console.log("Set reminder:", action, "at", time)

    // Store in Supabase
    const reminder: Reminder = {
      user_id: userId,
      action: action,
      time: time,
      days: ["everyday"],
    }

    await supabaseService.storeReminder(reminder)

    revalidatePath("/reminders")
    return { success: true }
  } catch (error) {
    console.error("Error setting reminder:", error)
    throw new Error("Failed to set reminder")
  }
}

export async function addSevaPoints(points: number, userId?: string) {
  try {
    if (userId) {
      await supabaseService.addSevaPoints(userId, points)
    }
    return { success: true, points: points }
  } catch (error) {
    console.error("Error adding Seva points:", error)
    throw new Error("Failed to add Seva points")
  }
}

export async function getSevaPoints(userId?: string) {
  try {
    if (userId) {
      const profile = await supabaseService.getUserProfile(userId)
      return { points: profile?.total_seva_points || 0 }
    }
    return { points: 0 }
  } catch (error) {
    console.error("Error getting Seva points:", error)
    throw new Error("Failed to get Seva points")
  }
}

export async function resetSevaPoints(userId?: string) {
  try {
    if (userId) {
      await supabaseService.updateUserProfile(userId, {
        weekly_seva_points: 0,
      })
    }
    return { success: true }
  } catch (error) {
    console.error("Error resetting Seva points:", error)
    throw new Error("Failed to reset Seva points")
  }
}

export async function getDailyHukamnama() {
  try {
    const today = new Date().toISOString().split("T")[0]

    if (cachedHukamnama && cachedHukamnamaDate === today) {
      return {
        date: cachedHukamnama.date,
        hukamnama: {
          gurmukhi: cachedHukamnama.gurmukhi,
          transliteration: cachedHukamnama.punjabi,
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

    const sikhnetHukamnama = await fetchDailyHukamnama()
    cachedHukamnama = sikhnetHukamnama
    cachedHukamnamaDate = today

    return {
      date: sikhnetHukamnama.date,
      hukamnama: {
        gurmukhi: sikhnetHukamnama.gurmukhi,
        transliteration: sikhnetHukamnama.punjabi,
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
    const sikhnetHukamnama = await fetchHukamnamaByDate(year, month, day)

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

export async function submitFeedback(feedback: string, feedbackType = "general", userId?: string) {
  try {
    console.log("Feedback submitted:", feedback)

    // Store in Supabase
    const feedbackData: Feedback = {
      user_id: userId,
      feedback_type: feedbackType,
      content: feedback,
    }

    await supabaseService.storeFeedback(feedbackData)

    return { success: true }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw new Error("Failed to submit feedback")
  }
}

export async function getQuizQuestions() {
  try {
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

export async function submitQuizResults(score: number, userId?: string) {
  try {
    // Store in Supabase
    const result: QuizResult = {
      user_id: userId,
      score: score,
      total_questions: 5,
      seva_points: score * 3,
    }

    await supabaseService.storeQuizResult(result)

    // Add seva points if user is logged in
    if (userId) {
      await supabaseService.addSevaPoints(userId, score * 3)
    }

    return { success: true }
  } catch (error) {
    console.error("Error submitting quiz results:", error)
    throw new Error("Failed to submit quiz results")
  }
}
