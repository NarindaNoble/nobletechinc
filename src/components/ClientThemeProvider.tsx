'use client'

import React from 'react'
import { ThemeProvider } from '@/context/ThemeContext'

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--background)]">
        {children}
      </div>
    </ThemeProvider>
  )
} 