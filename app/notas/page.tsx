import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { NotesContent } from "@/components/notes-content"

export const metadata: Metadata = {
  title: "Notas | Segundo Cerebro",
  description: "Tu base de conocimiento personal",
}

export default function NotesPage() {
  return (
    <AppShell>
      <NotesContent />
    </AppShell>
  )
}
