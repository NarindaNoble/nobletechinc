'use client'

import React from 'react'
import { motion } from 'framer-motion'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 tech-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgb(var(--background-rgb))]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          <motion.div variants={fadeIn} className="inline-block">
            <span className="mono text-sm bg-[rgba(var(--accent-rgb),0.1)] text-[rgb(var(--accent-rgb))] px-4 py-2 rounded-full border border-[rgba(var(--accent-rgb),0.2)]">
              {'</'} WELCOME TO THE FUTURE {'>'}
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl tech-text mb-6 relative"
          >
            Transforming Ideas into{' '}
            <div className="glitch-text inline-block" data-text="Digital Excellence">
              <span className="text-gradient">Digital Excellence</span>
            </div>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-[rgb(var(--accent-rgb))]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="cyber-text text-xl text-[rgb(var(--text-secondary-rgb))] max-w-2xl mx-auto mb-8"
          >
            We specialize in delivering cutting-edge technology solutions that drive
            innovation and accelerate business growth.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#contact"
              className="btn btn-primary group mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {'>'} Get Started
              <motion.span
                className="absolute inset-0 bg-[rgba(var(--accent-rgb),0.2)]"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
            <motion.a
              href="#services"
              className="btn btn-secondary group mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {'>'} Our Services
              <motion.span
                className="absolute inset-0 bg-[rgba(var(--accent-secondary-rgb),0.1)]"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 