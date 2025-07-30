"use client"

import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function UserDebug() {
  const { user, isLoading } = useAuth()
  const { notes, tasks, events, exams } = useData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Usuario:</h3>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Creado:</strong> {user.createdAt}</p>
              <Badge variant="default">Autenticado</Badge>
            </div>
          ) : (
            <div>
              <p>No hay usuario autenticado</p>
              <Badge variant="destructive">No autenticado</Badge>
            </div>
          )}
        </div>

        {user && (
          <div>
            <h3 className="font-medium mb-2">Datos del Usuario:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Notas:</strong> {notes.length}</p>
                <p><strong>Tareas:</strong> {tasks.length}</p>
              </div>
              <div>
                <p><strong>Eventos:</strong> {events.length}</p>
                <p><strong>Exámenes:</strong> {exams.length}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 