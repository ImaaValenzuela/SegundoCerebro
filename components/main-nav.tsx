"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMode } from "@/contexts/mode-context"

export function MainNav() {
  const pathname = usePathname()
  const { mode } = useMode()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/notas",
      label: "Notas",
      active: pathname === "/notas",
    },
    {
      href: "/tareas",
      label: "Tareas",
      active: pathname === "/tareas",
    },
    {
      href: "/estudio",
      label: "Modo Estudio",
      active: pathname === "/estudio",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", mode === "estudio" ? "hidden" : "")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary font-semibold" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
