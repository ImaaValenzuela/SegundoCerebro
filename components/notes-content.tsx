"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Clock, FileText } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function NotesContent() {
  const { toast } = useToast()
  const { notes, addNote } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewNote, setShowNewNote] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })

  const handleCreateNote = () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      toast({
        title: "Error",
        description: "El título y el contenido son obligatorios",
        variant: "destructive",
      })
      return
    }

    addNote({
      title: newNote.title,
      content: newNote.content,
    })

    toast({
      title: "Nota creada",
      description: "Tu nota ha sido guardada correctamente",
    })

    setNewNote({ title: "", content: "" })
    setShowNewNote(false)
  }

  const formatDate = (dateString: string) => {
    try {
      return `Hace ${formatDistanceToNow(new Date(dateString), { locale: es })}`
    } catch (error) {
      return "Fecha desconocida"
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Notas</h2>
        <Button onClick={() => setShowNewNote(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva nota
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar notas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showNewNote ? (
        <Card>
          <CardHeader>
            <CardTitle>Nueva nota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                placeholder="Título de la nota"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenido
              </label>
              <Textarea
                id="content"
                placeholder="Escribe el contenido de tu nota aquí..."
                rows={10}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowNewNote(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNote}>Guardar nota</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Clock className="mr-1 h-3 w-3" /> {formatDate(note.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No se encontraron notas</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Intenta con otra búsqueda" : "Crea tu primera nota para empezar"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
