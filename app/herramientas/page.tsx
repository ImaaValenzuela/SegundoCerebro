import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { ToolsContent } from "@/components/tools-content"

export const metadata: Metadata = {
  title: "Herramientas | Segundo Cerebro",
  description: "Herramientas útiles para estudiantes de informática",
}

export default function ToolsPage() {
  return (
    <AppShell>
      <ToolsContent />
    </AppShell>
  )
}
