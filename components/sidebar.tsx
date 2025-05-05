"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMode } from "@/contexts/mode-context"
import { LayoutDashboard, BookText, CheckSquare, BookOpen, Trash2 } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { mode } = useMode()

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
    <div
      className={cn(
        "pb-12 border-r h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col justify-between",
        mode === "estudio" ? "w-16" : "w-64",
        mode === "estudio" && "h-screen",
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className={cn("mb-2 px-2 text-lg font-semibold tracking-tight", mode === "estudio" && "hidden")}>
            Segundo Cerebro
          </h2>
        </div>
        <div className="px-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              target={route.external ? "_blank" : undefined}
              rel={route.external ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                route.active ? "bg-accent" : "transparent",
                mode === "estudio" && "justify-center px-2",
              )}
            >
              <route.icon className={cn("h-5 w-5", route.active ? "text-primary" : "text-muted-foreground")} />
              <span
                className={cn(
                  route.active ? "text-foreground" : "text-muted-foreground",
                  mode === "estudio" && "hidden",
                )}
              >
                {route.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className={cn("px-3 py-4 text-xs text-muted-foreground text-center", mode === "estudio" && "px-1")}>
        <Link
          href="https://www.linkedin.com/in/imanol-valenzuela-eguez/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          {mode === "estudio" ? "ImaaV" : "Hecho por ImaaValenzuela"}
        </Link>
      </div>
    </div>
  )
}
