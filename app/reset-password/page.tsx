import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/reset-password-form"

export const metadata: Metadata = {
  title: "Restablecer Contraseña | Segundo Cerebro",
  description: "Restablece tu contraseña de Segundo Cerebro",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Segundo Cerebro</h1>
          <p className="text-muted-foreground">
            Restablece tu contraseña
          </p>
        </div>

        {/* Formulario */}
        <ResetPasswordForm />
      </div>
    </div>
  )
} 