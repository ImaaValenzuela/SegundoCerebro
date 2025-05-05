"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, RotateCcw } from "lucide-react"

export function PomodoroTimer() {
  const { toast } = useToast()
  const [mode, setMode] = useState<"work" | "break">("work")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutos en segundos
  const [cycles, setCycles] = useState(0)
  const [totalMinutesStudied, setTotalMinutesStudied] = useState(0)

  const workTime = 25 * 60 // 25 minutos en segundos
  const breakTime = 5 * 60 // 5 minutos en segundos

  // Cargar minutos estudiados
  useEffect(() => {
    const savedMinutes = localStorage.getItem("estudio-minutos")
    if (savedMinutes) {
      setTotalMinutesStudied(Number.parseInt(savedMinutes))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    const minutesAdded = false

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Tiempo terminado
            clearInterval(interval as NodeJS.Timeout)

            // Cambiar de modo
            if (mode === "work") {
              // Guardar minutos estudiados
              const minutesStudied = Math.floor(workTime / 60)
              const newTotal = totalMinutesStudied + minutesStudied
              setTotalMinutesStudied(newTotal)
              localStorage.setItem("estudio-minutos", newTotal.toString())

              setCycles((prev) => prev + 1)
              setMode("break")
              setTimeLeft(breakTime)

              toast({
                title: "¡Tiempo de descanso!",
                description: "Toma un descanso de 5 minutos.",
              })
            } else {
              setMode("work")
              setTimeLeft(workTime)

              toast({
                title: "¡Vuelve al trabajo!",
                description: "Comienza un nuevo ciclo de 25 minutos.",
              })
            }

            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, mode, toast, totalMinutesStudied, workTime, breakTime])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMode("work")
    setTimeLeft(workTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    const total = mode === "work" ? workTime : breakTime
    return ((total - timeLeft) / total) * 100
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center w-full">
        <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      </div>

      <Progress value={calculateProgress()} className="w-full h-2" />

      <div className="flex items-center gap-2 w-full">
        <Button onClick={toggleTimer} variant="outline" className="flex-1">
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pausar
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Iniciar
            </>
          )}
        </Button>
        <Button onClick={resetTimer} variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
