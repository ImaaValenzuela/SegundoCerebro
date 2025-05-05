"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Note {
  id: string
  title: string
  content: string
  date: string
  tags?: string[]
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string // ISO string
  type: "tarea" | "entrega" | "proyecto" | "otro"
  color?: string
}

export interface Exam {
  id: string
  subject: string
  date: string // ISO string
  goal: string // Objetivo (G de GROW)
  reality: string // Realidad actual (R de GROW)
  options: string[] // Opciones (O de GROW)
  wayForward: string // Plan de acción (W de GROW)
  completed: boolean
  priority: "alta" | "media" | "baja"
}

interface DataContextType {
  notes: Note[]
  tasks: Task[]
  events: CalendarEvent[]
  exams: Exam[]
  addNote: (note: Omit<Note, "id" | "date">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  addEvent: (event: Omit<CalendarEvent, "id">) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  addExam: (exam: Omit<Exam, "id" | "completed">) => void
  updateExam: (id: string, exam: Partial<Exam>) => void
  deleteExam: (id: string) => void
  toggleExamCompletion: (id: string) => void
}

const DataContext = createContext<DataContextType>({
  notes: [],
  tasks: [],
  events: [],
  exams: [],
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleTaskCompletion: () => {},
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  addExam: () => {},
  updateExam: () => {},
  deleteExam: () => {},
  toggleExamCompletion: () => {},
})

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [exams, setExams] = useState<Exam[]>([])

  // Cargar datos al iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem("segundo-cerebro-notes")
    const savedTasks = localStorage.getItem("segundo-cerebro-tasks")
    const savedEvents = localStorage.getItem("segundo-cerebro-events")
    const savedExams = localStorage.getItem("segundo-cerebro-exams")

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error("Error al cargar notas:", error)
      }
    }

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Error al cargar tareas:", error)
      }
    }

    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents))
      } catch (error) {
        console.error("Error al cargar eventos:", error)
      }
    }

    if (savedExams) {
      try {
        setExams(JSON.parse(savedExams))
      } catch (error) {
        console.error("Error al cargar exámenes:", error)
      }
    }
  }, [])

  // Guardar datos cuando cambien
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("segundo-cerebro-notes", JSON.stringify(notes))
    }
  }, [notes])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("segundo-cerebro-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("segundo-cerebro-events", JSON.stringify(events))
    }
  }, [events])

  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem("segundo-cerebro-exams", JSON.stringify(exams))
    }
  }, [exams])

  const addNote = (note: Omit<Note, "id" | "date">) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, newNote])
  }

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...note } : n)))
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, event: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)))
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const addExam = (exam: Omit<Exam, "id" | "completed">) => {
    const newExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      completed: false,
    }
    setExams((prev) => [...prev, newExam])
  }

  const updateExam = (id: string, exam: Partial<Exam>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...exam } : e)))
  }

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
  }

  const toggleExamCompletion = (id: string) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)))
  }

  return (
    <DataContext.Provider
      value={{
        notes,
        tasks,
        events,
        exams,
        addNote,
        updateNote,
        deleteNote,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addEvent,
        updateEvent,
        deleteEvent,
        addExam,
        updateExam,
        deleteExam,
        toggleExamCompletion,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
