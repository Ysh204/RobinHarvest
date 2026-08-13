'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

interface GrowthPortfolioVisualProps {
  inKind?: boolean
  assetSymbol?: string
  className?: string
}

/** Growth vault portfolio split visualization for in-kind redemption concept. */
export function GrowthPortfolioVisual({
  inKind = false,
  assetSymbol = 'INDEX',
  className,
}: GrowthPortfolioVisualProps) {
  const reduced = useReducedMotion()
  const retainedAssets = ['Asset A', 'Asset B', 'Asset C']

  return (
    <div
      aria-hidden
      className={cn(
        'rounded-xl border border-border/40 bg-white/[0.015] p-4',
        className,
      )}
    >
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {inKind ? 'In-Kind Redemption' : 'Portfolio Composition'}
      </p>

      {!inKind ? (
        <div className="flex items-center justify-center gap-3">
          <motion.div
            className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold font-mono"
            animate={reduced ? undefined : { scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {assetSymbol}
          </motion.div>
          <span className="text-muted-foreground text-xs">+</span>
          <div className="flex gap-1.5">
            {retainedAssets.map((a, i) => (
              <motion.div
                key={a}
                className="rounded-md border border-border/40 bg-white/[0.02] px-2 py-1.5 text-[10px] font-mono text-muted-foreground"
                animate={reduced ? undefined : { y: [0, -2, 0] }}
                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
              >
                {a}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          className="flex flex-col items-center gap-2"
          initial="combined"
          animate="split"
        >
          <motion.div
            className="rounded-lg border border-border/40 bg-white/[0.03] px-6 py-2 text-xs font-semibold"
            variants={{
              combined: { opacity: 1 },
              split: { opacity: 0, height: 0, marginBottom: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            Portfolio
          </motion.div>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2"
            variants={{
              combined: { opacity: 0, y: -10 },
              split: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-mono font-semibold">
              {assetSymbol}
            </div>
            {retainedAssets.map((a, i) => (
              <motion.div
                key={a}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-md border border-border/40 bg-white/[0.02] px-2.5 py-1.5 text-[10px] font-mono"
              >
                {a}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
