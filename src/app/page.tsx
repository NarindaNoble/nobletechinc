'use client'

import React from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import About from '@/components/About'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <div className="relative">
      <main className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <Hero />
        <div className="space-y-20">
          <About />
          <Services />
          <Portfolio />
          <Contact />
        </div>
        <Footer />
      </main>
      <ScrollToTop />
    </div>
  )
}
