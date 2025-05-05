"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/data-context"
import { CalendarView } from "@/components/calendar/calendar-view"
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns"
import { es } from "date-fns/locale"
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react"

type EventType = "tarea" | "entrega" | "proyecto" | "otro"

interface CalendarEvent {
  title: string
  description: string
  date: string
  type: EventType
}

export function CalendarContent() {
  const { toast } = useToast()
  const { events, addEvent, updateEvent, deleteEvent } = useData()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    title: "",
    description: "",
    date: "",
    type: "tarea",
  })

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setNewEvent({ ...newEvent, date: format(date, "yyyy-MM-dd") })
  }

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (!newEvent.date) {
      toast({
        title: "Error",
        description: "La fecha es obligatoria",
        variant: "destructive",
      })
      return
    }

    if (selectedEvent) {
      updateEvent(selectedEvent, newEvent)
      toast({
        title: "Evento actualizado",
        description: "El evento ha sido actualizado correctamente",
      })
    } else {
      addEvent(newEvent)
      toast({
        title: "Evento añadido",
        description: "El evento ha sido añadido correctamente",
      })
    }

    setNewEvent({
      title: "",
      description: "",
      date: "",
      type: "tarea",
    })
    setShowEventForm(false)
    setSelectedEvent(null)
  }

  const handleEditEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event) {
      setNewEvent({
        title: event.title,
        description: event.description,
        date: event.date.split("T")[0],
        type: event.type as EventType,
      })
      setSelectedEvent(eventId)
      setShowEventForm(true)
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
    toast({
      title: "Evento eliminado",
      description: "El evento ha sido eliminado correctamente",
    })
  }

  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => {
        const eventDate = parseISO(event.date)
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthEvents = events.filter((event) => {
    const eventDate = parseISO(event.date)
    return eventDate >= monthStart && eventDate <= monthEnd
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Calendario</h2>
        <Button onClick={() => setShowEventForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo evento
        </Button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* CALENDARIO */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
                {format(currentMonth, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() +
                  format(currentMonth, "MMMM yyyy", { locale: es }).slice(1)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarView
                currentMonth={currentMonth}
                events={monthEvents}
                onSelectDate={handleDateSelect}
                selectedDate={selectedDate}
              />
            </CardContent>
          </Card>
        </div>

        {/* FORMULARIO / EVENTOS */}
        <div>
          {showEventForm ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedEvent ? "Editar evento" : "Nuevo evento"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="title"
                    placeholder="Título del evento"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descripción
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del evento"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Fecha
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipo
                  </label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value: EventType) =>
                      setNewEvent({ ...newEvent, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tarea">Tarea</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                      <SelectItem value="proyecto">Proyecto</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEventForm(false)
                    setSelectedEvent(null)
                    setNewEvent({
                      title: "",
                      description: "",
                      date: "",
                      type: "tarea",
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddEvent}>{selectedEvent ? "Actualizar" : "Guardar"}</Button>
              </CardFooter>
            </Card>
          ) : selectedDate ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es }).charAt(0).toUpperCase() +
                    format(selectedDate, "d 'de' MMMM, yyyy", { locale: es }).slice(1)}
                </CardTitle>
                <CardDescription>Eventos para este día</CardDescription>
              </CardHeader>
              <CardContent>
                {eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-3">
                    {eventsForSelectedDate.map((event) => (
                      <div key={event.id} className="border rounded-md p-3 relative">
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditEvent(event.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mb-1 flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              event.type === "tarea"
                                ? "bg-blue-500"
                                : event.type === "entrega"
                                ? "bg-red-500"
                                : event.type === "proyecto"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          ></span>
                          <h4 className="font-medium">{event.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay eventos</p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
