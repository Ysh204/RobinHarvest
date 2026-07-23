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
        'px-4 py-2 text-base font-medium transition-colors duration-200',
        active
          ? 'text-white font-semibold'
          : 'text-zinc-400 hover:text-white',
      )}
    >
      {label}
    </Link>
  )
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-black/90 backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-6 px-6 md:px-12">
        
        {/* Left: Reverted Logo Dimensions */}
        <div className="flex items-center gap-10 md:gap-14">
          <Link href="/" className="group flex items-center transition-transform duration-200 hover:scale-[1.01]" aria-label="Robin Harvest home">
            <Image
              src="/header-full-logo.png"
              alt="Robin Harvest Logo"
              width={802}
              height={216}
              priority
              className="h-12 w-auto object-contain md:h-14 lg:h-16"
            />
          </Link>

          {/* Desktop Nav Links (Clean text links) */}
          <nav aria-label="Main" className="hidden items-center gap-2 md:flex">
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
