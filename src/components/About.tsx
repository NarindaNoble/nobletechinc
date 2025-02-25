'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const features = [
  {
    title: 'Innovation',
    description: 'Pushing boundaries with cutting-edge technology solutions',
    icon: '🚀'
  },
  {
    title: 'Excellence',
    description: 'Delivering exceptional quality in every project',
    icon: '✨'
  },
  {
    title: 'Collaboration',
    description: 'Working closely with clients to achieve their goals',
    icon: '🤝'
  },
  {
    title: 'Expertise',
    description: 'Years of experience in diverse technology domains',
    icon: '💡'
  }
]

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="about" className="py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About <span className="text-[var(--accent)]">Us</span>
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            We are a team of passionate technologists dedicated to transforming businesses
            through innovative digital solutions. Our expertise spans across multiple domains,
            ensuring comprehensive solutions for our clients.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.2,
                    duration: 0.6
                  }
                }
              }}
              className="p-6 rounded-2xl bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-[var(--text-secondary)]">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 