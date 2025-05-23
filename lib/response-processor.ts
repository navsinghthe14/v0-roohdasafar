// Custom response processing and validation

export interface GurbaniResponse {
  gurbaniTuk: {
    gurmukhi: string
    transliteration: string
    translation: string
  }
  actions: string[]
  ardaas: string
  explanation: string
}

export function processGurbaniResponse(rawResponse: string, feeling: string): GurbaniResponse {
  try {
    const parsed = JSON.parse(rawResponse)

    // Validate required fields
    if (!parsed.gurbaniTuk || !parsed.actions || !parsed.ardaas) {
      throw new Error("Incomplete response structure")
    }

    // Post-process the response
    const processed: GurbaniResponse = {
      gurbaniTuk: {
        gurmukhi: parsed.gurbaniTuk.gurmukhi || "ਸਰਬੱਤ ਦਾ ਭਲਾ",
        transliteration: parsed.gurbaniTuk.transliteration || "Sarbat da bhala",
        translation: parsed.gurbaniTuk.translation || "May all prosper",
      },
      actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 5) : [], // Limit to 5 actions
      ardaas: parsed.ardaas || "Waheguru, please guide me on the right path.",
      explanation: parsed.explanation || "This Gurbani provides guidance for your current situation.",
    }

    // Add custom processing based on feeling
    processed.actions = enhanceActions(processed.actions, feeling)
    processed.ardaas = personalizeArdaas(processed.ardaas, feeling)

    return processed
  } catch (error) {
    console.error("Error processing response:", error)
    return getFallbackResponse(feeling)
  }
}

function enhanceActions(actions: string[], feeling: string): string[] {
  // Add feeling-specific actions if missing
  const enhancedActions = [...actions]

  // Always include a meditation/reflection action if not present
  const hasReflection = actions.some(
    (action) =>
      action.toLowerCase().includes("meditat") ||
      action.toLowerCase().includes("reflect") ||
      action.toLowerCase().includes("naam simran"),
  )

  if (!hasReflection) {
    enhancedActions.unshift("Spend 10 minutes in quiet Naam Simran meditation")
  }

  // Add seva action if not present
  const hasSeva = actions.some(
    (action) =>
      action.toLowerCase().includes("seva") ||
      action.toLowerCase().includes("service") ||
      action.toLowerCase().includes("help"),
  )

  if (!hasSeva) {
    enhancedActions.push("Perform a small act of seva (selfless service) for someone in need")
  }

  return enhancedActions
}

function personalizeArdaas(ardaas: string, feeling: string): string {
  // Add personal touch to the Ardaas based on the feeling
  const personalizedArdaas = `Waheguru Ji, as I share that I feel ${feeling.toLowerCase()}, ${ardaas.replace(/^Waheguru,?\s*/i, "")}`

  return personalizedArdaas
}

function getFallbackResponse(feeling: string): GurbaniResponse {
  return {
    gurbaniTuk: {
      gurmukhi: "ਸਰਬੱਤ ਦਾ ਭਲਾ ਕਰੇ ਵਾਹਿਗੁਰੂ",
      transliteration: "Sarbat da bhala kare Waheguru",
      translation: "May Waheguru bless all with prosperity and peace",
    },
    actions: [
      "Take three deep breaths and center yourself in the present moment",
      "Spend 15 minutes in Naam Simran meditation",
      "Read today's Hukamnama and reflect on its meaning",
      "Perform a kind act for someone in your community",
    ],
    ardaas: `Waheguru Ji, I come to you feeling ${feeling.toLowerCase()}. Please grant me peace, clarity, and strength to navigate this moment with grace. Help me find wisdom in your teachings and comfort in your presence.`,
    explanation:
      "This universal blessing reminds us that seeking the welfare of all beings brings inner peace and aligns us with divine will.",
  }
}
