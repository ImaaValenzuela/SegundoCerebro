import type { Metadata } from "next"
import { AuthPage } from "@/components/auth-page"

export const metadata: Metadata = {
  title: "Autenticación | Segundo Cerebro",
  description: "Inicia sesión o crea una cuenta en Segundo Cerebro",
}

export default function LoginPage() {
  return <AuthPage />
}
