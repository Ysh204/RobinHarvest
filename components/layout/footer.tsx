import Link from 'next/link'
import { NAV_ITEMS, SITE } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm md:flex-row md:px-6">
        <p>
          {SITE.name} — ERC-4626 yield optimizer on Robinhood Chain (46630). Testnet deployment;
          not financial advice.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
