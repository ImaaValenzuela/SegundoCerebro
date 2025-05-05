"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { useData } from "@/contexts/data-context"

export function DashboardContent() {
  const { notes, tasks } = useData()
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({
    notasCreadas: 0,
    tareasCompletadas: 0,
    minutosEstudio: 0,
  })

  useEffect(() => {
    // Actualizar estadísticas basadas en datos reales
    const completedTasks = tasks.filter((task) => task.completed).length
    const totalTasks = tasks.length

    setStats({
      notasCreadas: notes.length,
      tareasCompletadas: completedTasks,
      minutosEstudio: Number.parseInt(localStorage.getItem("estudio-minutos") || "0"),
    })

    // Calcular progreso
    setProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)
  }, [notes, tasks])

  const pendingTasks = tasks.filter((task) => !task.completed).slice(0, 2)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notasCreadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tareasCompletadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutos de estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.minutosEstudio}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Tareas completadas</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.tareasCompletadas}/{tasks.length}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximas tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{task.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay tareas pendientes</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/tareas">Ver todas las tareas</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
