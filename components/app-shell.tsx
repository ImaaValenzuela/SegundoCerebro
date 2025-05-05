"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMode } from "@/contexts/mode-context"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useMode()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  return (
    <div className="flex min-h-screen flex-col theme-transition">
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background transition-colors duration-300",
          mode === "estudio" ? "hidden" : "",
        )}
      >
        <div className="flex h-16 items-center px-4">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background transition-colors duration-300">{children}</main>
      </div>
    </div>
  )
}
