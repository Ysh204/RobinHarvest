'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const FLOW_STEPS = ['INDEX', 'Vault', 'Strategy', 'Yield', 'Portfolio'] as const

/** Subtle capital-flow diagram for dashboard hero background. */
export function CapitalFlowVisual({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <div aria-hidden className={className}>
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full opacity-[0.35]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.85 0.23 155 / 0)" />
            <stop offset="50%" stopColor="oklch(0.85 0.23 155 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.68 0.16 160 / 0)" />
          </linearGradient>
        </defs>

        {/* Vertical flow lines */}
        {[80, 200, 320].map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            y1={20}
            x2={x}
            y2={300}
            stroke="url(#flowGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
          />
        ))}

        {/* Flow nodes */}
        {FLOW_STEPS.map((label, i) => {
          const y = 40 + i * 55
          return (
            <g key={label}>
              <motion.rect
                x={168}
                y={y - 12}
                width={64}
                height={24}
                rx={12}
                fill="oklch(0.85 0.23 155 / 0.06)"
                stroke="oklch(0.85 0.23 155 / 0.15)"
                strokeWidth="0.5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
              />
              <motion.text
                x={200}
                y={y + 4}
                textAnchor="middle"
                fill="oklch(0.55 0.01 165)"
                fontSize="9"
                fontFamily="system-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.4 + i * 0.12 }}
              >
                {label}
              </motion.text>
              {i < FLOW_STEPS.length - 1 && (
                <motion.path
                  d={`M 200 ${y + 14} L 200 ${y + 38}`}
                  stroke="oklch(0.85 0.23 155 / 0.25)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                />
              )}
            </g>
          )
        })}

        {/* Ambient flowing particles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r={2}
            fill="oklch(0.85 0.23 155 / 0.5)"
            initial={{ cx: 200, cy: 30, opacity: 0 }}
            animate={{
              cy: [30, 290],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.4,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}
