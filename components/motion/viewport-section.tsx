'use client'

import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { staggerContainer, fadeUpItem } from '@/lib/constants/motion'
import { cn } from '@/lib/utils'

interface ViewportSectionProps {
  children: ReactNode
  className?: string
  as?: 'section' | 'div'
}

/** Viewport-triggered stagger reveal for page sections. */
export function ViewportSection({ children, className, as = 'section' }: ViewportSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const MotionEl = motion[as] as typeof motion.section

  return (
    <MotionEl
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </MotionEl>
  )
}

export function ViewportItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={fadeUpItem} className={cn(className)}>
      {children}
    </motion.div>
  )
}
