import { createServerComponentClient } from "@/lib/supabase"

export interface UserSubmission {
  id?: string
  user_id?: string
  feeling: string
  gurbani_tuk: string
  transliteration: string
  translation: string
  explanation: string
  actions: string[]
  ardaas: string
  seva_points: number
  user_agent?: string
  created_at?: string
}

export interface SpiritualTodo {
  id?: string
  user_id?: string
  text: string
  completed: boolean
  source: "manual" | "rooh-check" | "hukamnama"
  created_at?: string
}

export interface QuizResult {
  id?: string
  user_id?: string
  score: number
  total_questions: number
  seva_points: number
  created_at?: string
}

export interface Feedback {
  id?: string
  user_id?: string
  feedback_type: string
  content: string
  created_at?: string
}

export interface Reminder {
  id?: string
  user_id?: string
  action: string
  time: string
  days: string[]
  created_at?: string
}

export interface UserProfile {
  id: string
  display_name?: string
  total_seva_points: number
  weekly_seva_points: number
  streak_days: number
  last_check_in?: string
  settings: {
    language: string
    theme: string
    notifications: boolean
    transliteration: boolean
  }
  created_at?: string
  updated_at?: string
}

class SupabaseService {
  private supabase = createServerComponentClient()

  // User Submissions
  async storeUserSubmission(submission: UserSubmission): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("user_submissions").insert({
        user_id: submission.user_id,
        feeling: submission.feeling,
        gurbani_tuk: submission.gurbani_tuk,
        transliteration: submission.transliteration,
        translation: submission.translation,
        explanation: submission.explanation,
        actions: submission.actions,
        ardaas: submission.ardaas,
        seva_points: submission.seva_points,
        user_agent: submission.user_agent,
      })

      if (error) {
        console.error("Error storing user submission:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error storing user submission:", error)
      return false
    }
  }

  async getRecentSubmissions(userId?: string, limit = 10): Promise<UserSubmission[]> {
    try {
      let query = this.supabase
        .from("user_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error getting recent submissions:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error getting recent submissions:", error)
      return []
    }
  }

  async getLastSubmission(userId?: string): Promise<UserSubmission | null> {
    try {
      let query = this.supabase.from("user_submissions").select("*").order("created_at", { ascending: false }).limit(1)

      if (userId) {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error getting last submission:", error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error("Error getting last submission:", error)
      return null
    }
  }

  // Spiritual Todos
  async storeSpiritualTodo(todo: SpiritualTodo): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("spiritual_todos").insert({
        user_id: todo.user_id,
        text: todo.text,
        completed: todo.completed,
        source: todo.source,
      })

      if (error) {
        console.error("Error storing spiritual todo:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error storing spiritual todo:", error)
      return false
    }
  }

  async getSpiritualTodos(userId?: string): Promise<SpiritualTodo[]> {
    try {
      let query = this.supabase.from("spiritual_todos").select("*").order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error getting spiritual todos:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error getting spiritual todos:", error)
      return []
    }
  }

  async updateSpiritualTodo(id: string, updates: Partial<SpiritualTodo>): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("spiritual_todos").update(updates).eq("id", id)

      if (error) {
        console.error("Error updating spiritual todo:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating spiritual todo:", error)
      return false
    }
  }

  async deleteSpiritualTodo(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("spiritual_todos").delete().eq("id", id)

      if (error) {
        console.error("Error deleting spiritual todo:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting spiritual todo:", error)
      return false
    }
  }

  // Quiz Results
  async storeQuizResult(result: QuizResult): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("quiz_results").insert({
        user_id: result.user_id,
        score: result.score,
        total_questions: result.total_questions,
        seva_points: result.seva_points,
      })

      if (error) {
        console.error("Error storing quiz result:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error storing quiz result:", error)
      return false
    }
  }

  // Feedback
  async storeFeedback(feedback: Feedback): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("feedback").insert({
        user_id: feedback.user_id,
        feedback_type: feedback.feedback_type,
        content: feedback.content,
      })

      if (error) {
        console.error("Error storing feedback:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error storing feedback:", error)
      return false
    }
  }

  // Reminders
  async storeReminder(reminder: Reminder): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("reminders").insert({
        user_id: reminder.user_id,
        action: reminder.action,
        time: reminder.time,
        days: reminder.days,
      })

      if (error) {
        console.error("Error storing reminder:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error storing reminder:", error)
      return false
    }
  }

  async getReminders(userId?: string): Promise<Reminder[]> {
    try {
      let query = this.supabase.from("reminders").select("*").order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error getting reminders:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error getting reminders:", error)
      return []
    }
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error getting user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error updating user profile:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating user profile:", error)
      return false
    }
  }

  async addSevaPoints(userId: string, points: number): Promise<boolean> {
    try {
      // Get current profile
      const profile = await this.getUserProfile(userId)
      if (!profile) {
        console.error("User profile not found")
        return false
      }

      // Update seva points
      const { error } = await this.supabase
        .from("user_profiles")
        .update({
          total_seva_points: profile.total_seva_points + points,
          weekly_seva_points: profile.weekly_seva_points + points,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error adding seva points:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error adding seva points:", error)
      return false
    }
  }

  // Analytics
  async getStats(): Promise<{
    submissions: number
    todos: number
    quizResults: number
    feedback: number
    reminders: number
  }> {
    try {
      const [
        { count: submissions },
        { count: todos },
        { count: quizResults },
        { count: feedback },
        { count: reminders },
      ] = await Promise.all([
        this.supabase.from("user_submissions").select("*", { count: "exact", head: true }),
        this.supabase.from("spiritual_todos").select("*", { count: "exact", head: true }),
        this.supabase.from("quiz_results").select("*", { count: "exact", head: true }),
        this.supabase.from("feedback").select("*", { count: "exact", head: true }),
        this.supabase.from("reminders").select("*", { count: "exact", head: true }),
      ])

      return {
        submissions: submissions || 0,
        todos: todos || 0,
        quizResults: quizResults || 0,
        feedback: feedback || 0,
        reminders: reminders || 0,
      }
    } catch (error) {
      console.error("Error getting stats:", error)
      return {
        submissions: 0,
        todos: 0,
        quizResults: 0,
        feedback: 0,
        reminders: 0,
      }
    }
  }
}

export const supabaseService = new SupabaseService()
