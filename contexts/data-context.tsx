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

interface DataContextType {
  notes: Note[]
  tasks: Task[]
  addNote: (note: Omit<Note, "id" | "date">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
}

const DataContext = createContext<DataContextType>({
  notes: [],
  tasks: [],
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleTaskCompletion: () => {},
})

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  // Cargar datos al iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem("segundo-cerebro-notes")
    const savedTasks = localStorage.getItem("segundo-cerebro-tasks")

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
  }, [])

  // Guardar notas cuando cambien
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("segundo-cerebro-notes", JSON.stringify(notes))
    }
  }, [notes])

  // Guardar tareas cuando cambien
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("segundo-cerebro-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

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

  return (
    <DataContext.Provider
      value={{
        notes,
        tasks,
        addNote,
        updateNote,
        deleteNote,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
