'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HomeIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-8xl font-bold mb-4 text-[var(--accent)]"
        >
          404
        </motion.h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-[var(--text-secondary)] mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
} 