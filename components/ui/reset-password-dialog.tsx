"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useResetPassword } from "@/hooks/use-reset-password"
import { Mail } from "lucide-react"

interface ResetPasswordDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function ResetPasswordDialog({ trigger, onSuccess }: ResetPasswordDialogProps) {
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)
  const { handleResetPassword, isLoading, isSent, resetForm } = useResetPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleResetPassword(email)
    if (success) {
      onSuccess?.()
      // Cerrar el diálogo después de un breve delay
      setTimeout(() => {
        setOpen(false)
        resetForm()
        setEmail("")
      }, 2000)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
      setEmail("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="link" className="text-xs p-0 h-auto">¿Olvidaste tu contraseña?</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </DialogDescription>
        </DialogHeader>
        
        {isSent ? (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Hemos enviado un enlace de restablecimiento a tu correo electrónico.</p>
              <p className="mt-2">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm()
                  setEmail("")
                }}
              >
                Enviar otro email
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="dialog-email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="dialog-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar enlace"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 