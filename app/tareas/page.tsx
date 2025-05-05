import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { TasksContent } from "@/components/tasks-content"

export const metadata: Metadata = {
  title: "Tareas | Segundo Cerebro",
  description: "Gestiona tus tareas y planifica tu tiempo",
}

export default function TasksPage() {
  return (
    <AppShell>
      <TasksContent />
    </AppShell>
  )
}
