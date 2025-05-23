// Mobile-specific utilities and responsive helpers

export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const getViewportHeight = (): number => {
  if (typeof window === "undefined") return 0
  return window.innerHeight
}

export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

export const vibrate = (pattern: number | number[] = 100): void => {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern)
  }
}

// Touch gesture helpers
export const addTouchFeedback = (element: HTMLElement): void => {
  element.addEventListener("touchstart", () => {
    element.style.transform = "scale(0.98)"
    element.style.transition = "transform 0.1s ease"
  })

  element.addEventListener("touchend", () => {
    element.style.transform = "scale(1)"
  })
}
