'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  CodeBracketIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies',
    icon: CodeBracketIcon
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable and secure cloud infrastructure services',
    icon: CloudIcon
  },
  {
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications',
    icon: DevicePhoneMobileIcon
  },
  {
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by advanced algorithms',
    icon: CpuChipIcon
  },
  {
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions and consulting',
    icon: ShieldCheckIcon
  },
  {
    title: 'Data Analytics',
    description: 'Advanced data analysis and visualization',
    icon: ChartBarIcon
  }
]

export default function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="services" className="py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-[var(--accent)]">Services</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            We offer a comprehensive range of technology solutions to help your business
            thrive in the digital age.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-6 rounded-2xl bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 transition-all hover:scale-105 cursor-pointer"
            >
              <service.icon className="w-12 h-12 text-[var(--accent)] mb-4" />
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-[var(--text-secondary)]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 