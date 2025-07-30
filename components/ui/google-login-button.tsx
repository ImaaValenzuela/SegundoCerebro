import { Button } from "@/components/ui/button"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Chrome } from "lucide-react"

interface GoogleLoginButtonProps {
  onSuccess?: () => void
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function GoogleLoginButton({ 
  onSuccess, 
  className, 
  variant = "outline",
  size = "default",
  children 
}: GoogleLoginButtonProps) {
  const { handleGoogleLogin, isLoading } = useGoogleAuth()

  const handleClick = async () => {
    await handleGoogleLogin()
    onSuccess?.()
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {children || (isLoading ? "Conectando..." : "Continuar con Google")}
    </Button>
  )
} 