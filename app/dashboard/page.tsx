import type { Metadata } from "next"
import { DashboardContent } from "@/components/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | Segundo Cerebro",
  description: "Tu asistente personal para estudiar mejor y procrastinar menos",
}

export default function DashboardPage() {
  return <DashboardContent />
}
