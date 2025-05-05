import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { DashboardContent } from "@/components/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | Segundo Cerebro",
  description: "Tu asistente personal para estudiar mejor y procrastinar menos",
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  )
}
