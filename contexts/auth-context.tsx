"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar usuario al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("segundo-cerebro-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error al cargar usuario:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de verificación de credenciales
    const users = JSON.parse(localStorage.getItem("segundo-cerebro-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userInfo: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
      }
      setUser(userInfo)
      localStorage.setItem("segundo-cerebro-user", JSON.stringify(userInfo))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem("segundo-cerebro-users") || "[]")
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // En una app real, esto debería estar hasheado
      createdAt: new Date().toISOString(),
    }

    // Guardar usuario
    users.push(newUser)
    localStorage.setItem("segundo-cerebro-users", JSON.stringify(users))

    // Iniciar sesión automáticamente
    const userInfo: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    }
    setUser(userInfo)
    localStorage.setItem("segundo-cerebro-user", JSON.stringify(userInfo))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("segundo-cerebro-user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
