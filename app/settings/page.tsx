'use client'

import { RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettings } from '@/hooks/use-settings'
import type { DisplayCurrency } from '@/types/settings'

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [draft, setDraft] = useState(settings)
  function save() { updateSettings(draft); toast.success('Settings saved') }
  return <div className="mx-auto flex w-full max-w-3xl flex-col gap-8"><header><p className="text-sm font-medium text-primary">Preferences</p><h1 className="mt-2 text-4xl font-semibold">Settings</h1><p className="mt-3 text-muted-foreground">Tune transaction defaults and how values are displayed on this device.</p></header><Card><CardHeader><CardTitle>Display</CardTitle><CardDescription>Choose your preferred quote currency.</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-2"><Label>Currency</Label><Select value={draft.currency} onValueChange={(value) => setDraft({ ...draft, currency: value as DisplayCurrency })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{['USD','EUR','GBP'].map((currency) => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}</SelectGroup></SelectContent></Select></div></CardContent></Card><Card><CardHeader><CardTitle>Transaction defaults</CardTitle><CardDescription>Applied to previews before wallet confirmation.</CardDescription></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="slippage">Slippage tolerance (%)</Label><Input id="slippage" type="number" min="0.1" max="10" step="0.1" value={draft.slippageBps / 100} onChange={(event) => setDraft({ ...draft, slippageBps: Math.round(Number(event.target.value) * 100) })} /></div><div className="flex flex-col gap-2"><Label htmlFor="deadline">Deadline (minutes)</Label><Input id="deadline" type="number" min="1" max="120" value={draft.deadlineMinutes} onChange={(event) => setDraft({ ...draft, deadlineMinutes: Number(event.target.value) })} /></div></CardContent></Card><Card><CardHeader><CardTitle>Network</CardTitle><CardDescription>Optional custom RPC. Leave blank to use the application default.</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-2"><Label htmlFor="rpc">Custom RPC URL</Label><Input id="rpc" type="url" placeholder="https://…" value={draft.customRpcUrl} onChange={(event) => setDraft({ ...draft, customRpcUrl: event.target.value })} /></div></CardContent></Card><div className="flex flex-wrap justify-end gap-3"><Button variant="outline" onClick={() => { resetSettings(); toast.success('Defaults restored') }}><RotateCcw data-icon="inline-start" />Reset</Button><Button onClick={save}><Save data-icon="inline-start" />Save settings</Button></div></div>
}
