'use client'

import { Clock3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { STORAGE_KEYS } from '@/lib/constants'
import type { TransactionRecord } from '@/types/transaction'
import { Badge } from '@/components/ui/badge'
import { explorerTxUrl } from '@/config/chain'

export default function TransactionsPage() {
  const [records, setRecords] = useState<TransactionRecord[]>([])
  useEffect(() => { try { setRecords(JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) ?? '[]') as TransactionRecord[]) } catch { setRecords([]) } }, [])
  return <div className="flex flex-col gap-8"><header><p className="text-sm font-medium text-primary">Wallet activity</p><h1 className="mt-2 text-4xl font-semibold">Transactions</h1><p className="mt-3 max-w-2xl text-muted-foreground">A local record of transactions initiated from this browser. Your wallet and block explorer remain the source of truth.</p></header>{records.length === 0 ? <Card><CardContent className="p-6"><Empty className="min-h-72"><EmptyHeader><EmptyMedia variant="icon"><Clock3 /></EmptyMedia><EmptyTitle>No local transactions</EmptyTitle><EmptyDescription>Deposits, approvals, and withdrawals started here will appear in this list.</EmptyDescription></EmptyHeader></Empty></CardContent></Card> : <div className="flex flex-col gap-3">{records.map((record) => <a key={record.hash} href={explorerTxUrl(record.hash)} target="_blank" rel="noreferrer"><Card className="transition-colors hover:border-primary/40"><CardContent className="flex items-center justify-between gap-4 p-5"><div><p className="font-medium capitalize">{record.kind}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</p></div><div className="text-right"><Badge variant={record.status === 'failed' ? 'destructive' : 'secondary'}>{record.status}</Badge><p className="mt-2 text-sm tabular">{record.amount} {record.symbol}</p></div></CardContent></Card></a>)}</div>}</div>
}
