import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function useGoogleAuth() {
  const { loginWithGoogle } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async (redirectTo?: string) => {
    setIsLoading(true)
    
    try {
      await loginWithGoogle()
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a Segundo Cerebro",
      })
      
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión con Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleGoogleLogin,
    isLoading
  }
} 