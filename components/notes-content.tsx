"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Clock, FileText, Edit, Eye, ArrowLeft, Tag, X } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

// Lista de etiquetas predefinidas
const PREDEFINED_TAGS = [
  "importante",
  "examen",
  "tarea",
  "proyecto",
  "teoría",
  "práctica",
  "matemáticas",
  "programación",
  "física",
  "química",
  "biología",
  "historia",
  "investigación",
  "referencia",
  "idea",
  "duda",
]

export function NotesContent() {
  const { toast } = useToast()
  const { notes, addNote, updateNote, deleteNote } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [showNewNote, setShowNewNote] = useState(false)
  const [showViewNote, setShowViewNote] = useState(false)
  const [showEditNote, setShowEditNote] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: [] as string[] })
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")

  // Recopilar todas las etiquetas únicas utilizadas
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || []))).sort()

  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return
    if (!newNote.tags.includes(tag)) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, tag],
      })
    }
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleCreateNote = () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      toast({
        title: "Error",
        description: "El título y el contenido son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (selectedNote && showEditNote) {
      updateNote(selectedNote, {
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
      })
      toast({
        title: "Nota actualizada",
        description: "Tu nota ha sido actualizada correctamente",
      })
      setShowEditNote(false)
    } else {
      addNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
      })
      toast({
        title: "Nota creada",
        description: "Tu nota ha sido guardada correctamente",
      })
      setShowNewNote(false)
    }

    setNewNote({ title: "", content: "", tags: [] })
    setSelectedNote(null)
  }

  const handleViewNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setNewNote({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
      })
      setSelectedNote(noteId)
      setShowViewNote(true)
    }
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setNewNote({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
      })
      setSelectedNote(noteId)
      setShowEditNote(true)
    }
  }

  const handleDeleteNote = () => {
    if (selectedNote) {
      deleteNote(selectedNote)
      toast({
        title: "Nota eliminada",
        description: "Tu nota ha sido eliminada correctamente",
      })
      setShowViewNote(false)
      setShowEditNote(false)
      setSelectedNote(null)
      setNewNote({ title: "", content: "", tags: [] })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return `Hace ${formatDistanceToNow(new Date(dateString), { locale: es })}`
    } catch (error) {
      return "Fecha desconocida"
    }
  }

  const filteredNotes = notes.filter((note) => {
    // Filtrar por texto
    const textMatch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))

    // Filtrar por etiqueta
    const tagMatch = !tagFilter || (note.tags && note.tags.includes(tagFilter))

    return textMatch && tagMatch
  })

  const handleBack = () => {
    setShowViewNote(false)
    setShowEditNote(false)
    setSelectedNote(null)
    setNewNote({ title: "", content: "", tags: [] })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Notas</h2>
        <Button onClick={() => setShowNewNote(true)} disabled={showViewNote || showEditNote}>
          <Plus className="mr-2 h-4 w-4" /> Nueva nota
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar notas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={showViewNote || showEditNote}
          />
        </div>

        {!showViewNote && !showEditNote && allTags.length > 0 && (
          <div className="flex-shrink-0 flex overflow-x-auto pb-2 gap-1 md:max-w-[40%]">
            {tagFilter && (
              <Badge
                variant="outline"
                className="cursor-pointer flex items-center gap-1"
                onClick={() => setTagFilter(null)}
              >
                <X className="h-3 w-3" /> Limpiar filtro
              </Badge>
            )}
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={tagFilter === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
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
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Tag className="h-4 w-4" /> Etiquetas
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {newNote.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="h-3 w-3 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva etiqueta"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                      e.preventDefault()
                      handleAddTag(newTag.trim())
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => handleAddTag(newTag)} disabled={!newTag.trim()}>
                  Añadir
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Etiquetas sugeridas:</p>
                <div className="flex flex-wrap gap-1">
                  {PREDEFINED_TAGS.filter((tag) => !newNote.tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => handleAddTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowNewNote(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNote}>Guardar nota</Button>
          </CardFooter>
        </Card>
      ) : showViewNote ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>{newNote.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setShowViewNote(false)
                  setShowEditNote(true)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap mb-4">{newNote.content}</div>
            {newNote.tags && newNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {newNote.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Volver
            </Button>
            <Button variant="destructive" onClick={handleDeleteNote}>
              Eliminar nota
            </Button>
          </CardFooter>
        </Card>
      ) : showEditNote ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Editar nota</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="edit-title"
                placeholder="Título de la nota"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium">
                Contenido
              </label>
              <Textarea
                id="edit-content"
                placeholder="Escribe el contenido de tu nota aquí..."
                rows={10}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Tag className="h-4 w-4" /> Etiquetas
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {newNote.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="h-3 w-3 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva etiqueta"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                      e.preventDefault()
                      handleAddTag(newTag.trim())
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => handleAddTag(newTag)} disabled={!newTag.trim()}>
                  Añadir
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Etiquetas sugeridas:</p>
                <div className="flex flex-wrap gap-1">
                  {PREDEFINED_TAGS.filter((tag) => !newNote.tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => handleAddTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNote}>Guardar cambios</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewNote(note.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Clock className="mr-1 h-3 w-3" /> {formatDate(note.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewNote(note.id)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditNote(note.id)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No se encontraron notas</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || tagFilter ? "Intenta con otra búsqueda o filtro" : "Crea tu primera nota para empezar"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
