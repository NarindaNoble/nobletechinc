'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: 'Email',
    content: 'contact@nobletechinc.com',
    link: 'mailto:contact@nobletechinc.com'
  },
  {
    icon: PhoneIcon,
    title: 'Phone',
    content: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  },
  {
    icon: MapPinIcon,
    title: 'Location',
    content: 'San Francisco, CA',
    link: 'https://maps.google.com'
  }
]

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="text-[var(--accent)]">Touch</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Ready to start your digital transformation journey? Contact us today and
            let's discuss how we can help your business grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-[var(--text-primary)]/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.link}
                    className="flex items-center space-x-4 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-[var(--text-primary)]/10 group-hover:bg-[var(--accent)]/10 transition-colors">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{info.title}</p>
                      <p className="text-sm">{info.content}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[var(--text-primary)]/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li className="flex items-center space-x-2">
                  <ArrowRightIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>Expert team with proven track record</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRightIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>Customized solutions for your needs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRightIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>24/7 support and maintenance</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-[var(--text-primary)]/5 p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--text-primary)]/10 focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--text-primary)]/10 focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--text-primary)]/10 focus:border-[var(--accent)] focus:outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--text-primary)]/10 focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-8 py-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors font-medium"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 