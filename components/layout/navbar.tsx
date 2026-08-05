'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { WalletStatus } from '@/components/wallet/wallet-status'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { NAV_ITEMS } from '@/config/site'
import { cn } from '@/lib/utils'

function NavLink({
  href,
  label,
  onNavigate,
  mobile = false,
}: {
  href: string
  label: string
  onNavigate?: () => void
  mobile?: boolean
}) {
  const pathname = usePathname()
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-all',
          active
            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]',
        )}
      >
        <span>{label}</span>
        {active && <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200 rounded-md',
        active
          ? 'text-primary font-semibold bg-primary/5'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.02]',
      )}
    >
      {label}
    </Link>
  )
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="flex h-14 w-full items-center justify-between gap-6 px-6 md:px-12 lg:px-16">
        
        {/* Left: Clean Minimalist Logo & Title */}
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/" className="group flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-85" aria-label="Robin Harvest home">
            <Image
              src="/logo.jpg"
              alt="Robin Harvest Logo"
              width={64}
              height={64}
              priority
              className="size-8 rounded-lg object-contain shadow-sm border border-white/[0.08]"
            />
            <span className="font-display text-base font-bold tracking-tight text-foreground flex items-center">
              Robin<span className="text-primary font-medium">Harvest</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Clean compact links) */}
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>

        {/* Right: Wallet Controls */}
        <div className="flex items-center gap-4">
          <WalletStatus />
          <ConnectWallet />

          {/* Mobile Drawer */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger
              render={
                <Button variant="ghost" size="icon" className="size-10 rounded-lg border border-zinc-800 md:hidden" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </DrawerTrigger>
            <DrawerContent className="bg-black border-zinc-800">
              <DrawerHeader>
                <DrawerTitle className="text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Navigation</DrawerTitle>
              </DrawerHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1.5 px-4 pb-8">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    mobile
                    onNavigate={() => setDrawerOpen(false)}
                  />
                ))}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>

      </div>
    </header>
  )
}
