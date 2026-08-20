export const SITE = {
  name: 'Robin Harvest',
  description:
    'Institutional-grade ERC-4626 yield optimizer on Robinhood Chain. Deposit once — strategies compound automatically.',
} as const

export interface NavItem {
  readonly label: string
  readonly href: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Settings', href: '/settings' },
] as const
