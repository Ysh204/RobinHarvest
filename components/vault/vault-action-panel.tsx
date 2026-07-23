'use client'

import { useMemo, useState } from 'react'
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
import type { VaultConfig } from '@/config/contracts'

export function VaultActionPanel({ vault, paused }: { vault: VaultConfig; paused?: boolean }) {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const parsed = useMemo(() => { try { return parseUnits(amount || '0', 18) } catch { return 0n } }, [amount])
  const allowance = useReadContract({ address: vault.asset, abi: erc20Abi, functionName: 'allowance', args: address ? [address, vault.address] : undefined, query: { enabled: Boolean(address) } })
  const writer = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash: writer.data })
  const needsApproval = mode === 'deposit' && (allowance.data ?? 0n) < parsed

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
          <div className="flex flex-col gap-2"><Label htmlFor="amount">Amount</Label><div className="relative"><Input id="amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-14 pr-28 text-lg tabular" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">{vault.assetSymbol}</span></div></div>
          <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">You receive</span><span className="tabular">≈ {amount || '0'} {vault.shareSymbol}</span></div>
          {!isConnected ? <ConnectWallet className="w-full" /> : <Button className="w-full" size="lg" disabled={parsed <= 0n || paused || writer.isPending || receipt.isLoading} onClick={submit}>{paused ? 'Vault paused' : writer.isPending ? 'Confirm in wallet' : receipt.isLoading ? 'Confirming' : needsApproval ? `Approve ${vault.assetSymbol}` : mode === 'deposit' ? 'Deposit' : 'Withdraw'}</Button>}
          <p className="text-xs leading-relaxed text-muted-foreground">Robin Harvest never takes custody. Review the wallet simulation before signing. Network fees apply.</p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
}
