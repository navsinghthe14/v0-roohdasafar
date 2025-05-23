"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()

        if (data.openai) {
          setStatus("ok")
        } else {
          setStatus("error")
          setIsVisible(true) // Show indicator if there's an issue
        }
      } catch (error) {
        setStatus("error")
        setIsVisible(true)
      }
    }

    checkApiStatus()

    // Check status every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Only show the indicator if there's an error or if explicitly made visible
  if (!isVisible && status === "ok") {
    return null
  }

  return (
    <Badge variant={status === "ok" ? "default" : "destructive"} className="ml-2 text-xs">
      {status === "loading" && (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Checking...
        </>
      )}
      {status === "ok" && (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          AI Ready
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-3 w-3 mr-1" />
          AI Offline
        </>
      )}
    </Badge>
  )
}
