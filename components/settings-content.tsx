"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useMode } from "@/contexts/mode-context"
import { User, Bell, Palette, Clock, Database, Download, Upload, Trash2 } from "lucide-react"

export function SettingsContent() {
  const { toast } = useToast()
  const { mode, setMode } = useMode()
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: true,
      reminders: true,
    },
    appearance: {
      theme: "system",
      fontSize: "medium",
      reducedMotion: false,
    },
    pomodoro: {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
    },
    privacy: {
      saveHistory: true,
      collectAnalytics: false,
      shareUsageData: false,
    },
  })

  const handleSaveSettings = () => {
    toast({
      title: "Ajustes guardados",
      description: "Tus ajustes han sido guardados correctamente",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Datos exportados",
      description: "Tus datos han sido exportados correctamente",
    })
  }

  const handleImportData = () => {
    toast({
      title: "Datos importados",
      description: "Tus datos han sido importados correctamente",
    })
  }

  const handleDeleteData = () => {
    toast({
      title: "Datos eliminados",
      description: "Tus datos han sido eliminados correctamente",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ajustes</h2>
      </div>

      <Tabs defaultValue="cuenta" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="cuenta" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Cuenta
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notificaciones
          </TabsTrigger>
          <TabsTrigger value="apariencia" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Apariencia
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Pomodoro
          </TabsTrigger>
          <TabsTrigger value="datos" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Datos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cuenta">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Gestiona tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Tu nombre" defaultValue="Usuario" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" defaultValue="usuario@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificaciones por email</Label>
                  <p className="text-sm text-muted-foreground">Recibe recordatorios y actualizaciones por email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="desktop-notifications">Notificaciones de escritorio</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas en tu navegador</p>
                </div>
                <Switch
                  id="desktop-notifications"
                  checked={settings.notifications.desktop}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, desktop: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder-notifications">Recordatorios</Label>
                  <p className="text-sm text-muted-foreground">Recibe recordatorios para tareas pendientes</p>
                </div>
                <Switch
                  id="reminder-notifications"
                  checked={settings.notifications.reminders}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, reminders: checked },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <select
                  id="theme"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.appearance.theme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, theme: e.target.value },
                    })
                  }
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Tamaño de fuente</Label>
                <select
                  id="font-size"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.appearance.fontSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, fontSize: e.target.value },
                    })
                  }
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Movimiento reducido</Label>
                  <p className="text-sm text-muted-foreground">Reduce las animaciones en la interfaz</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.appearance.reducedMotion}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, reducedMotion: checked },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Modo predeterminado</Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <Button
                    variant={mode === "normal" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setMode("normal")}
                  >
                    Normal
                  </Button>
                  <Button
                    variant={mode === "estudio" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setMode("estudio")}
                  >
                    Estudio
                  </Button>
                  <Button
                    variant={mode === "trabajo" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setMode("trabajo")}
                  >
                    Trabajo
                  </Button>
                  <Button
                    variant={mode === "ocio" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setMode("ocio")}
                  >
                    Ocio
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pomodoro">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pomodoro</CardTitle>
              <CardDescription>Personaliza los tiempos de la técnica Pomodoro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="work-duration">Duración de trabajo (minutos)</Label>
                <Input
                  id="work-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoro.workDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pomodoro: { ...settings.pomodoro, workDuration: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="break-duration">Duración de descanso (minutos)</Label>
                <Input
                  id="break-duration"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.pomodoro.breakDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pomodoro: { ...settings.pomodoro, breakDuration: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break-duration">Duración de descanso largo (minutos)</Label>
                <Input
                  id="long-break-duration"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.pomodoro.longBreakDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pomodoro: { ...settings.pomodoro, longBreakDuration: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break-interval">Intervalo de descanso largo (ciclos)</Label>
                <Input
                  id="long-break-interval"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.pomodoro.longBreakInterval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pomodoro: { ...settings.pomodoro, longBreakInterval: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="datos">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de datos</CardTitle>
                <CardDescription>Exporta, importa o elimina tus datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" /> Exportar todos los datos
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={handleImportData}>
                    <Upload className="mr-2 h-4 w-4" /> Importar datos
                  </Button>
                  <Button variant="destructive" className="justify-start" onClick={handleDeleteData}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar todos los datos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacidad</CardTitle>
                <CardDescription>Configura tus preferencias de privacidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-history">Guardar historial</Label>
                    <p className="text-sm text-muted-foreground">Guarda tu historial de actividad</p>
                  </div>
                  <Switch
                    id="save-history"
                    checked={settings.privacy.saveHistory}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, saveHistory: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="collect-analytics">Recopilar analíticas</Label>
                    <p className="text-sm text-muted-foreground">Recopila datos anónimos para mejorar la aplicación</p>
                  </div>
                  <Switch
                    id="collect-analytics"
                    checked={settings.privacy.collectAnalytics}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, collectAnalytics: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-usage-data">Compartir datos de uso</Label>
                    <p className="text-sm text-muted-foreground">
                      Comparte datos de uso para ayudar a mejorar la aplicación
                    </p>
                  </div>
                  <Switch
                    id="share-usage-data"
                    checked={settings.privacy.shareUsageData}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, shareUsageData: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Guardar cambios</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
