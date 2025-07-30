import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function useResetPassword() {
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu correo electrónico",
        variant: "destructive",
      })
      return false
    }

    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSent(true)
      toast({
        title: "Email enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al enviar el email",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSent(false)
  }

  return {
    handleResetPassword,
    isLoading,
    isSent,
    resetForm
  }
} 