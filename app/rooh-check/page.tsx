import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"
import { EnhancedRoohCheck } from "@/components/enhanced-rooh-check"
import { MobileOptimizedLayout } from "@/components/mobile-optimized-layout"
import { getLastResponse } from "@/app/actions"

export default async function RoohCheckPage() {
  const lastSubmission = await getLastResponse()

  return (
    <MobileOptimizedLayout>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-12 sm:h-14 items-center px-4">
          <MainNav />
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 sm:py-8 lg:py-12 px-4">
          <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-900">
                <span className="text-orange-600">ਰੂਹ ਚੈੱਕ</span> - Rooh Check
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Express what's in your heart and receive personalized Gurbani guidance
              </p>
            </div>
            <EnhancedRoohCheck initialSubmission={lastSubmission} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </MobileOptimizedLayout>
  )
}
