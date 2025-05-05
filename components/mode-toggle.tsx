"use client"

import { Moon, Sun, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMode } from "@/contexts/mode-context"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { mode, setMode } = useMode()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="mr-2">
          <BookOpen className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Cambiar modo</span>
        </Button>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMode(mode === "normal" ? "estudio" : "normal")}
        className="mr-2"
      >
        <BookOpen className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Cambiar modo</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {theme === "dark" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" /> Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" /> Oscuro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
