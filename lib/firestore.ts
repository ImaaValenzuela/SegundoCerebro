import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Tipos de datos
export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "tarea" | "entrega" | "proyecto" | "otro";
  color?: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  goal: string;
  reality: string;
  options: string[];
  wayForward: string;
  completed: boolean;
  priority: "alta" | "media" | "baja";
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

// Función helper para convertir Firestore timestamp a string
const timestampToString = (timestamp: Timestamp | null): string => {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
};

// Función helper para convertir documento de Firestore a objeto
const docToObject = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: data.date ? timestampToString(data.date) : new Date().toISOString(),
    dueDate: data.dueDate ? timestampToString(data.dueDate) : new Date().toISOString(),
    createdAt: data.createdAt ? timestampToString(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? timestampToString(data.updatedAt) : new Date().toISOString(),
  } as T;
};

// Funciones para Notas
export const notesCollection = collection(db, "notes");

export const getNotes = async (userId: string): Promise<Note[]> => {
  const q = query(
    notesCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToObject<Note>(doc));
};

export const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(notesCollection, {
    ...note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<void> => {
  const noteRef = doc(db, "notes", id);
  await updateDoc(noteRef, {
    ...note,
    updatedAt: serverTimestamp(),
  });
};

export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, "notes", id);
  await deleteDoc(noteRef);
};

// Funciones para Tareas
export const tasksCollection = collection(db, "tasks");

export const getTasks = async (userId: string): Promise<Task[]> => {
  const q = query(
    tasksCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToObject<Task>(doc));
};

export const addTask = async (task: Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(tasksCollection, {
    ...task,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, "tasks", id);
  await updateDoc(taskRef, {
    ...task,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  const taskRef = doc(db, "tasks", id);
  await deleteDoc(taskRef);
};

// Funciones para Eventos del Calendario
export const eventsCollection = collection(db, "events");

export const getEvents = async (userId: string): Promise<CalendarEvent[]> => {
  const q = query(
    eventsCollection,
    where("userId", "==", userId),
    orderBy("date", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToObject<CalendarEvent>(doc));
};

export const addEvent = async (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(eventsCollection, {
    ...event,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateEvent = async (id: string, event: Partial<CalendarEvent>): Promise<void> => {
  const eventRef = doc(db, "events", id);
  await updateDoc(eventRef, {
    ...event,
    updatedAt: serverTimestamp(),
  });
};

export const deleteEvent = async (id: string): Promise<void> => {
  const eventRef = doc(db, "events", id);
  await deleteDoc(eventRef);
};

// Funciones para Exámenes
export const examsCollection = collection(db, "exams");

export const getExams = async (userId: string): Promise<Exam[]> => {
  const q = query(
    examsCollection,
    where("userId", "==", userId),
    orderBy("date", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToObject<Exam>(doc));
};

export const addExam = async (exam: Omit<Exam, "id" | "completed" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(examsCollection, {
    ...exam,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateExam = async (id: string, exam: Partial<Exam>): Promise<void> => {
  const examRef = doc(db, "exams", id);
  await updateDoc(examRef, {
    ...exam,
    updatedAt: serverTimestamp(),
  });
};

export const deleteExam = async (id: string): Promise<void> => {
  const examRef = doc(db, "exams", id);
  await deleteDoc(examRef);
}; 