"use client"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CalendarEvent } from "@/contexts/data-context"

interface CalendarViewProps {
  currentMonth: Date
  events: CalendarEvent[]
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
}

export function CalendarView({ currentMonth, events, onSelectDate, selectedDate }: CalendarViewProps) {
  const renderHeader = () => {
    const dateFormat = "EEEE"
    const days = []
    const startDate = startOfWeek(startOfMonth(currentMonth))

    for (let i = 0; i < 7; i++) {
      const day = format(addDays(startDate, i), dateFormat, { locale: es })
      days.push(
        <div key={i} className="text-center font-medium py-2">
          {day.charAt(0).toUpperCase() + day.slice(1, 3)}
        </div>,
      )
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d")
        const cloneDay = day
        const dayEvents = events.filter((event) => {
          const eventDate = parseISO(event.date)
          return isSameDay(eventDate, cloneDay)
        })

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-24 border p-1 relative",
              !isSameMonth(day, monthStart) && "bg-muted text-muted-foreground",
              isSameDay(day, selectedDate as Date) && "bg-accent",
              "cursor-pointer hover:bg-accent/50 transition-colors",
            )}
            onClick={() => onSelectDate(cloneDay)}
          >
            <div className="text-right">{formattedDate}</div>
            <div className="overflow-y-auto max-h-16 mt-1">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className={cn(
                    "text-xs p-1 mb-1 rounded truncate",
                    event.type === "tarea" && "bg-blue-100 dark:bg-blue-900",
                    event.type === "entrega" && "bg-red-100 dark:bg-red-900",
                    event.type === "proyecto" && "bg-green-100 dark:bg-green-900",
                    event.type === "otro" && "bg-gray-100 dark:bg-gray-800",
                  )}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} más</div>
              )}
            </div>
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>,
      )
      days = []
    }
    return <div className="mb-2">{rows}</div>
  }

  return (
    <div className="calendar">
      {renderHeader()}
      {renderCells()}
    </div>
  )
}
