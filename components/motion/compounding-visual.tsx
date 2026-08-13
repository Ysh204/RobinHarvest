'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/** Conceptual compounding loop — visual only, not fabricated yield data. */
export function CompoundingVisual({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const steps = ['Capital', 'Yield', 'Reinvest', 'Larger Position']

  return (
    <div
      aria-hidden
      className={cn(
        'relative flex items-center justify-center py-4',
        className,
      )}
    >
      {/* Expanding rings */}
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/10"
            style={{ width: 60 + i * 28, height: 60 + i * 28 }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.15, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
          />
        ))}

      <div className="relative z-[1] flex flex-col items-center gap-1">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-[9px] font-medium text-muted-foreground"
          >
            {step}
            {i < steps.length - 1 && (
              <span className="block text-center text-primary/30">↓</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
