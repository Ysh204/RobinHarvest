'use client'

import { RotateCcw, Save, Sliders, ShieldAlert, Globe } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettings } from '@/hooks/use-settings'
import type { DisplayCurrency } from '@/types/settings'

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [draft, setDraft] = useState(settings)
  
  function save() {
    updateSettings(draft)
    toast.success('Preferences stored to local client')
  }

  return (
    <div className="flex flex-col w-full">
      {/* Full-Width Header Banner */}
      <section className="w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 max-w-3xl">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Client Preferences & Execution</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">Terminal Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Tune transaction slippage tolerances, swap execution deadlines, and network RPC connections for optimal trading performance.
          </p>
        </motion.div>
      </section>

      {/* Centered Compact Settings Controls */}
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 md:py-10 flex flex-col gap-6">
        {/* Display Preferences */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm flex flex-col gap-4 shadow-xs hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/30 text-sm font-bold text-foreground">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Globe className="size-4" />
            </div>
            <span>Quote Currency Display</span>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <Label htmlFor="currency" className="text-xs font-bold text-muted-foreground">Preferred Currency Benchmark</Label>
            <Select value={draft.currency} onValueChange={(value) => setDraft({ ...draft, currency: value as DisplayCurrency })}>
              <SelectTrigger id="currency" className="h-10 text-xs font-semibold bg-white/[0.02] border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {['USD', 'EUR', 'GBP'].map((c) => (
                    <SelectItem key={c} value={c} className="text-xs font-mono font-bold">{c}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Used for fiat evaluation calculations across dashboard vaults.</p>
          </div>
        </motion.div>

        {/* Transaction Defaults */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm flex flex-col gap-4 shadow-xs hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/30 text-sm font-bold text-foreground">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sliders className="size-4" />
            </div>
            <span>Execution Parameters (Uniswap v4 & ERC-4626)</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slippage" className="text-xs font-bold text-muted-foreground">Slippage Tolerance (%)</Label>
              <div className="relative">
                <Input
                  id="slippage"
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={draft.slippageBps / 100}
                  onChange={(e) => setDraft({ ...draft, slippageBps: Math.round(Number(e.target.value) * 100) })}
                  className="h-10 pr-8 text-xs font-mono font-bold bg-white/[0.02] border-border/60 tabular"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">%</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Transactions revert if adverse price slippage exceeds this threshold.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="deadline" className="text-xs font-bold text-muted-foreground">Transaction Deadline (Minutes)</Label>
              <div className="relative">
                <Input
                  id="deadline"
                  type="number"
                  min="1"
                  max="120"
                  value={draft.deadlineMinutes}
                  onChange={(e) => setDraft({ ...draft, deadlineMinutes: Number(e.target.value) })}
                  className="h-10 pr-12 text-xs font-mono font-bold bg-white/[0.02] border-border/60 tabular"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">min</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Maximum pending mempool duration before expiration.</p>
            </div>
          </div>
        </motion.div>

        {/* Network & Custom RPC */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm flex flex-col gap-4 shadow-xs hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/30 text-sm font-bold text-foreground">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ShieldAlert className="size-4" />
            </div>
            <span>Network RPC Endpoint</span>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rpc" className="text-xs font-bold text-muted-foreground">Custom Robinhood Chain RPC URL</Label>
            <Input
              id="rpc"
              type="url"
              placeholder="https://rpc.testnet.robinhood.com/..."
              value={draft.customRpcUrl}
              onChange={(e) => setDraft({ ...draft, customRpcUrl: e.target.value })}
              className="h-10 text-xs font-mono font-medium bg-white/[0.02] border-border/60"
            />
            <p className="text-[11px] text-muted-foreground">Leave blank to route via verified public infrastructure on Chain ID 46630.</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { resetSettings(); toast.success('Default execution tolerances restored') }}
            className="h-10 text-xs font-bold gap-1.5 px-5 border-border/80 bg-white/[0.02] hover:bg-white/[0.06]"
          >
            <RotateCcw className="size-3.5" /> Reset Defaults
          </Button>
          <Button
            size="sm"
            onClick={save}
            className="h-10 text-xs font-extrabold gap-1.5 px-6 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="size-3.5" /> Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
