'use client'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { config } from '@/config/wagmi'
import { SettingsProvider } from '@/hooks/use-settings'
import '@rainbow-me/rainbowkit/styles.css'

function Web3Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
            staleTime: 4_000,
          },
        },
      }),
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: 'oklch(0.78 0.14 165)',
            accentColorForeground: 'oklch(0.14 0.02 165)',
            borderRadius: 'large',
          })}
          appInfo={{ appName: 'Robin Harvest' }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <Web3Providers>
        <TooltipProvider delay={200}>{children}</TooltipProvider>
        <Toaster position="bottom-right" />
      </Web3Providers>
    </SettingsProvider>
  )
}
