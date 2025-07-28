"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface Note {
  id: string
  title: string
  content: string
  date: string
  tags?: string[]
  userId: string
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate: string
  userId: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string // ISO string
  type: "tarea" | "entrega" | "proyecto" | "otro"
  color?: string
  userId: string
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
  userId: string
}

interface DataContextType {
  notes: Note[]
  tasks: Task[]
  events: CalendarEvent[]
  exams: Exam[]
  addNote: (note: Omit<Note, "id" | "date" | "userId">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed" | "userId">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  addEvent: (event: Omit<CalendarEvent, "id" | "userId">) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  addExam: (exam: Omit<Exam, "id" | "completed" | "userId">) => void
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
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [exams, setExams] = useState<Exam[]>([])

  // Cargar datos al iniciar o cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      // Limpiar datos si no hay usuario
      setNotes([])
      setTasks([])
      setEvents([])
      setExams([])
      return
    }

    const loadData = () => {
      try {
        // Cargar todos los datos
        const allNotes: Note[] = JSON.parse(localStorage.getItem("segundo-cerebro-notes") || "[]")
        const allTasks: Task[] = JSON.parse(localStorage.getItem("segundo-cerebro-tasks") || "[]")
        const allEvents: CalendarEvent[] = JSON.parse(localStorage.getItem("segundo-cerebro-events") || "[]")
        const allExams: Exam[] = JSON.parse(localStorage.getItem("segundo-cerebro-exams") || "[]")

        // Filtrar por usuario actual
        setNotes(allNotes.filter((note) => note.userId === user.id))
        setTasks(allTasks.filter((task) => task.userId === user.id))
        setEvents(allEvents.filter((event) => event.userId === user.id))
        setExams(allExams.filter((exam) => exam.userId === user.id))
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }

    loadData()
  }, [user])

  // Guardar datos cuando cambien
  useEffect(() => {
    if (!user) return

    const saveData = (key: string, data: any[]) => {
      try {
        // Cargar todos los datos existentes
        const allData = JSON.parse(localStorage.getItem(key) || "[]")

        // Filtrar los datos que no son del usuario actual
        const otherUsersData = allData.filter((item: any) => item.userId !== user.id)

        // Combinar con los datos actuales del usuario
        const newData = [...otherUsersData, ...data]

        // Guardar todo
        localStorage.setItem(key, JSON.stringify(newData))
      } catch (error) {
        console.error(`Error al guardar ${key}:`, error)
      }
    }

    if (notes.length > 0) {
      saveData("segundo-cerebro-notes", notes)
    }

    if (tasks.length > 0) {
      saveData("segundo-cerebro-tasks", tasks)
    }

    if (events.length > 0) {
      saveData("segundo-cerebro-events", events)
    }

    if (exams.length > 0) {
      saveData("segundo-cerebro-exams", exams)
    }
  }, [notes, tasks, events, exams, user])

  const addNote = (note: Omit<Note, "id" | "date" | "userId">) => {
    if (!user) return

    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      tags: note.tags || [],
      userId: user.id,
    }
    setNotes((prev) => [...prev, newNote])
  }

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...note } : n)))
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const addTask = (task: Omit<Task, "id" | "completed" | "userId">) => {
    if (!user) return

    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      userId: user.id,
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

  const addEvent = (event: Omit<CalendarEvent, "id" | "userId">) => {
    if (!user) return

    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      userId: user.id,
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, event: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)))
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const addExam = (exam: Omit<Exam, "id" | "completed" | "userId">) => {
    if (!user) return

    const newExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      completed: false,
      userId: user.id,
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
