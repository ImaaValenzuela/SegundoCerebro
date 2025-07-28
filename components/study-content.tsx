"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { Maximize2, Minimize2, Save } from "lucide-react"
import { useData } from "@/contexts/data-context"

export function StudyContent() {
  const { toast } = useToast()
  const { addNote } = useData()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Cargar contenido guardado al iniciar
  useEffect(() => {
    const savedContent = localStorage.getItem("estudio-nota-temporal")
    if (savedContent) {
      setNoteContent(savedContent)
    }
  }, [])

  // Guardar contenido automáticamente
  useEffect(() => {
    if (noteContent.trim()) {
      localStorage.setItem("estudio-nota-temporal", noteContent)
    }
  }, [noteContent])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          title: "Error",
          description: `No se pudo activar el modo pantalla completa: ${err.message}`,
          variant: "destructive",
        })
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "La nota está vacía",
        variant: "destructive",
      })
      return
    }

    // Extraer el título de la primera línea o usar un título genérico
    const lines = noteContent.split("\n")
    const title = lines[0].trim() || "Nota de estudio"
    const content = lines.length > 1 ? lines.slice(1).join("\n").trim() : noteContent

    // Determinar etiquetas automáticamente
    const defaultTags = ["estudio"]

    // Detectar tema basándose en palabras clave
    const contentLower = content.toLowerCase()
    if (
      contentLower.includes("programación") ||
      contentLower.includes("código") ||
      contentLower.includes("función") ||
      contentLower.includes("variable")
    ) {
      defaultTags.push("programación")
    }
    if (contentLower.includes("matemática") || contentLower.includes("fórmula") || contentLower.includes("ecuación")) {
      defaultTags.push("matemáticas")
    }

    addNote({
      title,
      content: content || title,
      tags: defaultTags,
    })

    toast({
      title: "Nota guardada",
      description: "Tu nota ha sido guardada en la sección de notas",
    })

    setLastSaved(new Date())
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Modo Estudio</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveNote}>
            <Save className="mr-2 h-4 w-4" /> Guardar en Notas
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Área de trabajo</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-8rem)]">
              <div className="border rounded-md p-4 h-full">
                <textarea
                  className="w-full h-full bg-transparent border-none focus:outline-none resize-none"
                  placeholder="Escribe tus notas aquí... La primera línea se usará como título al guardar."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro</CardTitle>
            </CardHeader>
            <CardContent>
              <PomodoroTimer />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
