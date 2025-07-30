"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { GoogleLoginButton } from "@/components/ui/google-login-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, AlertTriangle, CheckCircle } from "lucide-react"

export function GoogleAuthDebug() {
  const { user, loginWithGoogle } = useAuth()
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    error?: any
  } | null>(null)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1076073928473-25hlau72eltqgmh4k0bi6uaosfpvv4ng.apps.googleusercontent.com'
  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

  const testGoogleAuth = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      await loginWithGoogle()
      setTestResult({
        success: true,
        message: "Autenticación con Google exitosa"
      })
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || "Error desconocido",
        error
      })
    } finally {
      setIsTesting(false)
    }
  }

  const getConfigStatus = () => {
    const issues = []
    
    if (!firebaseApiKey) issues.push("Falta NEXT_PUBLIC_FIREBASE_API_KEY")
    if (!firebaseAuthDomain) issues.push("Falta NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN")
    if (!googleClientId) issues.push("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID")
    
    return {
      hasIssues: issues.length > 0,
      issues
    }
  }

  const configStatus = getConfigStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Debug de Autenticación Google
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de configuración */}
        <div>
          <h3 className="font-medium mb-2">Configuración:</h3>
          {configStatus.hasIssues ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p>Problemas de configuración detectados:</p>
                  <ul className="list-disc list-inside">
                    {configStatus.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Configuración básica correcta
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Variables de entorno */}
        <div>
          <h3 className="font-medium mb-2">Variables de Entorno:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Google Client ID:</span>
              <Badge variant={googleClientId ? "default" : "destructive"}>
                {googleClientId ? "Configurado" : "Faltante"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Firebase API Key:</span>
              <Badge variant={firebaseApiKey ? "default" : "destructive"}>
                {firebaseApiKey ? "Configurado" : "Faltante"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Firebase Auth Domain:</span>
              <Badge variant={firebaseAuthDomain ? "default" : "destructive"}>
                {firebaseAuthDomain ? "Configurado" : "Faltante"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Estado del usuario */}
        <div>
          <h3 className="font-medium mb-2">Estado del Usuario:</h3>
          {user ? (
            <div className="space-y-2">
              <Badge variant="default">Autenticado</Badge>
              <p className="text-sm">Email: {user.email}</p>
              <p className="text-sm">ID: {user.id}</p>
            </div>
          ) : (
            <Badge variant="secondary">No autenticado</Badge>
          )}
        </div>

        {/* Prueba de autenticación */}
        <div>
          <h3 className="font-medium mb-2">Prueba de Autenticación:</h3>
          <div className="space-y-2">
            <Button 
              onClick={testGoogleAuth} 
              disabled={isTesting}
              variant="outline"
              className="w-full"
            >
              {isTesting ? "Probando..." : "Probar Autenticación Google"}
            </Button>
            
            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {testResult.message}
                  {testResult.error && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm">Ver detalles del error</summary>
                      <pre className="mt-1 text-xs bg-muted p-2 rounded">
                        {JSON.stringify(testResult.error, null, 2)}
                      </pre>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Botón de login alternativo */}
        <div>
          <h3 className="font-medium mb-2">Login con Google (Componente):</h3>
          <GoogleLoginButton 
            className="w-full"
            onSuccess={() => {
              setTestResult({
                success: true,
                message: "Login exitoso usando el componente"
              })
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
} 