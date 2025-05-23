// Create different prompt templates for different scenarios

export const promptTemplates = {
  // Standard spiritual guidance
  standard: (feeling: string) => `
    You are a wise Sikh spiritual guide. A person feels: "${feeling}".
    
    Provide guidance based on Gurbani with practical actions and a suggested Ardaas.
    
    Respond with JSON in this format:
    {
      "gurbaniTuk": {
        "gurmukhi": "Authentic Gurbani verse",
        "transliteration": "Roman transliteration", 
        "translation": "English translation"
      },
      "actions": ["Action 1", "Action 2", "Action 3"],
      "ardaas": "Suggested prayer",
      "explanation": "How this Gurbani relates to their feeling"
    }
  `,

  // For times of difficulty/stress
  difficulty: (feeling: string) => `
    You are a compassionate Sikh spiritual counselor. Someone is going through difficulty: "${feeling}".
    
    Focus on Gurbani verses about resilience, faith during hardship, and Waheguru's support.
    Include actions that provide comfort and strength.
    
    [Same JSON format as above]
  `,

  // For times of joy/gratitude
  gratitude: (feeling: string) => `
    You are a joyful Sikh guide. Someone is feeling grateful: "${feeling}".
    
    Focus on Gurbani about thankfulness, sharing blessings, and expressing gratitude to Waheguru.
    Include actions about seva and sharing joy with others.
    
    [Same JSON format as above]
  `,

  // For spiritual growth
  growth: (feeling: string) => `
    You are a Sikh teacher focused on spiritual development. Someone seeks growth: "${feeling}".
    
    Focus on Gurbani about spiritual progress, discipline, and the path to enlightenment.
    Include actions about meditation, study, and spiritual practices.
    
    [Same JSON format as above]
  `,
}

// Function to detect the type of feeling and choose appropriate template
export function selectPromptTemplate(feeling: string): string {
  const lowerFeeling = feeling.toLowerCase()

  // Keywords for different emotional states
  const difficultyKeywords = [
    "sad",
    "anxious",
    "worried",
    "stressed",
    "depressed",
    "angry",
    "frustrated",
    "lost",
    "confused",
  ]
  const gratitudeKeywords = ["happy", "grateful", "thankful", "blessed", "joyful", "excited", "peaceful"]
  const growthKeywords = ["spiritual", "grow", "learn", "develop", "progress", "enlighten", "meditate"]

  if (difficultyKeywords.some((keyword) => lowerFeeling.includes(keyword))) {
    return promptTemplates.difficulty(feeling)
  } else if (gratitudeKeywords.some((keyword) => lowerFeeling.includes(keyword))) {
    return promptTemplates.gratitude(feeling)
  } else if (growthKeywords.some((keyword) => lowerFeeling.includes(keyword))) {
    return promptTemplates.growth(feeling)
  } else {
    return promptTemplates.standard(feeling)
  }
}
