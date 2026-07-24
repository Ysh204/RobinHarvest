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

  return <Card className="lg:sticky lg:top-24">
    <CardHeader><CardTitle>Manage position</CardTitle><CardDescription>Transactions execute directly from your wallet.</CardDescription></CardHeader>
    <CardContent>
      <Tabs value={mode} onValueChange={(value) => { setMode(value as typeof mode); setAmount('') }}>
        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="deposit">Deposit</TabsTrigger><TabsTrigger value="withdraw">Withdraw</TabsTrigger></TabsList>
        <TabsContent value={mode} className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              {isConnected && (
                <button
                  type="button"
                  onClick={() => currentBalance !== undefined && setAmount((Number(currentBalance) / (10 ** currentDecimals)).toString())}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
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
              <div className="text-xs text-red-500 whitespace-normal break-all">
                {assetBalance.error?.message?.slice(0, 150) || shareBalance.error?.message?.slice(0, 150)}
              </div>
            )}
            <div className="relative"><Input id="amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-14 pr-28 text-lg tabular" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">{currentSymbol}</span></div>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">You receive</span><span className="tabular">≈ {amount || '0'} {receiveSymbol}</span></div>
          {!isConnected ? <ConnectWallet className="w-full" /> : <Button className="w-full" size="lg" disabled={parsed <= 0n || paused || writer.isPending || receipt.isLoading} onClick={submit}>{paused ? 'Vault paused' : writer.isPending ? 'Confirm in wallet' : receipt.isLoading ? 'Confirming' : needsApproval ? `Approve ${vault.assetSymbol}` : mode === 'deposit' ? 'Deposit' : 'Withdraw'}</Button>}
          <p className="text-xs leading-relaxed text-muted-foreground">Robin Harvest never takes custody. Review the wallet simulation before signing. Network fees apply.</p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
}
