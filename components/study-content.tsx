"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { Maximize2, Minimize2 } from "lucide-react"

export function StudyContent() {
  const { toast } = useToast()
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Modo Estudio</h2>
        <Button variant="outline" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
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
                  placeholder="Escribe tus notas aquí..."
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
