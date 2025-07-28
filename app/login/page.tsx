import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"
import { AuthLayout } from "@/components/auth-layout"

export const metadata: Metadata = {
  title: "Iniciar Sesión | Segundo Cerebro",
  description: "Inicia sesión en tu cuenta de Segundo Cerebro",
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
