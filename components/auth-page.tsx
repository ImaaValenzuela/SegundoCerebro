"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export function AuthPage() {
  const pathname = usePathname()
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    setIsLogin(pathname === "/login")
  }, [pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Segundo Cerebro</h1>
          <p className="text-muted-foreground">
            Tu asistente personal para el aprendizaje y la productividad
          </p>
        </div>

        {/* Formulario */}
        {isLogin ? <LoginForm /> : <RegisterForm />}

        {/* Alternar entre login y registro */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-center">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Crea una cuenta para empezar a organizar tu aprendizaje"
                : "Inicia sesión para acceder a tu cuenta"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Crear cuenta" : "Iniciar sesión"}
            </Button>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Al continuar, aceptas nuestros términos de servicio y política de privacidad</p>
        </div>
      </div>
    </div>
  )
} 