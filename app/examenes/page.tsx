import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { ExamScheduleContent } from "@/components/exam-schedule-content"

export const metadata: Metadata = {
  title: "Exámenes | Segundo Cerebro",
  description: "Planifica tus exámenes con el método GROW",
}

export default function ExamsPage() {
  return (
    <AppShell>
      <ExamScheduleContent />
    </AppShell>
  )
}
