"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Clock, CheckSquare } from "lucide-react"
import { useData } from "@/contexts/data-context"

export function TasksContent() {
  const { toast } = useToast()
  const { tasks, addTask, toggleTaskCompletion } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" })

  const handleCreateTask = async () => {
    if (newTask.title.trim() === "") {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      })
      return
    }

    try {
      await addTask({
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate || "Sin fecha",
      })

      toast({
        title: "Tarea creada",
        description: "Tu tarea ha sido guardada correctamente",
      })

      setNewTask({ title: "", description: "", dueDate: "" })
      setShowNewTask(false)
    } catch (error) {
      console.error("Error al crear tarea:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la tarea. Verifica tu conexión e intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleToggleTaskCompletion = (id: string) => {
    toggleTaskCompletion(id)
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingTasks = filteredTasks.filter((task) => !task.completed)
  const completedTasks = filteredTasks.filter((task) => task.completed)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tareas</h2>
        <Button onClick={() => setShowNewTask(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva tarea
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tareas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {showNewTask ? (
            <Card>
              <CardHeader>
                <CardTitle>Nueva tarea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="title"
                    placeholder="Título de la tarea"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descripción
                  </label>
                  <Input
                    id="description"
                    placeholder="Descripción de la tarea"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Fecha límite
                  </label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewTask(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTask}>Guardar tarea</Button>
              </CardFooter>
            </Card>
          ) : pendingTasks.length > 0 ? (
            pendingTasks.map((task) => (
              <Card key={task.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                      />
                      <label htmlFor={`task-${task.id}`} className="text-lg font-medium">
                        {task.title}
                      </label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> {task.dueDate}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No hay tareas pendientes</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Intenta con otra búsqueda" : "¡Buen trabajo! Añade una nueva tarea para continuar"}
              </p>
            </div>
          )}
        </div>

        <div>
          {completedTasks.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Tareas completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {completedTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`completed-${task.id}`}
                        checked={true}
                        onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                      />
                      <label htmlFor={`completed-${task.id}`} className="text-sm line-through text-muted-foreground">
                        {task.title}
                      </label>
                    </div>
                  ))}
                  {completedTasks.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      +{completedTasks.length - 5} tareas más
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
