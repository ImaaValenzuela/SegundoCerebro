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
      console.log("Iniciando login con Google desde hook...")
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
      console.error("Error en handleGoogleLogin:", error)
      
      // Manejar errores específicos
      let errorMessage = error.message || "Error al iniciar sesión con Google"
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'El inicio de sesión fue cancelado'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'El popup fue bloqueado. Por favor, permite popups para este sitio'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Este dominio no está autorizado para la autenticación con Google'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet'
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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