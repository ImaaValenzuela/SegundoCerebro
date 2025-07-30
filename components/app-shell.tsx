"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMode } from "@/contexts/mode-context"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useMode()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const isStudyMode = mode === "estudio"

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen flex-col theme-transition">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          isStudyMode ? "hidden" : "",
        )}
      >
        <div className="flex h-16 items-center px-4">
          {/* Botón de menú para móviles */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 hover:bg-accent transition-colors hover-scale" 
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          
          <MainNav />
          
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content */}
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            // Padding responsive
            "p-4 md:p-6 lg:p-8",
            // Background con gradiente sutil
            "bg-gradient-to-br from-background to-background/95",
            // En modo estudio, padding reducido
            isStudyMode && "p-2 md:p-4"
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
