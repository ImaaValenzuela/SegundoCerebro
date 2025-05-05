"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/data-context"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { GraduationCap, Plus, Check, X, Target, Lightbulb, List, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

type Priority = "alta" | "media" | "baja"

interface Exam {
    subject: string
    date: string
    goal: string
    reality: string
    options: string[]
    wayForward: string
    priority: Priority
  }

export function ExamScheduleContent() {
    const { toast } = useToast()
    const { exams, addExam, updateExam, deleteExam, toggleExamCompletion } = useData()
  
    const [activeTab, setActiveTab] = useState("todos")
    const [showExamForm, setShowExamForm] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedExam, setSelectedExam] = useState<string | null>(null)
  
    const [newExam, setNewExam] = useState<Exam>({
      subject: "",
      date: "",
      goal: "",
      reality: "",
      options: [""],
      wayForward: "",
      priority: "media",
    })

  const handleAddOption = () => {
    setNewExam({
      ...newExam,
      options: [...newExam.options, ""],
    })
  }

  const handleChangeOption = (index: number, value: string) => {
    const updatedOptions = [...newExam.options]
    updatedOptions[index] = value
    setNewExam({
      ...newExam,
      options: updatedOptions,
    })
  }

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...newExam.options]
    updatedOptions.splice(index, 1)
    setNewExam({
      ...newExam,
      options: updatedOptions,
    })
  }

  const handleNextStep = () => {
    // Validación por paso
    if (currentStep === 1) {
      if (!newExam.subject.trim() || !newExam.date) {
        toast({
          title: "Error",
          description: "La asignatura y la fecha son obligatorias",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      if (!newExam.goal.trim()) {
        toast({
          title: "Error",
          description: "El objetivo es obligatorio",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 3) {
      if (!newExam.reality.trim()) {
        toast({
          title: "Error",
          description: "La realidad actual es obligatoria",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 4) {
      if (newExam.options.length === 0 || newExam.options.some((option) => !option.trim())) {
        toast({
          title: "Error",
          description: "Debes añadir al menos una opción válida",
          variant: "destructive",
        })
        return
      }
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveExam = () => {
    if (!newExam.wayForward.trim()) {
      toast({
        title: "Error",
        description: "El plan de acción es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (selectedExam) {
      updateExam(selectedExam, newExam)
      toast({
        title: "Examen actualizado",
        description: "El examen ha sido actualizado correctamente",
      })
    } else {
      addExam(newExam)
      toast({
        title: "Examen añadido",
        description: "El examen ha sido añadido correctamente",
      })
    }

    setNewExam({
      subject: "",
      date: "",
      goal: "",
      reality: "",
      options: [""],
      wayForward: "",
      priority: "media",
    })
    setShowExamForm(false)
    setSelectedExam(null)
    setCurrentStep(1)
  }

  const handleEditExam = (examId: string) => {
    const exam = exams.find((e) => e.id === examId)
    if (exam) {
      setNewExam({
        subject: exam.subject,
        date: exam.date.split("T")[0], // Extraer solo la fecha
        goal: exam.goal,
        reality: exam.reality,
        options: exam.options,
        wayForward: exam.wayForward,
        priority: exam.priority,
      })
      setSelectedExam(examId)
      setShowExamForm(true)
      setCurrentStep(1)
    }
  }

  const handleDeleteExam = (examId: string) => {
    deleteExam(examId)
    toast({
      title: "Examen eliminado",
      description: "El examen ha sido eliminado correctamente",
    })
  }

  const handleToggleCompletion = (examId: string) => {
    toggleExamCompletion(examId)
  }

  const filteredExams = exams.filter((exam) => {
    if (activeTab === "todos") return true
    if (activeTab === "pendientes") return !exam.completed
    if (activeTab === "completados") return exam.completed
    return true
  })

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Asignatura
              </label>
              <Input
                id="subject"
                placeholder="Nombre de la asignatura"
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Fecha del examen
              </label>
              <Input
                id="date"
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Prioridad
              </label>
              <Select
                value={newExam.priority}
                onValueChange={(value: "alta" | "media" | "baja") => setNewExam({ ...newExam, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Goal (Objetivo)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Define claramente qué quieres lograr con este examen. ¿Qué nota aspiras a conseguir? ¿Qué conocimientos
              quieres demostrar?
            </p>
            <div className="space-y-2">
              <label htmlFor="goal" className="text-sm font-medium">
                Tu objetivo
              </label>
              <Textarea
                id="goal"
                placeholder="Ej: Obtener una calificación de 8 o superior y demostrar dominio de los conceptos clave..."
                rows={6}
                value={newExam.goal}
                onChange={(e) => setNewExam({ ...newExam, goal: e.target.value })}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Reality (Realidad)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Evalúa tu situación actual. ¿Qué conocimientos ya tienes? ¿Qué te falta por aprender? ¿Cuánto tiempo
              dispones?
            </p>
            <div className="space-y-2">
              <label htmlFor="reality" className="text-sm font-medium">
                Tu situación actual
              </label>
              <Textarea
                id="reality"
                placeholder="Ej: Tengo buen dominio de los temas 1-3, pero necesito reforzar los temas 4-6. Dispongo de 2 semanas para preparar el examen..."
                rows={6}
                value={newExam.reality}
                onChange={(e) => setNewExam({ ...newExam, reality: e.target.value })}
              />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <List className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Options (Opciones)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enumera todas las estrategias y recursos que podrías utilizar para prepararte. ¿Qué métodos de estudio
              funcionan mejor para ti?
            </p>
            {newExam.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Opción ${index + 1}`}
                  value={option}
                  onChange={(e) => handleChangeOption(index, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                  disabled={newExam.options.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddOption} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Añadir opción
            </Button>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Way Forward (Plan de acción)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Define tu plan concreto. ¿Qué vas a hacer exactamente? ¿Cuándo? ¿Cómo medirás tu progreso?
            </p>
            <div className="space-y-2">
              <label htmlFor="wayForward" className="text-sm font-medium">
                Tu plan de acción
              </label>
              <Textarea
                id="wayForward"
                placeholder="Ej: Dedicaré 2 horas diarias a estudiar, empezando por los temas más difíciles. Haré resúmenes de cada tema y realizaré exámenes de práctica cada 3 días..."
                rows={6}
                value={newExam.wayForward}
                onChange={(e) => setNewExam({ ...newExam, wayForward: e.target.value })}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex flex-col items-center ${
              step < currentStep ? "text-primary" : step === currentStep ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step === currentStep
                    ? "border-2 border-primary"
                    : "border border-muted-foreground"
              }`}
            >
              {step < currentStep ? <Check className="h-4 w-4" /> : step}
            </div>
            <span className="text-xs hidden md:block">
              {step === 1
                ? "Datos"
                : step === 2
                  ? "Goal"
                  : step === 3
                    ? "Reality"
                    : step === 4
                      ? "Options"
                      : "Way Forward"}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Exámenes</h2>
        <Button onClick={() => setShowExamForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo examen
        </Button>
      </div>

      {showExamForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedExam ? "Editar examen" : "Nuevo examen"}</CardTitle>
            <CardDescription>Utiliza el método GROW para planificar tu preparación para el examen</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepIndicator()}
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  Anterior
                </Button>
              )}
            </div>
            <div>
              {currentStep < 5 ? (
                <Button onClick={handleNextStep}>Siguiente</Button>
              ) : (
                <Button onClick={handleSaveExam}>Guardar</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="completados">Completados</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {filteredExams.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredExams.map((exam) => (
                    <Card key={exam.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`exam-${exam.id}`}
                              checked={exam.completed}
                              onCheckedChange={() => handleToggleCompletion(exam.id)}
                            />
                            <CardTitle className={exam.completed ? "line-through text-muted-foreground" : ""}>
                              {exam.subject}
                            </CardTitle>
                          </div>
                          <Badge
                            variant={
                              exam.priority === "alta"
                                ? "destructive"
                                : exam.priority === "media"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {exam.priority}
                          </Badge>
                        </div>
                        <CardDescription>
                          {format(parseISO(exam.date), "d 'de' MMMM, yyyy", { locale: es })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <Target className="h-3 w-3" /> Goal
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{exam.goal}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" /> Plan
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{exam.wayForward}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditExam(exam.id)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteExam(exam.id)}>
                          Eliminar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay exámenes {activeTab !== "todos" && activeTab}</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "todos"
                      ? "Añade tu primer examen para empezar a planificar"
                      : activeTab === "pendientes"
                        ? "No tienes exámenes pendientes"
                        : "No tienes exámenes completados"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
