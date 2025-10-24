import React from 'react'
import { JetBrains_Mono, Chakra_Petch } from 'next/font/google'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import { metadata, viewport } from './metadata'
import './globals.css'
import '../styles/aura-theme.css'
import '../styles/aura-enhanced.css'

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra-petch',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export { metadata, viewport }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased transition-colors duration-200">
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
} 