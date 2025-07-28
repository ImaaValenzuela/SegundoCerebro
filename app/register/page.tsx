import type { Metadata } from "next"
import { RegisterForm } from "@/components/register-form"
import { AuthLayout } from "@/components/auth-layout"

export const metadata: Metadata = {
  title: "Registro | Segundo Cerebro",
  description: "Crea una cuenta en Segundo Cerebro",
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
