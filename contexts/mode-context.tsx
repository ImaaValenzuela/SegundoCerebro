"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Mode = "estudio" | "normal"

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
}

const ModeContext = createContext<ModeContextType>({
  mode: "normal",
  setMode: () => {},
})

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("normal")

  useEffect(() => {
    // Recuperar el modo guardado en localStorage
    const savedMode = localStorage.getItem("app-mode") as Mode
    if (savedMode && (savedMode === "estudio" || savedMode === "normal")) {
      setMode(savedMode)
    }
  }, [])

  useEffect(() => {
    // Guardar el modo en localStorage
    localStorage.setItem("app-mode", mode)
  }, [mode])

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
}

export const useMode = () => useContext(ModeContext)
