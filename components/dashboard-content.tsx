"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, BookOpen, Calendar, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useData } from "@/contexts/data-context"
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { UserDebug } from "@/components/user-debug"
import { GoogleAuthDebug } from "@/components/google-auth-debug"

export function DashboardContent() {
  const { notes, tasks, events, exams } = useData()
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

  // Obtener eventos próximos (próximos 7 días)
  const today = new Date()
  const nextWeek = addDays(today, 7)

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = parseISO(event.date)
      return isAfter(eventDate, today) && isBefore(eventDate, nextWeek)
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3)

  // Obtener exámenes próximos (próximos 14 días)
  const nextTwoWeeks = addDays(today, 14)

  const upcomingExams = exams
    .filter((exam) => {
      const examDate = parseISO(exam.date)
      return !exam.completed && isAfter(examDate, today) && isBefore(examDate, nextTwoWeeks)
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      <UserDebug />
      <GoogleAuthDebug />

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-2">
                    <span
                      className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                        event.type === "tarea"
                          ? "bg-blue-500"
                          : event.type === "entrega"
                            ? "bg-red-500"
                            : event.type === "proyecto"
                              ? "bg-green-500"
                              : "bg-gray-500"
                      }`}
                    ></span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), "d 'de' MMMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay eventos próximos</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/calendario">Ver calendario</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos exámenes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex items-start gap-2">
                    <span
                      className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                        exam.priority === "alta"
                          ? "bg-red-500"
                          : exam.priority === "media"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{exam.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(exam.date), "d 'de' MMMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay exámenes próximos</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/examenes">Ver exámenes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
