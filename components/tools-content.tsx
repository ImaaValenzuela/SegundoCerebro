"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Code, Calculator, FileCode, Copy, Save, Trash2, Play } from "lucide-react"

export function ToolsContent() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("snippets")
  const [showNewSnippet, setShowNewSnippet] = useState(false)
  const [newSnippet, setNewSnippet] = useState({ title: "", language: "javascript", code: "" })
  const [regexInput, setRegexInput] = useState("")
  const [regexPattern, setRegexPattern] = useState("")
  const [regexFlags, setRegexFlags] = useState("g")
  const [regexResult, setRegexResult] = useState<string[]>([])
  const [binaryInput, setBinaryInput] = useState("")
  const [binaryResult, setBinaryResult] = useState("")
  const [sandboxCode, setSandboxCode] = useState("// Escribe tu código JavaScript aquí\nconsole.log('Hola mundo!');")
  const [sandboxOutput, setSandboxOutput] = useState("")

  const demoSnippets = [
    {
      id: 1,
      title: "QuickSort",
      language: "javascript",
      code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
      date: "Hace 2 días",
    },
    {
      id: 2,
      title: "Consulta SQL para usuarios recientes",
      language: "sql",
      code: `SELECT * FROM users
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;`,
      date: "Hace 1 semana",
    },
    {
      id: 3,
      title: "Función para validar email",
      language: "javascript",
      code: `function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}`,
      date: "Hace 2 semanas",
    },
  ]

  const handleCreateSnippet = () => {
    if (newSnippet.title.trim() === "" || newSnippet.code.trim() === "") {
      toast({
        title: "Error",
        description: "El título y el código son obligatorios",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Snippet creado",
      description: "Tu snippet ha sido creado correctamente",
    })

    setNewSnippet({ title: "", language: "javascript", code: "" })
    setShowNewSnippet(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
    })
  }

  const testRegex = () => {
    try {
      if (!regexPattern) {
        setRegexResult([])
        return
      }

      const regex = new RegExp(regexPattern, regexFlags)
      const matches = regexInput.match(regex)

      if (matches) {
        setRegexResult(matches)
      } else {
        setRegexResult([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Expresión regular inválida",
        variant: "destructive",
      })
    }
  }

  const convertBinary = () => {
    try {
      // Detectar si es binario, decimal o hexadecimal
      if (/^[01]+$/.test(binaryInput)) {
        // Binario a decimal
        setBinaryResult(Number.parseInt(binaryInput, 2).toString())
      } else if (/^[0-9]+$/.test(binaryInput)) {
        // Decimal a binario
        setBinaryResult(Number.parseInt(binaryInput, 10).toString(2))
      } else if (/^0x[0-9A-Fa-f]+$/.test(binaryInput)) {
        // Hexadecimal a decimal
        setBinaryResult(Number.parseInt(binaryInput.substring(2), 16).toString())
      } else {
        toast({
          title: "Error",
          description: "Formato no reconocido",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo convertir el valor",
        variant: "destructive",
      })
    }
  }

  const runSandboxCode = () => {
    try {
      // Crear un entorno seguro para ejecutar el código
      const originalConsoleLog = console.log
      let output = ""

      // Reemplazar console.log para capturar la salida
      console.log = (...args) => {
        output += args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ") + "\n"
      }

      // Ejecutar el código
      try {
        eval(sandboxCode)
        setSandboxOutput(output)
      } catch (error) {
        setSandboxOutput(`Error: ${error.message}`)
      }

      // Restaurar console.log
      console.log = originalConsoleLog
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo ejecutar el código",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Actualizar el hash de la URL cuando cambia la pestaña
    if (typeof window !== "undefined") {
      window.location.hash = activeTab
    }
  }, [activeTab])

  useEffect(() => {
    // Detectar el hash de la URL al cargar
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "")
      if (hash && ["snippets", "calculadoras", "sandbox"].includes(hash)) {
        setActiveTab(hash)
      }
    }
  }, [])

  const filteredSnippets = demoSnippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Herramientas</h2>
        <div className="flex items-center gap-2">
          {activeTab === "snippets" && (
            <Button onClick={() => setShowNewSnippet(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo snippet
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar herramientas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="snippets" id="snippets">
            <Code className="mr-2 h-4 w-4" /> Snippets
          </TabsTrigger>
          <TabsTrigger value="calculadoras" id="calculadoras">
            <Calculator className="mr-2 h-4 w-4" /> Calculadoras
          </TabsTrigger>
          <TabsTrigger value="sandbox" id="sandbox">
            <FileCode className="mr-2 h-4 w-4" /> Sandbox
          </TabsTrigger>
        </TabsList>

        <TabsContent value="snippets" className="space-y-4">
          {showNewSnippet ? (
            <Card>
              <CardHeader>
                <CardTitle>Nuevo snippet</CardTitle>
                <CardDescription>Guarda fragmentos de código para usar más tarde</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="title"
                    placeholder="Título del snippet"
                    value={newSnippet.title}
                    onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="language" className="text-sm font-medium">
                    Lenguaje
                  </label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newSnippet.language}
                    onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Código
                  </label>
                  <Textarea
                    id="code"
                    placeholder="Escribe tu código aquí..."
                    rows={10}
                    className="font-mono"
                    value={newSnippet.code}
                    onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewSnippet(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateSnippet}>Guardar snippet</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSnippets.length > 0 ? (
                filteredSnippets.map((snippet) => (
                  <Card key={snippet.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{snippet.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard(snippet.code)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copiar</span>
                        </Button>
                      </div>
                      <CardDescription>{snippet.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs font-mono">{snippet.code}</pre>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-xs text-muted-foreground">{snippet.language}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Save className="h-4 w-4" />
                          <span className="sr-only">Guardar</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Code className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No se encontraron snippets</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "Intenta con otra búsqueda" : "Crea tu primer snippet para empezar"}
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calculadoras" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tester de Regex</CardTitle>
                <CardDescription>Prueba expresiones regulares</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="regex-pattern" className="text-sm font-medium">
                    Patrón
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="regex-pattern"
                      placeholder="Expresión regular"
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                    />
                    <Input
                      placeholder="Flags"
                      className="w-20"
                      value={regexFlags}
                      onChange={(e) => setRegexFlags(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="regex-input" className="text-sm font-medium">
                    Texto
                  </label>
                  <Textarea
                    id="regex-input"
                    placeholder="Texto para probar"
                    rows={5}
                    value={regexInput}
                    onChange={(e) => setRegexInput(e.target.value)}
                  />
                </div>
                <Button onClick={testRegex}>Probar</Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resultados</label>
                  <div className="bg-muted p-2 rounded-md min-h-[100px] overflow-auto">
                    {regexResult.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {regexResult.map((match, index) => (
                          <li key={index} className="text-sm font-mono">
                            {match}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay coincidencias</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversor Binario/Decimal/Hex</CardTitle>
                <CardDescription>Convierte entre sistemas numéricos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="binary-input" className="text-sm font-medium">
                    Entrada
                  </label>
                  <Input
                    id="binary-input"
                    placeholder="Ingresa un número (binario, decimal o hex con 0x)"
                    value={binaryInput}
                    onChange={(e) => setBinaryInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Binario: 10101, Decimal: 42, Hexadecimal: 0x2A</p>
                </div>
                <Button onClick={convertBinary}>Convertir</Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resultado</label>
                  <div className="bg-muted p-2 rounded-md overflow-auto">
                    <p className="text-sm font-mono">{binaryResult}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sandbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JavaScript Sandbox</CardTitle>
              <CardDescription>Prueba código JavaScript en tiempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="sandbox-code" className="text-sm font-medium">
                  Código
                </label>
                <Textarea
                  id="sandbox-code"
                  rows={10}
                  className="font-mono"
                  value={sandboxCode}
                  onChange={(e) => setSandboxCode(e.target.value)}
                />
              </div>
              <Button onClick={runSandboxCode}>
                <Play className="mr-2 h-4 w-4" /> Ejecutar
              </Button>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salida</label>
                <div className="bg-muted p-2 rounded-md min-h-[100px] overflow-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{sandboxOutput}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
