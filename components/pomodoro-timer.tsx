"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, RotateCcw, HelpCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Definición de los tipos de temporizadores
const timerTypes = [
  {
    id: "classic",
    name: "Clásico (25/5)",
    workTime: 25 * 60,
    breakTime: 5 * 60,
    description: "El Pomodoro tradicional. Ideal para la mayoría de tareas y trabajos académicos.",
  },
  {
    id: "short",
    name: "Corto (15/3)",
    workTime: 15 * 60,
    breakTime: 3 * 60,
    description: "Para tareas simples y rápidas. Útil cuando tienes menor capacidad de concentración.",
  },
  {
    id: "long",
    name: "Largo (45/10)",
    workTime: 45 * 60,
    breakTime: 10 * 60,
    description: "Para tareas complejas que requieren mayor inmersión y concentración profunda.",
  },
  {
    id: "exam",
    name: "Examen (50/10)",
    workTime: 50 * 60,
    breakTime: 10 * 60,
    description: "Simula la duración de un examen. Perfecto para practicar gestión del tiempo.",
  },
  {
    id: "custom",
    name: "Personalizado",
    workTime: 30 * 60,
    breakTime: 5 * 60,
    description: "Define tus propios intervalos de trabajo y descanso.",
  },
]

export function PomodoroTimer() {
  const { toast } = useToast()
  const [mode, setMode] = useState<"work" | "break">("work")
  const [isActive, setIsActive] = useState(false)
  const [selectedTimerType, setSelectedTimerType] = useState("classic")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutos en segundos por defecto
  const [customWorkTime, setCustomWorkTime] = useState(30)
  const [customBreakTime, setCustomBreakTime] = useState(5)
  const [cycles, setCycles] = useState(0)
  const [totalMinutesStudied, setTotalMinutesStudied] = useState(0)

  // Obtener el timer actual basado en la selección
  const getCurrentTimer = () => {
    const timer = timerTypes.find((t) => t.id === selectedTimerType)
    if (timer?.id === "custom") {
      return {
        ...timer,
        workTime: customWorkTime * 60,
        breakTime: customBreakTime * 60,
      }
    }
    return timer || timerTypes[0]
  }

  // Cargar minutos estudiados
  useEffect(() => {
    const savedMinutes = localStorage.getItem("estudio-minutos")
    if (savedMinutes) {
      setTotalMinutesStudied(Number.parseInt(savedMinutes))
    }
  }, [])

  // Actualizar el tiempo restante cuando cambia el tipo de temporizador
  useEffect(() => {
    const timer = getCurrentTimer()
    setTimeLeft(mode === "work" ? timer.workTime : timer.breakTime)
    // Si el timer está activo, lo detenemos al cambiar de tipo
    if (isActive) {
      setIsActive(false)
    }
  }, [selectedTimerType, customWorkTime, customBreakTime, mode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Tiempo terminado
            clearInterval(interval as NodeJS.Timeout)

            const currentTimer = getCurrentTimer()

            // Cambiar de modo
            if (mode === "work") {
              // Guardar minutos estudiados
              const minutesStudied = Math.floor(currentTimer.workTime / 60)
              const newTotal = totalMinutesStudied + minutesStudied
              setTotalMinutesStudied(newTotal)
              localStorage.setItem("estudio-minutos", newTotal.toString())

              setCycles((prev) => prev + 1)
              setMode("break")
              setTimeLeft(currentTimer.breakTime)

              toast({
                title: "¡Tiempo de descanso!",
                description: `Toma un descanso de ${currentTimer.breakTime / 60} minutos.`,
              })
            } else {
              setMode("work")
              setTimeLeft(currentTimer.workTime)

              toast({
                title: "¡Vuelve al trabajo!",
                description: `Comienza un nuevo ciclo de ${currentTimer.workTime / 60} minutos.`,
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
  }, [isActive, mode, toast, totalMinutesStudied, selectedTimerType, customWorkTime, customBreakTime])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMode("work")
    const currentTimer = getCurrentTimer()
    setTimeLeft(currentTimer.workTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    const currentTimer = getCurrentTimer()
    const total = mode === "work" ? currentTimer.workTime : currentTimer.breakTime
    return ((total - timeLeft) / total) * 100
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
        <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
          {mode === "work" ? "Trabajo" : "Descanso"}
        </div>
      </div>

      <Progress value={calculateProgress()} className="w-full h-2" />

      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="timer-type" className="text-sm font-medium">
            Tipo de temporizador
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{getCurrentTimer().description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Select
          value={selectedTimerType}
          onValueChange={(value) => {
            setSelectedTimerType(value)
          }}
          disabled={isActive}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un temporizador" />
          </SelectTrigger>
          <SelectContent>
            {timerTypes.map((timer) => (
              <SelectItem key={timer.id} value={timer.id}>
                {timer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {getCurrentTimer().description && (
          <p className="text-xs text-muted-foreground mt-1">{getCurrentTimer().description}</p>
        )}

        {selectedTimerType === "custom" && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="space-y-1">
              <label htmlFor="custom-work" className="text-xs font-medium">
                Trabajo (min)
              </label>
              <input
                id="custom-work"
                type="number"
                min="1"
                max="120"
                className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={customWorkTime}
                onChange={(e) => setCustomWorkTime(Number(e.target.value))}
                disabled={isActive}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="custom-break" className="text-xs font-medium">
                Descanso (min)
              </label>
              <input
                id="custom-break"
                type="number"
                min="1"
                max="30"
                className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={customBreakTime}
                onChange={(e) => setCustomBreakTime(Number(e.target.value))}
                disabled={isActive}
              />
            </div>
          </div>
        )}
      </div>

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

      <div className="text-xs text-muted-foreground text-center w-full">
        <p>Ciclos completados: {cycles}</p>
        <p>Tiempo total estudiado: {totalMinutesStudied} minutos</p>
      </div>
    </div>
  )
}
