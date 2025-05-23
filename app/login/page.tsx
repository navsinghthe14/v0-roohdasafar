import { LoginForm } from "@/components/login-form"
import { MobileOptimizedLayout } from "@/components/mobile-optimized-layout"

export default function LoginPage() {
  return (
    <MobileOptimizedLayout>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </MobileOptimizedLayout>
  )
}
