import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-amber-900">
        Home
      </Link>
      <Link
        href="/rooh-check"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Rooh Check
      </Link>
      <Link
        href="/gurbani-response"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Gurbani Response
      </Link>
      <Link
        href="/hukamnama"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Hukamnama
      </Link>
      <Link
        href="/spiritual-todo"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Spiritual To-Do
      </Link>
      <Link href="/ardaas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900">
        Ardaas
      </Link>
      <Link href="/quiz" className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900">
        Quiz
      </Link>
      <Link
        href="/reminders"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Reminders
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Dashboard
      </Link>
      <Link
        href="/settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-amber-900"
      >
        Settings
      </Link>
      <ApiStatusIndicator />
    </nav>
  )
}
