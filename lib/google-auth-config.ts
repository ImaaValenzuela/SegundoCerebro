import { GoogleAuthProvider } from "firebase/auth"

// Configuración del proveedor de Google
export const googleProvider = new GoogleAuthProvider()

// Configurar scopes adicionales si es necesario
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Configurar parámetros personalizados
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Función para configurar el proveedor con parámetros específicos
export const configureGoogleProvider = (customParams?: Record<string, string>) => {
  const provider = new GoogleAuthProvider()
  
  // Agregar scopes básicos
  provider.addScope('profile')
  provider.addScope('email')
  
  // Configurar parámetros por defecto
  provider.setCustomParameters({
    prompt: 'select_account',
    ...customParams
  })
  
  return provider
} 