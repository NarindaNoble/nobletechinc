'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const projects = [
  {
    title: 'AI Analytics Platform',
    description: 'Advanced analytics platform powered by machine learning',
    category: 'Artificial Intelligence',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    title: 'Smart City Infrastructure',
    description: 'IoT-based smart city management system',
    category: 'IoT Solutions',
    gradient: 'from-green-600 to-teal-600'
  },
  {
    title: 'E-Commerce Platform',
    description: 'Scalable e-commerce solution with AI recommendations',
    category: 'Web Development',
    gradient: 'from-orange-600 to-red-600'
  },
  {
    title: 'FinTech Mobile App',
    description: 'Secure mobile banking and investment platform',
    category: 'Mobile Development',
    gradient: 'from-indigo-600 to-blue-600'
  },
  {
    title: 'Cloud Migration',
    description: 'Enterprise-scale cloud infrastructure transformation',
    category: 'Cloud Solutions',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Cybersecurity Suite',
    description: 'Advanced threat detection and prevention system',
    category: 'Cybersecurity',
    gradient: 'from-red-600 to-orange-600'
  }
]

export default function Portfolio() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="portfolio" className="py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-[var(--accent)]">Portfolio</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Explore our successful projects and innovative solutions that have helped
            businesses achieve their digital transformation goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 transition-all cursor-pointer"
            >
              <div className="aspect-video relative">
                <div className={`absolute inset-0 bg-gradient-to-br opacity-80 ${project.gradient}`} />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <div className="p-6 relative z-20">
                <span className="text-sm text-[var(--accent)] font-medium mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 