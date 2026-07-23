'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_DEADLINE_MINUTES, DEFAULT_SLIPPAGE_BPS, STORAGE_KEYS } from '@/lib/constants'
import type { AppSettings } from '@/types/settings'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  currency: 'USD',
  slippageBps: DEFAULT_SLIPPAGE_BPS,
  deadlineMinutes: DEFAULT_DEADLINE_MINUTES,
  customRpcUrl: '',
}

interface SettingsContextValue {
  settings: AppSettings
  /** True once localStorage has been read on the client. */
  hydrated: boolean
  updateSettings: (patch: Partial<AppSettings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function readStoredSettings(): AppSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings)
    if (!raw) return DEFAULT_SETTINGS
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...(parsed as Partial<AppSettings>) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSettings(readStoredSettings())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
    } catch {
      // Storage unavailable (private mode) — settings stay in-memory.
    }
  }, [settings, hydrated])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const value = useMemo(
    () => ({ settings, hydrated, updateSettings, resetSettings }),
    [settings, hydrated, updateSettings, resetSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return ctx
}
