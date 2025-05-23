// Custom response processing and validation

export interface GurbaniResponse {
  gurbaniTuk: {
    gurmukhi: string
    transliteration: string
    translation: string
    source: string
    raag?: string
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

    // Enhanced validation for Gurbani authenticity
    const processed: GurbaniResponse = {
      gurbaniTuk: {
        gurmukhi: parsed.gurbaniTuk.gurmukhi || getDefaultGurbani(feeling).gurmukhi,
        transliteration: parsed.gurbaniTuk.transliteration || getDefaultGurbani(feeling).transliteration,
        translation: parsed.gurbaniTuk.translation || getDefaultGurbani(feeling).translation,
        source: parsed.gurbaniTuk.source || getDefaultGurbani(feeling).source,
        raag: parsed.gurbaniTuk.raag || undefined,
      },
      actions: Array.isArray(parsed.actions) ? enhanceActions(parsed.actions, feeling) : getDefaultActions(feeling),
      ardaas: personalizeArdaas(parsed.ardaas || getDefaultArdaas(feeling), feeling),
      explanation: parsed.explanation || getDefaultExplanation(feeling),
    }

    // Validate Gurmukhi script (basic check for Gurmukhi characters)
    if (!isValidGurmukhi(processed.gurbaniTuk.gurmukhi)) {
      console.warn("Invalid Gurmukhi detected, using fallback")
      processed.gurbaniTuk = getDefaultGurbani(feeling)
    }

    return processed
  } catch (error) {
    console.error("Error processing response:", error)
    return getFallbackResponse(feeling)
  }
}

function isValidGurmukhi(text: string): boolean {
  // Check if text contains Gurmukhi Unicode characters (U+0A00-U+0A7F)
  const gurmukhiRegex = /[\u0A00-\u0A7F]/
  return gurmukhiRegex.test(text) && text.length > 5
}

function getDefaultGurbani(feeling: string) {
  const lowerFeeling = feeling.toLowerCase()

  if (lowerFeeling.includes("sad") || lowerFeeling.includes("anxious") || lowerFeeling.includes("worried")) {
    return {
      gurmukhi: "ਸਭਨਾ ਜੀਆ ਕਾ ਇਕੁ ਦਾਤਾ ਸੋ ਮੈ ਵਿਸਰਿ ਨ ਜਾਈ ॥",
      transliteration: "Sabhnaa jeeaa kaa ik daataa so mai visar na jaaee.",
      translation: "The One Lord is the Giver of all souls; may I never forget Him.",
      source: "Ang 2, Guru Granth Sahib Ji",
    }
  } else if (lowerFeeling.includes("grateful") || lowerFeeling.includes("happy") || lowerFeeling.includes("blessed")) {
    return {
      gurmukhi: "ਧਨਿ ਧਨਿ ਰਾਮਦਾਸ ਗੁਰੁ ਜਿਨਿ ਸਿਰਿਆ ਤਿਨੈ ਸਵਾਰਿਆ ॥",
      transliteration: "Dhan dhan Raamdaas Gur jin siriaa tinai savaariaa.",
      translation: "Blessed, blessed is Guru Ram Das; He who created You, has also exalted You.",
      source: "Ang 1406, Guru Granth Sahib Ji",
    }
  } else {
    return {
      gurmukhi: "ਸਰਬੱਤ ਦਾ ਭਲਾ ਕਰੇ ਵਾਹਿਗੁਰੂ ॥",
      transliteration: "Sarbat da bhala kare Waheguru.",
      translation: "May Waheguru bless all with prosperity and peace.",
      source: "Sikh Prayer Tradition",
    }
  }
}

function enhanceActions(actions: string[], feeling: string): string[] {
  const enhancedActions = [...actions].slice(0, 4) // Limit to 4 actions

  // Always include Naam Simran if not present
  const hasNaamSimran = actions.some(
    (action) =>
      action.toLowerCase().includes("naam simran") ||
      action.toLowerCase().includes("meditation") ||
      action.toLowerCase().includes("waheguru"),
  )

  if (!hasNaamSimran) {
    enhancedActions.unshift("ਵਾਹਿਗੁਰੂ - Recite Waheguru and practice Naam Simran for 15 minutes")
  }

  // Add feeling-specific actions
  const lowerFeeling = feeling.toLowerCase()
  if (lowerFeeling.includes("anxious") || lowerFeeling.includes("worried")) {
    enhancedActions.push("Read Sukhmani Sahib for peace and tranquility")
  } else if (lowerFeeling.includes("grateful") || lowerFeeling.includes("happy")) {
    enhancedActions.push("Share your blessings through seva (selfless service)")
  }

  return enhancedActions
}

function getDefaultActions(feeling: string): string[] {
  return [
    "ਵਾਹਿਗੁਰੂ - Practice Naam Simran meditation for 15 minutes",
    "Read today's Hukamnama and reflect on its meaning",
    "Perform an act of seva (selfless service) for someone in need",
    "Connect with Sangat (spiritual community) for support",
  ]
}

function personalizeArdaas(ardaas: string, feeling: string): string {
  const personalizedArdaas = `ਵਾਹਿਗੁਰੂ ਜੀ, as I share that I feel ${feeling.toLowerCase()}, ${ardaas.replace(/^Waheguru,?\s*/i, "").replace(/^ਵਾਹਿਗੁਰੂ,?\s*/i, "")}`

  return personalizedArdaas
}

function getDefaultArdaas(feeling: string): string {
  return `ਵਾਹਿਗੁਰੂ ਜੀ, I come to you feeling ${feeling.toLowerCase()}. Please grant me peace, clarity, and strength to navigate this moment with grace. Help me find wisdom in your teachings and comfort in your presence. ਸਰਬੱਤ ਦਾ ਭਲਾ।`
}

function getDefaultExplanation(feeling: string): string {
  return `This Gurbani verse provides divine guidance for your current emotional state. The teachings of our Gurus offer wisdom and comfort for every situation we face in life.`
}

function getFallbackResponse(feeling: string): GurbaniResponse {
  return {
    gurbaniTuk: getDefaultGurbani(feeling),
    actions: getDefaultActions(feeling),
    ardaas: getDefaultArdaas(feeling),
    explanation: getDefaultExplanation(feeling),
  }
}
