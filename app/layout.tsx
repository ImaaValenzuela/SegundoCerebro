import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeProvider } from "@/contexts/mode-context"
import { DataProvider } from "@/contexts/data-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Segundo Cerebro | Para estudiantes de informática",
  description: "Tu asistente personal para estudiar mejor y procrastinar menos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="segundo-cerebro-theme"
        >
          <AuthProvider>
            <ModeProvider>
              <DataProvider>
                {children}
                <Toaster />
              </DataProvider>
            </ModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
