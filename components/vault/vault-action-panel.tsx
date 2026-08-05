'use client'

import { useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { erc20Abi } from '@/lib/abis/erc20'
import { robinVaultAbi } from '@/lib/abis/robin-vault'
import { ROBINHOOD_CHAIN_ID } from '@/config/chain'
import type { VaultConfig } from '@/config/contracts'

export function VaultActionPanel({ vault, paused }: { vault: VaultConfig; paused?: boolean }) {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const vaultDecimalsQuery = useReadContract({ chainId: ROBINHOOD_CHAIN_ID, address: vault.address, abi: robinVaultAbi, functionName: 'decimals' })
  const shareDecimals = vaultDecimalsQuery.data ?? 18
  const currentDecimals = mode === 'deposit' ? 18 : shareDecimals

  const parsed = useMemo(() => { try { return parseUnits(amount || '0', currentDecimals) } catch { return 0n } }, [amount, currentDecimals])
  const allowance = useReadContract({ chainId: ROBINHOOD_CHAIN_ID, address: vault.asset, abi: erc20Abi, functionName: 'allowance', args: address ? [address, vault.address] : undefined, query: { enabled: Boolean(address) } })
  const assetBalance = useReadContract({ chainId: ROBINHOOD_CHAIN_ID, address: vault.asset, abi: erc20Abi, functionName: 'balanceOf', args: address ? [address] : undefined, query: { enabled: Boolean(address) } })
  const shareBalance = useReadContract({ chainId: ROBINHOOD_CHAIN_ID, address: vault.address, abi: erc20Abi, functionName: 'balanceOf', args: address ? [address] : undefined, query: { enabled: Boolean(address) } })
  
  const currentBalance = mode === 'deposit' ? assetBalance.data : shareBalance.data
  const currentSymbol = mode === 'deposit' ? vault.assetSymbol : vault.shareSymbol
  const receiveSymbol = mode === 'deposit' ? vault.shareSymbol : vault.assetSymbol

  const writer = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash: writer.data })
  const needsApproval = mode === 'deposit' && (allowance.data ?? 0n) < parsed
  // Auto-refetch when receipt is confirmed
  useEffect(() => {
    if (receipt.isSuccess) {
      allowance.refetch()
      assetBalance.refetch()
      shareBalance.refetch()
    }
  }, [receipt.isSuccess, allowance, assetBalance, shareBalance])

  async function submit() {
    if (!address || parsed <= 0n) return
    try {
      if (needsApproval) {
        await writer.writeContractAsync({ address: vault.asset, abi: erc20Abi, functionName: 'approve', args: [vault.address, parsed] })
        toast.success('Approval submitted', { description: 'Wait for confirmation, then deposit.' })
      } else if (mode === 'deposit') {
        await writer.writeContractAsync({ address: vault.address, abi: robinVaultAbi, functionName: 'deposit', args: [parsed, address] })
        toast.success('Deposit submitted')
      } else {
        await writer.writeContractAsync({ address: vault.address, abi: robinVaultAbi, functionName: 'withdraw', args: [parsed, address, address] })
        toast.success('Withdrawal submitted')
      }
    } catch (error) {
      toast.error('Transaction not submitted', { description: error instanceof Error ? error.message.split('\n')[0] : 'Wallet request failed.' })
    }
  }

  return <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
    <CardHeader className="pb-3 border-b border-border/30">
      <CardTitle className="text-sm font-medium uppercase tracking-wider text-foreground">Manage Position</CardTitle>
      <CardDescription className="text-xs text-muted-foreground">Direct wallet execution on Robinhood Chain.</CardDescription>
    </CardHeader>
    <CardContent className="pt-4">
      <Tabs value={mode} onValueChange={(value) => { setMode(value as typeof mode); setAmount('') }}>
        <TabsList className="grid w-full grid-cols-2 h-9 bg-white/[0.02] border border-border/60 p-0.5 rounded-lg">
          <TabsTrigger value="deposit" className="text-xs font-medium rounded-md py-1">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw" className="text-xs font-medium rounded-md py-1">Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value={mode} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="amount" className="text-muted-foreground font-medium">Amount</Label>
              {isConnected && (
                <button
                  type="button"
                  onClick={() => currentBalance !== undefined && setAmount((Number(currentBalance) / (10 ** currentDecimals)).toString())}
                  className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Balance: {
                    assetBalance.error ? 'Error!' : 
                    shareBalance.error ? 'Error!' : 
                    currentBalance !== undefined ? (Number(currentBalance) / (10 ** currentDecimals)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : 'Loading...'
                  } {currentSymbol}
                </button>
              )}
            </div>
            {(assetBalance.error || shareBalance.error) && (
              <div className="text-[11px] text-rose-400 whitespace-normal break-all bg-rose-500/10 p-2 rounded border border-rose-500/20">
                {assetBalance.error?.message?.slice(0, 120) || shareBalance.error?.message?.slice(0, 120)}
              </div>
            )}
            <div className="relative">
              <Input id="amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-11 pr-24 text-sm font-mono tabular bg-white/[0.015] border-border/80 focus-visible:border-primary/40" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-muted-foreground">{currentSymbol}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs p-2 rounded bg-white/[0.01] border border-border/40 font-mono">
            <span className="text-muted-foreground">Est. Receive</span>
            <span className="tabular font-medium text-foreground">≈ {amount || '0.00'} {receiveSymbol}</span>
          </div>
          {!isConnected ? <ConnectWallet className="w-full text-xs h-10" /> : <Button className="w-full text-xs font-semibold h-10 shadow-sm" disabled={parsed <= 0n || paused || writer.isPending || receipt.isLoading} onClick={submit}>{paused ? 'Vault Paused' : writer.isPending ? 'Confirm in Wallet...' : receipt.isLoading ? 'Confirming Tx...' : needsApproval ? `Approve ${vault.assetSymbol}` : mode === 'deposit' ? 'Deposit Capital' : 'Withdraw Shares'}</Button>}
          <p className="text-[11px] leading-relaxed text-muted-foreground pt-1 border-t border-border/20 text-center">
            Non-custodial execution. Review simulation before signing.
          </p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
}
