'use client'

import { useEffect, useMemo, useState } from 'react'
import { parseUnits, formatUnits } from 'viem'
import { useAccount, useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { erc20Abi } from '@/lib/abis/erc20'
import { robinVaultAbi } from '@/lib/abis/robin-vault'
import { ROBINHOOD_CHAIN_ID } from '@/config/chain'
import type { VaultConfig } from '@/config/contracts'
import { saveTransaction } from '@/lib/utils/tx-history'

export function VaultActionPanel({ vault, paused }: { vault: VaultConfig; paused?: boolean }) {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const [inKind, setInKind] = useState(false)
  const vaultDecimalsQuery = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: 'decimals',
  })
  const shareDecimals = vaultDecimalsQuery.data ?? 18
  const assetDecimals = 18
  const currentDecimals = mode === 'deposit' ? assetDecimals : shareDecimals

  const parsed = useMemo(() => {
    try {
      return parseUnits(amount || '0', currentDecimals)
    } catch {
      return 0n
    }
  }, [amount, currentDecimals])

  const allowance = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.asset,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, vault.address] : undefined,
    query: { enabled: Boolean(address) },
  })
  const assetBalance = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.asset,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  })
  const shareBalance = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  })

  const maxDeposit = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: 'maxDeposit',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && mode === 'deposit' },
  })
  const maxRedeem = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: 'maxRedeem',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && mode === 'withdraw' && !inKind },
  })
  const previewDeposit = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: 'previewDeposit',
    args: [parsed],
    query: { enabled: mode === 'deposit' && parsed > 0n },
  })
  const previewRedeem = useReadContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: inKind ? 'previewInKindRedeem' : 'previewRedeem',
    args: [parsed],
    query: { enabled: mode === 'withdraw' && parsed > 0n },
  })

  const currentBalance = mode === 'deposit' ? assetBalance.data : shareBalance.data
  const currentSymbol = mode === 'deposit' ? vault.assetSymbol : vault.shareSymbol
  const receiveSymbol = mode === 'deposit' ? vault.shareSymbol : vault.assetSymbol

  const writer = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash: writer.data })
  const needsApproval = mode === 'deposit' && (allowance.data ?? 0n) < parsed

  const depositSim = useSimulateContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: 'deposit',
    args: address ? [parsed, address] : undefined,
    query: { enabled: Boolean(address) && mode === 'deposit' && parsed > 0n && !needsApproval && !paused },
  })
  const redeemSim = useSimulateContract({
    chainId: ROBINHOOD_CHAIN_ID,
    address: vault.address,
    abi: robinVaultAbi,
    functionName: inKind ? 'redeemInKind' : 'redeem',
    args: address ? [parsed, address, address] : undefined,
    query: {
      enabled: Boolean(address) && mode === 'withdraw' && parsed > 0n && !paused && (!inKind || vault.supportsInKindRedeem),
    },
  })

  useEffect(() => {
    if (receipt.isSuccess) {
      allowance.refetch()
      assetBalance.refetch()
      shareBalance.refetch()
      maxDeposit.refetch()
      maxRedeem.refetch()
    }
  }, [receipt.isSuccess, allowance, assetBalance, shareBalance, maxDeposit, maxRedeem])

  const limitExceeded =
    mode === 'deposit'
      ? maxDeposit.data !== undefined && parsed > maxDeposit.data
      : !inKind && maxRedeem.data !== undefined && parsed > maxRedeem.data

  const simulationError =
    mode === 'deposit' ? depositSim.error?.message : redeemSim.error?.message

  async function submit() {
    if (!address || parsed <= 0n) return
    if (limitExceeded) {
      toast.error('Amount exceeds vault limits')
      return
    }
    try {
      if (needsApproval) {
        const hash = await writer.writeContractAsync({
          address: vault.asset,
          abi: erc20Abi,
          functionName: 'approve',
          args: [vault.address, parsed],
        })
        saveTransaction({
          hash,
          kind: 'approve',
          status: 'confirmed',
          vault: vault.address,
          amount: amount || '0',
          symbol: vault.assetSymbol,
        })
        toast.success('Approval submitted', { description: 'Wait for confirmation, then deposit.' })
      } else if (mode === 'deposit') {
        const hash = await writer.writeContractAsync({
          address: vault.address,
          abi: robinVaultAbi,
          functionName: 'deposit',
          args: [parsed, address],
        })
        saveTransaction({
          hash,
          kind: 'deposit',
          status: 'confirmed',
          vault: vault.address,
          amount: amount || '0',
          symbol: vault.assetSymbol,
        })
        toast.success('Deposit submitted')
      } else {
        const fn = inKind ? 'redeemInKind' : 'redeem'
        const hash = await writer.writeContractAsync({
          address: vault.address,
          abi: robinVaultAbi,
          functionName: fn,
          args: [parsed, address, address],
        })
        saveTransaction({
          hash,
          kind: inKind ? 'redeemInKind' : 'redeem',
          status: 'confirmed',
          vault: vault.address,
          amount: amount || '0',
          symbol: vault.shareSymbol,
        })
        toast.success(inKind ? 'In-kind redemption submitted' : 'Withdrawal submitted')
      }
    } catch (error) {
      toast.error('Transaction not submitted', {
        description: error instanceof Error ? error.message.split('\n')[0] : 'Wallet request failed.',
      })
    }
  }

  const { data: onChainSymbol } = useReadContract({
    address: mode === 'deposit' ? vault.asset : vault.address,
    abi: erc20Abi,
    functionName: 'symbol',
  })

  const { data: onChainDecimals } = useReadContract({
    address: mode === 'deposit' ? vault.asset : vault.address,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  async function watchAsset() {
    if (typeof window === 'undefined' || !(window as any).ethereum) return
    try {
      await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: mode === 'deposit' ? vault.asset : vault.address,
            symbol: onChainSymbol ? String(onChainSymbol) : currentSymbol.slice(0, 11),
            decimals: onChainDecimals ? Number(onChainDecimals) : currentDecimals,
          },
        },
      })
      toast.success(`Requested to add ${onChainSymbol || currentSymbol.slice(0, 11)} to your wallet`)
    } catch (error: any) {
      toast.error(error?.message?.slice(0, 100) || `Could not add ${currentSymbol} to wallet`)
    }
  }

  const estimatedReceive = useMemo(() => {
    if (parsed <= 0n) return null
    if (mode === 'deposit' && previewDeposit.data !== undefined) {
      return `${formatUnits(previewDeposit.data, shareDecimals)} ${receiveSymbol}`
    }
    if (mode === 'withdraw' && inKind) return 'Basket of underlying strategy assets (preview on-chain)'
    if (mode === 'withdraw' && previewRedeem.data !== undefined) {
      return `${formatUnits(previewRedeem.data as bigint, assetDecimals)} ${receiveSymbol}`
    }
    return `≈ ${amount || '0.00'} ${receiveSymbol}`
  }, [parsed, mode, inKind, previewDeposit.data, previewRedeem.data, shareDecimals, assetDecimals, receiveSymbol, amount])

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-foreground">Manage Position</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Deposits require {vault.assetSymbol}. Multi-asset zap entry is not yet supported.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as typeof mode)
            setAmount('')
            setInKind(false)
          }}
        >
          <TabsList className="grid w-full grid-cols-2 h-9 bg-white/[0.02] border border-border/60 p-0.5 rounded-lg">
            <TabsTrigger value="deposit" className="text-xs font-medium rounded-md py-1">
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="text-xs font-medium rounded-md py-1">
              Withdraw
            </TabsTrigger>
          </TabsList>
          <TabsContent value={mode} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="amount" className="text-muted-foreground font-medium">
                  Amount
                </Label>
                {isConnected && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const max =
                          mode === 'deposit'
                            ? maxDeposit.data ?? currentBalance
                            : maxRedeem.data ?? currentBalance
                        if (max !== undefined) setAmount(formatUnits(max, currentDecimals))
                      }}
                      className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      Balance:{' '}
                      {assetBalance.error || shareBalance.error
                        ? 'Error'
                        : currentBalance !== undefined
                          ? (Number(currentBalance) / 10 ** currentDecimals).toLocaleString(undefined, {
                              maximumFractionDigits: 4,
                            })
                          : 'Loading...'}{' '}
                      {currentSymbol}
                    </button>
                    <button
                      type="button"
                      onClick={watchAsset}
                      title={`Add ${currentSymbol} to wallet`}
                      className="text-muted-foreground hover:text-primary transition-colors bg-white/[0.02] border border-border/40 hover:border-primary/40 rounded p-0.5"
                    >
                      <PlusCircle className="size-3" />
                    </button>
                  </div>
                )}
              </div>
              {(assetBalance.error || shareBalance.error) && (
                <div className="text-[11px] text-rose-400 whitespace-normal break-all bg-rose-500/10 p-2 rounded border border-rose-500/20">
                  {assetBalance.error?.message?.slice(0, 120) || shareBalance.error?.message?.slice(0, 120)}
                </div>
              )}
              <div className="relative">
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="h-11 pr-24 text-sm font-mono tabular bg-white/[0.015] border-border/80 focus-visible:border-primary/40"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-muted-foreground">
                  {currentSymbol}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs p-2 rounded bg-white/[0.01] border border-border/40 font-mono">
              <span className="text-muted-foreground">Est. Receive</span>
              <span className="tabular font-medium text-foreground">{estimatedReceive ?? '—'}</span>
            </div>
            {mode === 'withdraw' && vault.supportsInKindRedeem && (
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  id="inKind"
                  checked={inKind}
                  onCheckedChange={(c) => setInKind(c as boolean)}
                  className="border-border/60 data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary"
                />
                <Label htmlFor="inKind" className="text-xs text-muted-foreground cursor-pointer font-medium">
                  Redeem in-kind (Growth vault only)
                </Label>
              </div>
            )}
            {limitExceeded && (
              <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                Amount exceeds {mode === 'deposit' ? 'maxDeposit' : 'maxRedeem'} for this vault.
              </p>
            )}
            {simulationError && parsed > 0n && (
              <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded p-2">
                Simulation: {simulationError.split('\n')[0].slice(0, 160)}
              </p>
            )}
            {!isConnected ? (
              <ConnectWallet className="w-full text-xs h-10" />
            ) : (
              <Button
                className="w-full text-xs font-semibold h-10 shadow-sm"
                disabled={parsed <= 0n || paused || writer.isPending || receipt.isLoading || limitExceeded}
                onClick={submit}
              >
                {paused
                  ? 'Vault Paused'
                  : writer.isPending
                    ? 'Confirm in Wallet...'
                    : receipt.isLoading
                      ? 'Confirming Tx...'
                      : needsApproval
                        ? `Approve ${vault.assetSymbol}`
                        : mode === 'deposit'
                          ? 'Deposit Capital'
                          : 'Withdraw Shares'}
              </Button>
            )}
            <p className="text-[11px] leading-relaxed text-muted-foreground pt-1 border-t border-border/20 text-center">
              Non-custodial execution. Review simulation before signing.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
