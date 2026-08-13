'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { parseUnits, formatUnits } from 'viem'
import { useAccount, useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'
import { CapitalFlowDiagram } from '@/components/motion/capital-flow-diagram'
import { TransactionStages, deriveTxStage, type TxStage } from '@/components/motion/transaction-stages'
import { GrowthPortfolioVisual } from '@/components/motion/growth-portfolio-visual'
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
import { getVaultKind } from '@/lib/utils/vault-kind'
import { fadeVariants } from '@/lib/constants/motion'

export function VaultActionPanel({ vault, paused }: { vault: VaultConfig; paused?: boolean }) {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const [inKind, setInKind] = useState(false)
  const [txStage, setTxStage] = useState<TxStage>('idle')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const vaultKind = getVaultKind(vault)

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
    const stage = deriveTxStage({
      isPending: writer.isPending,
      isConfirming: receipt.isLoading,
      isSuccess: receipt.isSuccess,
      isError: receipt.isError || Boolean(writer.error),
      needsApproval,
      hasSubmitted,
    })
    setTxStage(stage)
  }, [writer.isPending, writer.error, receipt.isLoading, receipt.isSuccess, receipt.isError, needsApproval, hasSubmitted])

  useEffect(() => {
    if (receipt.isSuccess) {
      allowance.refetch()
      assetBalance.refetch()
      shareBalance.refetch()
      maxDeposit.refetch()
      maxRedeem.refetch()
      setAmount('')
      const timer = setTimeout(() => {
        setTxStage('idle')
        setHasSubmitted(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [receipt.isSuccess, allowance, assetBalance, shareBalance, maxDeposit, maxRedeem])

  const limitExceeded =
    mode === 'deposit'
      ? maxDeposit.data !== undefined && parsed > maxDeposit.data
      : !inKind && maxRedeem.data !== undefined && parsed > maxRedeem.data

  const simulationError = mode === 'deposit' ? depositSim.error?.message : redeemSim.error?.message

  async function submit() {
    if (!address || parsed <= 0n) return
    if (limitExceeded) {
      toast.error('Amount exceeds vault limits')
      return
    }
    setTxStage('preparing')
    try {
      if (needsApproval) {
        setHasSubmitted(true)
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
        setHasSubmitted(true)
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
        setHasSubmitted(true)
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
      setTxStage('failed')
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
    if (typeof window === 'undefined' || !(window as Window & { ethereum?: { request: (args: unknown) => Promise<unknown> } }).ethereum) return
    try {
      await (window as Window & { ethereum: { request: (args: unknown) => Promise<unknown> } }).ethereum.request({
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : `Could not add ${currentSymbol} to wallet`
      toast.error(msg.slice(0, 100))
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

  const showFlow = parsed > 0n || amount.length > 0

  return (
    <Card className="border border-border/50 bg-card/60 backdrop-blur-md shadow-sm rounded-2xl overflow-hidden">
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
            setTxStage('idle')
            setHasSubmitted(false)
          }}
        >
          <TabsList className="grid w-full grid-cols-2 h-9 bg-white/[0.02] border border-border/50 p-0.5 rounded-xl">
            <TabsTrigger value="deposit" className="text-xs font-medium rounded-lg py-1">
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="text-xs font-medium rounded-lg py-1">
              Withdraw
            </TabsTrigger>
          </TabsList>
          <TabsContent value={mode} className="mt-4 flex flex-col gap-4">
            <CapitalFlowDiagram
              mode={mode}
              vaultKind={vaultKind}
              assetSymbol={vault.assetSymbol}
              inKind={inKind}
              active={showFlow}
              amount={amount || undefined}
            />

            {vaultKind === 'growth' && mode === 'withdraw' && inKind && (
              <GrowthPortfolioVisual inKind assetSymbol={vault.assetSymbol} />
            )}

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
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-destructive whitespace-normal break-all bg-destructive/8 p-2 rounded-xl border border-destructive/20"
                >
                  {assetBalance.error?.message?.slice(0, 120) || shareBalance.error?.message?.slice(0, 120)}
                </motion.div>
              )}
              <div className="relative">
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="h-11 pr-24 text-sm font-mono tabular bg-white/[0.015] border-border/80 focus-visible:border-primary/40 rounded-xl"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-muted-foreground">
                  {currentSymbol}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs p-2.5 rounded-xl bg-white/[0.015] border border-border/40 font-mono">
              <span className="text-muted-foreground">Est. Receive</span>
              <span className="tabular font-medium text-foreground">{estimatedReceive ?? '—'}</span>
            </div>

            {mode === 'withdraw' && vault.supportsInKindRedeem && (
              <div className="flex items-center gap-2">
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

            <AnimatePresence>
              {limitExceeded && (
                <motion.p
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-[11px] text-warning bg-warning/10 border border-warning/20 rounded-xl p-2"
                >
                  Amount exceeds {mode === 'deposit' ? 'maxDeposit' : 'maxRedeem'} for this vault.
                </motion.p>
              )}
              {simulationError && parsed > 0n && (
                <motion.p
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-[11px] text-destructive bg-destructive/8 border border-destructive/20 rounded-xl p-2"
                >
                  Simulation: {simulationError.split('\n')[0].slice(0, 160)}
                </motion.p>
              )}
            </AnimatePresence>

            <TransactionStages
              stage={txStage}
              mode={mode}
              needsApproval={needsApproval}
            />

            {!isConnected ? (
              <ConnectWallet className="w-full text-xs h-10" />
            ) : (
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full text-xs font-semibold h-10 rounded-xl"
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
              </motion.div>
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
