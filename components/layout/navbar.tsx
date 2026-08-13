'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
import { softSpring } from '@/lib/constants/motion'

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
          'relative flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
          active
            ? 'bg-primary/8 text-primary font-semibold'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]',
        )}
      >
        <span>{label}</span>
        {active && (
          <motion.span
            layoutId="mobile-nav-indicator"
            className="size-2 rounded-full bg-primary"
            transition={softSpring}
          />
        )}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200 rounded-lg',
        active ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
          transition={softSpring}
        />
      )}
    </Link>
  )
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 w-full items-center justify-between gap-6 px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-8 md:gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-85"
            aria-label="Robin Harvest home"
          >
            <Image
              src="/logo.jpg"
              alt="Robin Harvest Logo"
              width={64}
              height={64}
              priority
              className="size-8 rounded-xl object-contain border border-white/[0.06]"
            />
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              Robin<span className="text-primary font-medium">Harvest</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <WalletStatus />
          <ConnectWallet />

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-xl border border-border/60 md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </DrawerTrigger>
            <DrawerContent className="bg-background border-border/60">
              <DrawerHeader>
                <DrawerTitle className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </DrawerTitle>
              </DrawerHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1.5 px-4 pb-8">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={drawerOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                    transition={{ delay: drawerOpen ? i * 0.05 : 0, ...softSpring }}
                  >
                    <NavLink
                      href={item.href}
                      label={item.label}
                      mobile
                      onNavigate={() => setDrawerOpen(false)}
                    />
                  </motion.div>
                ))}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
