"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getNotes,
  getTasks,
  getEvents,
  getExams,
  addNote as addNoteToFirestore,
  updateNote as updateNoteInFirestore,
  deleteNote as deleteNoteFromFirestore,
  addTask as addTaskToFirestore,
  updateTask as updateTaskInFirestore,
  deleteTask as deleteTaskFromFirestore,
  addEvent as addEventToFirestore,
  updateEvent as updateEventInFirestore,
  deleteEvent as deleteEventFromFirestore,
  addExam as addExamToFirestore,
  updateExam as updateExamInFirestore,
  deleteExam as deleteExamFromFirestore,
  type Note,
  type Task,
  type CalendarEvent,
  type Exam
} from "@/lib/firestore"

interface DataContextType {
  notes: Note[]
  tasks: Task[]
  events: CalendarEvent[]
  exams: Exam[]
  isLoading: boolean
  addNote: (note: Omit<Note, "id" | "date" | "userId">) => Promise<void>
  updateNote: (id: string, note: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  addTask: (task: Omit<Task, "id" | "completed" | "userId">) => Promise<void>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  addEvent: (event: Omit<CalendarEvent, "id" | "userId">) => Promise<void>
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  addExam: (exam: Omit<Exam, "id" | "completed" | "userId">) => Promise<void>
  updateExam: (id: string, exam: Partial<Exam>) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  toggleExamCompletion: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType>({
  notes: [],
  tasks: [],
  events: [],
  exams: [],
  isLoading: false,
  addNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  toggleTaskCompletion: async () => {},
  addEvent: async () => {},
  updateEvent: async () => {},
  deleteEvent: async () => {},
  addExam: async () => {},
  updateExam: async () => {},
  deleteExam: async () => {},
  toggleExamCompletion: async () => {},
})

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

    const loadData = async () => {
      setIsLoading(true)
      try {
        // Cargar todos los datos desde Firestore
        const [notesData, tasksData, eventsData, examsData] = await Promise.all([
          getNotes(user.id),
          getTasks(user.id),
          getEvents(user.id),
          getExams(user.id)
        ])

        setNotes(notesData)
        setTasks(tasksData)
        setEvents(eventsData)
        setExams(examsData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  const addNote = async (note: Omit<Note, "id" | "date" | "userId">) => {
    if (!user) {
      console.error("No hay usuario autenticado")
      return
    }

    try {
      const noteData = {
        ...note,
        date: new Date().toISOString(),
        tags: note.tags || [],
        userId: user.id,
      }
      
      const newNoteId = await addNoteToFirestore(noteData)
      const newNote: Note = {
        ...noteData,
        id: newNoteId,
      }
      
      setNotes((prev) => [newNote, ...prev])
    } catch (error) {
      console.error("Error al agregar nota:", error)
      throw error
    }
  }

  const updateNote = async (id: string, note: Partial<Note>) => {
    try {
      await updateNoteInFirestore(id, note)
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...note } : n)))
    } catch (error) {
      console.error("Error al actualizar nota:", error)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await deleteNoteFromFirestore(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Error al eliminar nota:", error)
    }
  }

  const addTask = async (task: Omit<Task, "id" | "completed" | "userId">) => {
    if (!user) {
      console.error("No hay usuario autenticado")
      return
    }

    try {
      const taskData = {
        ...task,
        userId: user.id,
      }
      
      const newTaskId = await addTaskToFirestore(taskData)
      const newTask: Task = {
        ...taskData,
        id: newTaskId,
        completed: false,
      }
      
      setTasks((prev) => [newTask, ...prev])
    } catch (error) {
      console.error("Error al agregar tarea:", error)
      throw error
    }
  }

  const updateTask = async (id: string, task: Partial<Task>) => {
    try {
      await updateTaskInFirestore(id, task)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)))
    } catch (error) {
      console.error("Error al actualizar tarea:", error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskFromFirestore(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error al eliminar tarea:", error)
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (task) {
        await updateTaskInFirestore(id, { completed: !task.completed })
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
      }
    } catch (error) {
      console.error("Error al cambiar estado de tarea:", error)
    }
  }

  const addEvent = async (event: Omit<CalendarEvent, "id" | "userId">) => {
    if (!user) {
      console.error("No hay usuario autenticado")
      return
    }

    try {
      const eventData = {
        ...event,
        userId: user.id,
      }
      
      const newEventId = await addEventToFirestore(eventData)
      const newEvent: CalendarEvent = {
        ...eventData,
        id: newEventId,
      }
      
      setEvents((prev) => [newEvent, ...prev])
    } catch (error) {
      console.error("Error al agregar evento:", error)
      throw error
    }
  }

  const updateEvent = async (id: string, event: Partial<CalendarEvent>) => {
    try {
      await updateEventInFirestore(id, event)
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)))
    } catch (error) {
      console.error("Error al actualizar evento:", error)
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await deleteEventFromFirestore(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Error al eliminar evento:", error)
    }
  }

  const addExam = async (exam: Omit<Exam, "id" | "completed" | "userId">) => {
    if (!user) {
      console.error("No hay usuario autenticado")
      return
    }

    try {
      const examData = {
        ...exam,
        userId: user.id,
      }
      
      const newExamId = await addExamToFirestore(examData)
      const newExam: Exam = {
        ...examData,
        id: newExamId,
        completed: false,
      }
      
      setExams((prev) => [newExam, ...prev])
    } catch (error) {
      console.error("Error al agregar examen:", error)
      throw error
    }
  }

  const updateExam = async (id: string, exam: Partial<Exam>) => {
    try {
      await updateExamInFirestore(id, exam)
      setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...exam } : e)))
    } catch (error) {
      console.error("Error al actualizar examen:", error)
    }
  }

  const deleteExam = async (id: string) => {
    try {
      await deleteExamFromFirestore(id)
      setExams((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Error al eliminar examen:", error)
    }
  }

  const toggleExamCompletion = async (id: string) => {
    try {
      const exam = exams.find(e => e.id === id)
      if (exam) {
        await updateExamInFirestore(id, { completed: !exam.completed })
        setExams((prev) => prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)))
      }
    } catch (error) {
      console.error("Error al cambiar estado de examen:", error)
    }
  }

  return (
    <DataContext.Provider
      value={{
        notes,
        tasks,
        events,
        exams,
        isLoading,
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
