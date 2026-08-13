'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface PointerCardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
  layoutId?: string
  delay?: number
  onClick?: () => void
}

export function PointerCard({
  children,
  className,
  as = 'div',
  layoutId,
  delay = 0,
  onClick,
}: PointerCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      ref.current.style.setProperty('--pointer-x', `${x}px`)
      ref.current.style.setProperty('--pointer-y', `${y}px`)
    },
    [reduced],
  )

  const MotionEl = motion[as] as typeof motion.div

  return (
    <MotionEl
      ref={ref}
      layoutId={layoutId}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -3, transition: { duration: 0.2 } }}
      onMouseMove={handleMove}
      onClick={onClick}
      className={cn(
        'pointer-card group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm transition-colors hover:border-primary/25',
        className,
      )}
    >
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(280px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), oklch(0.78 0.14 165 / 6%), transparent 60%)',
          }}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </MotionEl>
  )
}
