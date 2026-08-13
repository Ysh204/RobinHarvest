'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/** Ambient CL range visualization — decorative, not live price data. */
export function ClRangeVisual({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <div
      aria-label="Concentrated liquidity range visualization"
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/40 bg-white/[0.015] p-4',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Liquidity Range
        </span>
        <span className="text-[10px] text-muted-foreground/60 font-mono">Ambient · Not live price</span>
      </div>
      <svg viewBox="0 0 320 100" className="w-full h-auto" fill="none">
        {/* Price axis */}
        <line x1="30" y1="10" x2="30" y2="85" stroke="oklch(0.55 0.01 165 / 0.4)" strokeWidth="0.5" />
        <text x="30" y="8" textAnchor="middle" fill="oklch(0.55 0.01 165)" fontSize="8">
          Price
        </text>

        {/* Active range bracket */}
        <motion.rect
          x="60"
          y="35"
          width="200"
          height="30"
          rx="3"
          fill="oklch(0.85 0.23 155 / 0.08)"
          stroke="oklch(0.85 0.23 155 / 0.25)"
          strokeWidth="0.5"
          animate={reduced ? undefined : { x: [58, 62, 58] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Liquidity concentration curve */}
        {!reduced && (
          <motion.path
            d="M 60 50 Q 160 30 260 50"
            stroke="oklch(0.85 0.23 155 / 0.5)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}

        {/* Range bounds */}
        <line x1="50" y1="50" x2="60" y2="50" stroke="oklch(0.85 0.23 155 / 0.4)" strokeWidth="0.5" />
        <line x1="260" y1="50" x2="290" y2="50" stroke="oklch(0.85 0.23 155 / 0.4)" strokeWidth="0.5" />

        <text x="160" y="54" textAnchor="middle" fill="oklch(0.55 0.01 165)" fontSize="8">
          ACTIVE RANGE
        </text>

        {/* Current price indicator — ambient drift only */}
        {!reduced && (
          <motion.line
            x1="160"
            y1="15"
            x2="160"
            y2="80"
            stroke="oklch(0.92 0.004 165 / 0.3)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            animate={{ x1: [155, 165, 155], x2: [155, 165, 155] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>
    </div>
  )
}
