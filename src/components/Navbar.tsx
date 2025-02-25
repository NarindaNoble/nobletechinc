'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            NobleTech<span className="text-[var(--accent)]">Inc</span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--text-primary)]/10"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              About
            </Link>
            <Link href="#services" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Services
            </Link>
            <Link href="#portfolio" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Portfolio
            </Link>
            <Link href="#contact" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Contact
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link
              href="#about"
              className="block px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded-lg"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="#services"
              className="block px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded-lg"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              href="#portfolio"
              className="block px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded-lg"
              onClick={toggleMenu}
            >
              Portfolio
            </Link>
            <Link
              href="#contact"
              className="block px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded-lg"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <button
              onClick={() => {
                toggleTheme()
                toggleMenu()
              }}
              className="w-full text-left px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded-lg flex items-center space-x-2"
            >
              <span>Theme</span>
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
} 