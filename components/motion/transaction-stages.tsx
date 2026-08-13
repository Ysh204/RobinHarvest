'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeVariants } from '@/lib/constants/motion'

export type TxStage =
  | 'idle'
  | 'preparing'
  | 'approval'
  | 'confirm_wallet'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed'

interface StageConfig {
  id: TxStage
  label: string
}

const DEPOSIT_STAGES: StageConfig[] = [
  { id: 'preparing', label: 'Preparing' },
  { id: 'approval', label: 'Approve token' },
  { id: 'confirm_wallet', label: 'Confirm in wallet' },
  { id: 'submitted', label: 'Transaction submitted' },
  { id: 'confirming', label: 'Confirming on-chain' },
  { id: 'confirmed', label: 'Shares minted' },
]

const WITHDRAW_STAGES: StageConfig[] = [
  { id: 'preparing', label: 'Preparing' },
  { id: 'confirm_wallet', label: 'Confirm in wallet' },
  { id: 'submitted', label: 'Transaction submitted' },
  { id: 'confirming', label: 'Confirming on-chain' },
  { id: 'confirmed', label: 'Capital returned' },
]

function stageIndex(stages: StageConfig[], current: TxStage): number {
  if (current === 'idle' || current === 'failed') return -1
  return stages.findIndex((s) => s.id === current)
}

function StageIcon({ status }: { status: 'pending' | 'active' | 'done' | 'failed' }) {
  if (status === 'active') {
    return <Loader2 className="size-3.5 animate-spin text-primary" />
  }
  if (status === 'done') {
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <Check className="size-3.5 text-primary" />
      </motion.span>
    )
  }
  if (status === 'failed') {
    return <Circle className="size-3.5 text-destructive" />
  }
  return <Circle className="size-3.5 text-muted-foreground/40" />
}

interface TransactionStagesProps {
  stage: TxStage
  mode: 'deposit' | 'withdraw'
  needsApproval?: boolean
  className?: string
}

export function TransactionStages({
  stage,
  mode,
  needsApproval = false,
  className,
}: TransactionStagesProps) {
  if (stage === 'idle') return null

  const allStages = mode === 'deposit' ? DEPOSIT_STAGES : WITHDRAW_STAGES
  const stages = mode === 'deposit' && !needsApproval
    ? allStages.filter((s) => s.id !== 'approval')
    : allStages

  const currentIdx = stageIndex(stages, stage)
  const isFailed = stage === 'failed'

  return (
    <AnimatePresence>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          'rounded-xl border border-border/40 bg-white/[0.015] p-3',
          isFailed && 'border-destructive/30 bg-destructive/5',
          className,
        )}
      >
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Transaction Progress
        </p>
        <ol className="flex flex-col gap-2">
          {stages.map((s, i) => {
            let status: 'pending' | 'active' | 'done' | 'failed' = 'pending'
            if (isFailed && i === Math.max(currentIdx, 0)) status = 'failed'
            else if (i < currentIdx) status = 'done'
            else if (i === currentIdx) status = 'active'

            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'flex items-center gap-2.5 text-xs',
                  status === 'active' && 'text-foreground font-medium',
                  status === 'done' && 'text-muted-foreground',
                  status === 'pending' && 'text-muted-foreground/50',
                  status === 'failed' && 'text-destructive',
                )}
              >
                <StageIcon status={status} />
                <span>{s.label}</span>
              </motion.li>
            )
          })}
        </ol>
      </motion.div>
    </AnimatePresence>
  )
}

/** Derive transaction stage from wagmi write/receipt state. */
export function deriveTxStage(opts: {
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  needsApproval: boolean
  hasSubmitted: boolean
}): TxStage {
  if (opts.isSuccess) return 'confirmed'
  if (opts.isError) return 'failed'
  if (opts.isConfirming) return 'confirming'
  if (opts.hasSubmitted && !opts.isPending) return 'submitted'
  if (opts.isPending) return opts.needsApproval ? 'approval' : 'confirm_wallet'
  return 'idle'
}
