"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { googleProvider } from "@/lib/google-auth-config"
import { getActionCodeSettings } from "@/lib/password-reset-config"
import { useFirebaseError } from "@/hooks/use-firebase-error"

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  loginWithGoogle: async () => false,
  resetPassword: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { getErrorMessage } = useFirebaseError()

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Obtener datos adicionales del usuario desde Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const userInfo: User = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || "Usuario",
              email: firebaseUser.email || "",
              createdAt: userData.createdAt || firebaseUser.metadata.creationTime || new Date().toISOString(),
            }
            setUser(userInfo)
          } else {
            // Si no existe el documento, crear uno básico
            const userInfo: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "Usuario",
              email: firebaseUser.email || "",
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            }
            setUser(userInfo)
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error)
          // Fallback con datos básicos de Firebase Auth
          const userInfo: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Usuario",
            email: firebaseUser.email || "",
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          }
          setUser(userInfo)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)
      throw new Error(getErrorMessage(error))
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Actualizar el perfil con el nombre
      await updateProfile(firebaseUser, {
        displayName: name
      })

      // Crear documento del usuario en Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      return true
    } catch (error: any) {
      console.error("Error al registrar usuario:", error)
      throw new Error(getErrorMessage(error))
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      
      if (!userDoc.exists()) {
        // Crear documento del usuario en Firestore si es nuevo
        await setDoc(doc(db, "users", firebaseUser.uid), {
          name: firebaseUser.displayName || "Usuario",
          email: firebaseUser.email || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      return true
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error)
      throw new Error(getErrorMessage(error))
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email, getActionCodeSettings())
      return true
    } catch (error: any) {
      console.error("Error al enviar email de restablecimiento:", error)
      throw new Error(getErrorMessage(error))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, resetPassword, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
