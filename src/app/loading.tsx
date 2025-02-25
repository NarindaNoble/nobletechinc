import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 rounded-full border-4 border-[var(--text-primary)]/20 border-t-[var(--accent)] animate-spin" />
        
        {/* Inner circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--text-primary)]/10 border-t-[var(--accent)]/70 animate-spin" />
        </div>
      </div>
    </div>
  )
} 