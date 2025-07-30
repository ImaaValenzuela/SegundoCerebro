import { GoogleAuthProvider } from "firebase/auth"

// Obtener el ID de cliente de Google desde las variables de entorno
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
  console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID no está configurado. La autenticación con Google puede no funcionar correctamente.')
}

// Configuración del proveedor de Google
export const googleProvider = new GoogleAuthProvider()

// Configurar scopes adicionales si es necesario
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Configurar parámetros personalizados
googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id: GOOGLE_CLIENT_ID || '1076073928473-25hlau72eltqgmh4k0bi6uaosfpvv4ng.apps.googleusercontent.com'
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
    client_id: GOOGLE_CLIENT_ID || '1076073928473-25hlau72eltqgmh4k0bi6uaosfpvv4ng.apps.googleusercontent.com',
    ...customParams
  })
  
  return provider
} 