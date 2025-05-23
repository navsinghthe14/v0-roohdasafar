import { ShareFeelingsForm } from "@/components/share-feelings-form"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"

export default function RoohCheckPage() {
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
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-orange-900">
                <span className="text-orange-600">ਰੂਹ ਚੈੱਕ</span> - Rooh Check
              </h1>
              <p className="text-muted-foreground">Express what's in your heart and receive Gurbani guidance</p>
            </div>
            <ShareFeelingsForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
