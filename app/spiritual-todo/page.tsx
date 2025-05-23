import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"
import { SpiritualTodoList } from "@/components/spiritual-todo-list"

export default function SpiritualTodoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-amber-900">Spiritual To-Do</h1>
              <p className="text-muted-foreground">Track your spiritual practices and growth</p>
            </div>

            <SpiritualTodoList />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
