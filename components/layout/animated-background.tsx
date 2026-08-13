'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * GPU-friendly ambient background with capital-flow gradients and institutional grid.
 * Communicates asset deployment without sci-fi distraction.
 */
export function AnimatedBackground() {
  const reduced = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Primary teal glow — top left */}
      <div
        className="absolute -top-48 -left-24 size-[44rem] rounded-full opacity-[0.06] blur-[100px] motion-safe:animate-pulse"
        style={{ background: 'oklch(0.62 0.12 168)', animationDuration: '10s' }}
      />
      {/* Secondary accent — middle right */}
      <div
        className="absolute top-1/3 -right-32 size-[38rem] rounded-full opacity-[0.05] blur-[120px] motion-safe:animate-pulse"
        style={{ background: 'oklch(0.55 0.1 165)', animationDuration: '14s', animationDelay: '3s' }}
      />
      {/* Deep base glow — bottom */}
      <div
        className="absolute -bottom-48 left-1/3 size-[40rem] rounded-full opacity-[0.04] blur-[110px] motion-safe:animate-pulse"
        style={{ background: 'oklch(0.45 0.08 160)', animationDuration: '18s', animationDelay: '5s' }}
      />

      {/* Directional capital-flow gradient band */}
      {!reduced && (
        <motion.div
          className="absolute inset-x-0 top-0 h-[480px] opacity-[0.04]"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.78 0.14 165 / 0.15) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Flowing horizontal lines — capital movement */}
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full"
            style={{
              top: `${25 + i * 18}%`,
              background:
                'linear-gradient(90deg, transparent, oklch(0.78 0.14 165 / 0.08), transparent)',
            }}
            animate={{ x: ['-10%', '10%', '-10%'] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'linear' }}
          />
        ))}

      {/* Institutional grid with radial fade */}
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 95% 75% at 50% 10%, black 20%, transparent 85%)',
        }}
      />
    </div>
  )
}
