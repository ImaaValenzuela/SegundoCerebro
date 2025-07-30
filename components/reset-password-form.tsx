"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useResetPassword } from "@/hooks/use-reset-password"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const { handleResetPassword, isLoading, isSent, resetForm } = useResetPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleResetPassword(email)
  }

  if (isSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-center">Email enviado</CardTitle>
          <CardDescription className="text-center">
            Hemos enviado un enlace de restablecimiento a tu correo electrónico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
            <p className="mt-2">Si no recibes el email, verifica tu carpeta de spam.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              resetForm()
              setEmail("")
            }}
          >
            Enviar otro email
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline flex items-center justify-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12" />
        </div>
        <CardTitle className="text-2xl text-center">Restablecer contraseña</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar enlace de restablecimiento"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline flex items-center justify-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 