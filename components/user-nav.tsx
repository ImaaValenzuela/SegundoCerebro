"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function UserNav() {
  const { toast } = useToast()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Usuario</p>
            <p className="text-xs leading-none text-muted-foreground">usuario@ejemplo.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              toast({
                title: "Perfil",
                description: "Esta función estará disponible próximamente.",
              })
            }}
          >
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toast({
                title: "Estadísticas",
                description: "Esta función estará disponible próximamente.",
              })
            }}
          >
            Estadísticas
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window.location.href = "/ajustes"
            }}
          >
            Ajustes
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toast({
              title: "Cerrar sesión",
              description: "Esta función estará disponible próximamente.",
            })
          }}
        >
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
