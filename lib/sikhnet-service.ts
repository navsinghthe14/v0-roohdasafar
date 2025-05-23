/**
 * Service to interact with SikhNet API for fetching Hukamnama
 */

// Types for the SikhNet Hukamnama response
export interface SikhNetHukamnama {
  date: string
  gurmukhi: string
  punjabi: string
  english: string
  audioLinks: {
    gurmukhi: string
    english: string
    punjabi: string
  }
  source: string
  pageNumber: string
  writer: string
  raag: string
}

/**
 * Fetches the daily Hukamnama from SikhNet
 */
export async function fetchDailyHukamnama(): Promise<SikhNetHukamnama> {
  try {
    // In a real implementation, this would be a direct API call to SikhNet
    // For now, we'll simulate the API response structure based on the website

    // This would be replaced with actual fetch call:
    // const response = await fetch('https://api.sikhnet.com/v1/hukamnama/today');
    // const data = await response.json();

    // Simulated response based on SikhNet structure
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return {
      date: currentDate,
      gurmukhi: "ਜੈਤਸਰੀ ਮਹਲਾ ੪ ਘਰੁ ੧ ਚਉਪਦੇ ॥ ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥ ਮੇਰੇ ਹੀਅਰੇ ਰਤਨੁ ਨਾਮੁ ਹਰਿ ਬਸਿਆ ਗੁਰਿ ਹਾਥੁ ਧਰਿਓ ਮੇਰੈ ਮਾਥਾ ॥",
      punjabi:
        "ਜੈਤਸਰੀ ਰਾਗ ਵਿੱਚ ਗੁਰੂ ਰਾਮਦਾਸ ਜੀ ਦੀ ਬਾਣੀ, ਘਰ ੧, ਚਉਪਦੇ। ਅਕਾਲ ਪੁਰਖ ਇੱਕ ਹੈ, ਜਿਸ ਦੀ ਪ੍ਰਾਪਤੀ ਸਤਿਗੁਰੂ ਦੀ ਕਿਰਪਾ ਨਾਲ ਹੁੰਦੀ ਹੈ। ਹੇ ਭਾਈ! ਪਰਮਾਤਮਾ ਦਾ ਨਾਮ-ਰੂਪ ਰਤਨ ਮੇਰੇ ਹਿਰਦੇ ਵਿਚ ਆ ਵੱਸਿਆ ਹੈ, ਗੁਰੂ ਨੇ ਮੇਰੇ ਮੱਥੇ ਉਤੇ ਆਪਣਾ ਹੱਥ ਰੱਖਿਆ ਹੈ।",
      english:
        "Jaitsree, Fourth Mehl, First House, Chau-Padas: One Universal Creator God. By The Grace Of The True Guru: The Jewel of the Lord's Name abides within my heart; the Guru has placed His hand on my forehead.",
      audioLinks: {
        gurmukhi: "https://www.sikhnet.com/audio/hukamnama/gurmukhi/today.mp3",
        english: "https://www.sikhnet.com/audio/hukamnama/english/today.mp3",
        punjabi: "https://www.sikhnet.com/audio/hukamnama/punjabi/today.mp3",
      },
      source: "Ang 696",
      pageNumber: "696",
      writer: "Guru Ram Das Ji",
      raag: "Jaitsree",
    }
  } catch (error) {
    console.error("Error fetching Hukamnama from SikhNet:", error)
    throw new Error("Failed to fetch Hukamnama")
  }
}

/**
 * Fetches a Hukamnama from SikhNet archives by date
 */
export async function fetchHukamnamaByDate(year: string, month: string, day: string): Promise<SikhNetHukamnama> {
  try {
    // In a real implementation, this would be a direct API call to SikhNet
    // const response = await fetch(`https://api.sikhnet.com/v1/hukamnama/${year}/${month}/${day}`);
    // const data = await response.json();

    // For now, return the same simulated data with the requested date
    const requestedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return {
      date: requestedDate,
      gurmukhi: "ਜੈਤਸਰੀ ਮਹਲਾ ੪ ਘਰੁ ੧ ਚਉਪਦੇ ॥ ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥ ਮੇਰੇ ਹੀਅਰੇ ਰਤਨੁ ਨਾਮੁ ਹਰਿ ਬਸਿਆ ਗੁਰਿ ਹਾਥੁ ਧਰਿਓ ਮੇਰੈ ਮਾਥਾ ॥",
      punjabi:
        "ਜੈਤਸਰੀ ਰਾਗ ਵਿੱਚ ਗੁਰੂ ਰਾਮਦਾਸ ਜੀ ਦੀ ਬਾਣੀ, ਘਰ ੧, ਚਉਪਦੇ। ਅਕਾਲ ਪੁਰਖ ਇੱਕ ਹੈ, ਜਿਸ ਦੀ ਪ੍ਰਾਪਤੀ ਸਤਿਗੁਰੂ ਦੀ ਕਿਰਪਾ ਨਾਲ ਹੁੰਦੀ ਹੈ। ਹੇ ਭਾਈ! ਪਰਮਾਤਮਾ ਦਾ ਨਾਮ-ਰੂਪ ਰਤਨ ਮੇਰੇ ਹਿਰਦੇ ਵਿਚ ਆ ਵੱਸਿਆ ਹੈ, ਗੁਰੂ ਨੇ ਮੇਰੇ ਮੱਥੇ ਉਤੇ ਆਪਣਾ ਹੱਥ ਰੱਖਿਆ ਹੈ।",
      english:
        "Jaitsree, Fourth Mehl, First House, Chau-Padas: One Universal Creator God. By The Grace Of The True Guru: The Jewel of the Lord's Name abides within my heart; the Guru has placed His hand on my forehead.",
      audioLinks: {
        gurmukhi: `https://www.sikhnet.com/audio/hukamnama/gurmukhi/${year}${month}${day}.mp3`,
        english: `https://www.sikhnet.com/audio/hukamnama/english/${year}${month}${day}.mp3`,
        punjabi: `https://www.sikhnet.com/audio/hukamnama/punjabi/${year}${month}${day}.mp3`,
      },
      source: "Ang 696",
      pageNumber: "696",
      writer: "Guru Ram Das Ji",
      raag: "Jaitsree",
    }
  } catch (error) {
    console.error("Error fetching Hukamnama from SikhNet archives:", error)
    throw new Error("Failed to fetch Hukamnama from archives")
  }
}
