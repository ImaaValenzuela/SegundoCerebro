import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { StudyContent } from "@/components/study-content"

export const metadata: Metadata = {
  title: "Modo Estudio | Segundo Cerebro",
  description: "Espacio libre de distracciones para concentrarte",
}

export default function StudyPage() {
  return (
    <AppShell>
      <StudyContent />
    </AppShell>
  )
}
