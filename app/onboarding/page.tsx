import { OnboardingFlow } from "@/components/onboarding-flow"
import { MobileOptimizedLayout } from "@/components/mobile-optimized-layout"

export default function OnboardingPage() {
  return (
    <MobileOptimizedLayout>
      <main className="flex-1">
        <OnboardingFlow />
      </main>
    </MobileOptimizedLayout>
  )
}
