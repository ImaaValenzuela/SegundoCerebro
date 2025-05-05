import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { SettingsContent } from "@/components/settings-content"

export const metadata: Metadata = {
  title: "Ajustes | Segundo Cerebro",
  description: "Personaliza tu experiencia",
}

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  )
}
