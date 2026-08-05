import Link from 'next/link'
import { NAV_ITEMS, SITE } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white/[0.005] mt-auto">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-6 md:px-12 lg:px-16 py-6 text-xs text-muted-foreground md:flex-row">
        <p className="leading-relaxed">
          {SITE.name} — Non-custodial ERC-4626 & Uniswap v4 CL yield optimizer on Robinhood Chain (46630).
        </p>
        <nav aria-label="Footer" className="flex items-center gap-6 font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary transition-colors uppercase text-[11px] tracking-wider"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
