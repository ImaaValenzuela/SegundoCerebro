import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { CalendarContent } from "@/components/calendar-content"

export const metadata: Metadata = {
  title: "Calendario | Segundo Cerebro",
  description: "Gestiona tus eventos, pendientes y exámenes",
}

export default function CalendarPage() {
  return (
    <AppShell>
      <CalendarContent />
    </AppShell>
  )
}
