"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useMode } from "@/contexts/mode-context"
import { LayoutDashboard, BookText, CheckSquare, BookOpen, Trash2, Calendar, GraduationCap, ChevronRight, Menu, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { mode } = useMode()
  const isMobile = useMobile()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // En modo estudio, la barra siempre está colapsada
  const isStudyMode = mode === "estudio"
  
  // En móviles, usar el estado expandido
  const shouldExpand = isMobile ? isOpen : (isHovered || isExpanded)
  
  // Ancho de la barra
  const sidebarWidth = isStudyMode ? "w-16" : shouldExpand ? "w-64" : "w-16"

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/notas",
      label: "Notas",
      icon: BookText,
      active: pathname === "/notas",
    },
    {
      href: "/tareas",
      label: "Tareas",
      icon: CheckSquare,
      active: pathname === "/tareas",
    },
    {
      href: "/calendario",
      label: "Calendario",
      icon: Calendar,
      active: pathname === "/calendario",
    },
    {
      href: "/examenes",
      label: "Exámenes",
      icon: GraduationCap,
      active: pathname === "/examenes",
    },
    {
      href: "/estudio",
      label: "Modo Estudio",
      icon: BookOpen,
      active: pathname === "/estudio",
    },
    {
      href: "https://mibasurero.netlify.app/",
      label: "Basurero",
      icon: Trash2,
      active: false,
      external: true,
    },
  ]

  return (
    <>
      {/* Botón flotante para móviles */}
      {isMobile && !isStudyMode && (
        <Button
          onClick={onToggle}
          className={cn(
            "fixed bottom-4 right-4 z-50 rounded-full shadow-lg hover-scale transition-all duration-200",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "w-12 h-12 p-0"
          )}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      <div
        className={cn(
          "relative border-r bg-background/95 backdrop-blur-custom transition-all duration-300 ease-in-out flex flex-col justify-between shadow-lg",
          sidebarWidth,
          isStudyMode ? "h-screen" : "h-[calc(100vh-4rem)]",
          // En móviles, posicionamiento absoluto
          isMobile && "absolute left-0 top-0 z-40 h-screen shadow-2xl",
          // Animación de entrada
          shouldExpand ? "sidebar-expand" : "sidebar-collapse",
          // En móviles, ocultar cuando está cerrado
          isMobile && !isOpen && "hidden"
        )}
        onMouseEnter={() => !isMobile && !isStudyMode && setIsHovered(true)}
        onMouseLeave={() => !isMobile && !isStudyMode && setIsHovered(false)}
      >
        {/* Overlay para móviles */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-in fade-in duration-200"
            onClick={onToggle}
          />
        )}

        <div className="space-y-4 py-4 flex-1 custom-scrollbar">
          {/* Header */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <h2 
                className={cn(
                  "text-lg font-semibold tracking-tight transition-all duration-300 fade-in-left",
                  shouldExpand ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                  isStudyMode && "hidden"
                )}
              >
                Segundo Cerebro
              </h2>
              {/* Botón de expandir/colapsar */}
              {!isStudyMode && !isMobile && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "p-1 rounded-md hover:bg-accent hover-scale transition-all duration-200",
                    shouldExpand ? "opacity-100" : "opacity-0"
                  )}
                >
                  <ChevronRight 
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )} 
                  />
                </button>
              )}
            </div>
          </div>

          {/* Navegación */}
          <div className="px-3 space-y-1">
            {routes.map((route, index) => (
              <div key={route.href} className="relative">
                {/* Indicador de página activa */}
                {route.active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full animate-pulse" />
                )}
                
                <Link
                  href={route.href}
                  target={route.external ? "_blank" : undefined}
                  rel={route.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover-scale nav-item-hover glow-on-hover relative",
                    route.active 
                      ? "bg-accent text-foreground shadow-sm border-l-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground",
                    shouldExpand ? "justify-start" : "justify-center",
                    isStudyMode && "justify-center"
                  )}
                  title={!shouldExpand ? route.label : undefined}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => isMobile && onToggle?.()}
                >
                  <route.icon 
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                      route.active ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                  <span
                    className={cn(
                      "transition-all duration-300 whitespace-nowrap fade-in-left",
                      shouldExpand ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                      isStudyMode && "hidden"
                    )}
                  >
                    {route.label}
                  </span>
                  
                  {/* Badge para enlaces externos */}
                  {route.external && shouldExpand && (
                    <span className="ml-auto text-xs text-muted-foreground opacity-60">
                      ↗
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "px-3 py-4 text-xs text-muted-foreground text-center transition-all duration-300 fade-in-up",
          shouldExpand ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          isStudyMode && "px-1"
        )}>
          <Link
            href="https://www.linkedin.com/in/imanol-valenzuela-eguez/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors hover-lift inline-block"
            title={!shouldExpand ? "Hecho por ImaaValenzuela" : undefined}
          >
            {isStudyMode ? "ImaaV" : shouldExpand ? "Hecho por ImaaValenzuela" : "ImaaV"}
          </Link>
        </div>

        {/* Indicador de hover para desktop */}
        {!isMobile && !isStudyMode && !shouldExpand && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-primary/20 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    </>
  )
}
