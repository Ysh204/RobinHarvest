'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { VaultKind } from '@/lib/utils/vault-kind'
import { cn } from '@/lib/utils'

interface VaultStrategyVisualProps {
  kind: VaultKind
  className?: string
}

/** Ambient strategy-specific mini visualization for vault cards. */
export function VaultStrategyVisual({ kind, className }: VaultStrategyVisualProps) {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn('relative h-16 w-full overflow-hidden rounded-lg opacity-60', className)}
    >
      {kind === 'core' && <CoreVisual reduced={reduced} />}
      {kind === 'growth' && <GrowthVisual reduced={reduced} />}
      {kind === 'cl' && <ClVisual reduced={reduced} />}
    </div>
  )
}

function CoreVisual({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 200 64" className="h-full w-full" fill="none">
      <motion.rect
        x="70"
        y="20"
        width="60"
        height="24"
        rx="12"
        fill="oklch(0.85 0.23 155 / 0.08)"
        stroke="oklch(0.85 0.23 155 / 0.2)"
        strokeWidth="0.5"
        animate={reduced ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {!reduced && (
        <motion.circle
          cx="100"
          cy="32"
          r="3"
          fill="oklch(0.85 0.23 155 / 0.6)"
          animate={{ cy: [28, 36, 28] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </svg>
  )
}

function GrowthVisual({ reduced }: { reduced: boolean }) {
  const assets = [
    { x: 60, delay: 0 },
    { x: 85, delay: 0.3 },
    { x: 110, delay: 0.6 },
    { x: 135, delay: 0.9 },
  ]
  return (
    <svg viewBox="0 0 200 64" className="h-full w-full" fill="none">
      {assets.map(({ x, delay }) => (
        <motion.rect
          key={x}
          x={x}
          y={24}
          width="18"
          height="18"
          rx="4"
          fill="oklch(0.68 0.16 160 / 0.1)"
          stroke="oklch(0.68 0.16 160 / 0.25)"
          strokeWidth="0.5"
          animate={reduced ? undefined : { y: [24, 20, 24] }}
          transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <text x="100" y="14" textAnchor="middle" fill="oklch(0.55 0.01 165)" fontSize="8">
        INDEX +
      </text>
    </svg>
  )
}

function ClVisual({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 200 64" className="h-full w-full" fill="none">
      {/* Price line */}
      <line x1="20" y1="8" x2="20" y2="56" stroke="oklch(0.55 0.01 165 / 0.3)" strokeWidth="0.5" />
      <text x="20" y="6" textAnchor="middle" fill="oklch(0.55 0.01 165)" fontSize="7">
        Price
      </text>
      {/* Liquidity range box */}
      <motion.rect
        x="40"
        y="22"
        width="120"
        height="20"
        rx="2"
        fill="oklch(0.85 0.23 155 / 0.1)"
        stroke="oklch(0.85 0.23 155 / 0.3)"
        strokeWidth="0.5"
        animate={reduced ? undefined : { x: [38, 42, 38] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Range bounds */}
      <line x1="30" y1="32" x2="40" y2="32" stroke="oklch(0.85 0.23 155 / 0.4)" strokeWidth="0.5" />
      <line x1="160" y1="32" x2="180" y2="32" stroke="oklch(0.85 0.23 155 / 0.4)" strokeWidth="0.5" />
      {!reduced && (
        <motion.line
          x1="20"
          y1="32"
          x2="180"
          y2="32"
          stroke="oklch(0.85 0.23 155 / 0.15)"
          strokeWidth="8"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      <text x="100" y="36" textAnchor="middle" fill="oklch(0.55 0.01 165)" fontSize="7">
        LIQUIDITY
      </text>
    </svg>
  )
}
