// Enhanced prompt templates for authentic Gurbani responses

export const promptTemplates = {
  // Standard spiritual guidance with strict Gurbani sourcing
  standard: (feeling: string) => `
    You are a knowledgeable Gurbani scholar and spiritual guide. A person feels: "${feeling}".
    
    IMPORTANT INSTRUCTIONS:
    1. You MUST provide an authentic verse from Guru Granth Sahib Ji (include Ang/page number)
    2. The Gurmukhi MUST be accurate and from the actual Granth
    3. Provide the exact transliteration and English translation
    4. Connect the verse meaningfully to their emotional state
    5. Suggest practical actions based on Sikh principles
    6. Create a heartfelt Ardaas that addresses their specific feeling
    
    Respond with JSON in this exact format:
    {
      "gurbaniTuk": {
        "gurmukhi": "Exact Gurbani verse in Gurmukhi script",
        "transliteration": "Accurate Roman transliteration", 
        "translation": "Precise English translation",
        "source": "Ang (page number) of Guru Granth Sahib Ji",
        "raag": "Musical mode if applicable"
      },
      "actions": [
        "Specific action based on Sikh teachings",
        "Another practical spiritual action",
        "Third action for spiritual growth"
      ],
      "ardaas": "Personal prayer addressing their specific feeling and seeking Waheguru's guidance",
      "explanation": "How this specific Gurbani verse relates to their feeling and provides guidance"
    }
    
    Example of proper Gurbani sourcing:
    - Gurmukhi: "ਸਰਬੱਤ ਦਾ ਭਲਾ ਕਰੇ ਵਾਹਿਗੁਰੂ"
    - Source: "Ang 1429, Guru Granth Sahib Ji"
    
    DO NOT make up verses. Use only authentic Gurbani from Guru Granth Sahib Ji.
  `,

  // For times of difficulty/stress with focus on Gurbani about resilience
  difficulty: (feeling: string) => `
    You are a compassionate Gurbani scholar. Someone is experiencing difficulty: "${feeling}".
    
    Focus on authentic Gurbani verses about:
    - Waheguru's support during hardship (ਸਹਾਰਾ)
    - Faith and patience (ਸਬਰ)
    - Finding strength in Naam Simran
    - Guru's protection and guidance
    
    MUST include exact Ang number and ensure Gurmukhi accuracy.
    Suggest actions like: Naam Simran, reading specific Banis, seva, sangat support.
    
    [Same JSON format as above]
  `,

  // For times of joy/gratitude with Gurbani about thankfulness
  gratitude: (feeling: string) => `
    You are a joyful Gurbani guide. Someone feels grateful: "${feeling}".
    
    Focus on authentic Gurbani verses about:
    - Gratitude to Waheguru (ਸ਼ੁਕਰਾਨਾ)
    - Sharing blessings with others
    - Recognizing Waheguru's grace (ਕਿਰਪਾ)
    - Expressing joy through Kirtan and Simran
    
    MUST include exact Ang number and ensure Gurmukhi accuracy.
    Suggest actions like: sharing with needy, kirtan, community seva, expressing gratitude.
    
    [Same JSON format as above]
  `,

  // For spiritual growth with Gurbani about spiritual development
  growth: (feeling: string) => `
    You are a Sikh teacher focused on spiritual development. Someone seeks growth: "${feeling}".
    
    Focus on authentic Gurbani verses about:
    - Spiritual progress and discipline
    - The path to enlightenment (ਮੁਕਤੀ)
    - Overcoming ego (ਹਉਮੈ)
    - Union with Waheguru
    
    MUST include exact Ang number and ensure Gurmukhi accuracy.
    Suggest actions like: daily Nitnem, Gurbani study, meditation, self-reflection.
    
    [Same JSON format as above]
  `,
}

// Enhanced function to detect emotional state and choose appropriate template
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
    "hurt",
    "pain",
    "suffering",
    "difficult",
    "hard",
    "struggle",
  ]

  const gratitudeKeywords = [
    "happy",
    "grateful",
    "thankful",
    "blessed",
    "joyful",
    "excited",
    "peaceful",
    "content",
    "satisfied",
    "appreciate",
    "love",
    "wonderful",
    "amazing",
  ]

  const growthKeywords = [
    "spiritual",
    "grow",
    "learn",
    "develop",
    "progress",
    "enlighten",
    "meditate",
    "improve",
    "better",
    "wisdom",
    "knowledge",
    "understanding",
    "path",
    "journey",
  ]

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
