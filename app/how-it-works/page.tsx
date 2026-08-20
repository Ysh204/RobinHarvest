'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  ChevronDown,
  Coins,
  Layers,
  Sparkles,
  TrendingUp,
  Vault,
  Wallet,
  Zap,
} from 'lucide-react'
import { YieldCalculator } from '@/components/how-it-works/yield-calculator'

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index))
  }

  const faqs = [
    {
      q: 'Why doesn’t another user depositing money dilute my share price?',
      a: 'Robin Harvest vaults follow the strict ERC-4626 standard. When a new user deposits capital, they are minted new vault shares calculated precisely at the current share price (Total Assets / Total Shares). Because the ratio of assets to shares is preserved, existing depositors experience zero dilution.',
    },
    {
      q: 'Who pays the gas fees for harvesting and compounding?',
      a: 'Automated Keeper bots execute batch rebalances and dividend liquidations on behalf of all participants. Gas costs are amortized across all vault capital in one single transaction, saving individual depositors significant transaction fees.',
    },
    {
      q: 'How does the protocol make money?',
      a: 'Robin Harvest charges a transparent 10% performance fee exclusively on generated yields (never on your deposited principal). If the vault makes zero profit, the protocol charges zero fees, ensuring 100% alignment between depositors and protocol developers.',
    },
    {
      q: 'What is In-Kind Redemption on the Growth Vault?',
      a: 'While traditional vaults only return the single base asset, the rhINDEX-Growth vault allows depositors to opt for In-Kind Redemption. This means you can withdraw your share of the raw accumulated basket of tokenized US equities directly to your wallet.',
    },
    {
      q: 'Are my deposited assets locked?',
      a: 'No! There are zero lockup periods. You can withdraw your principal and accrued yield whenever you wish directly from the Vault Action Panel.',
    },
  ]

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-14 sm:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide"
          >
            <Sparkles className="size-3.5" /> Institutional DeFi Architecture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
          >
            How Robin Harvest Works: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Automated Wealth Compounding
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed"
          >
            Discover how our smart vaults continuously harvest tokenized equity distributions and DEX trading fees to drive mathematical share price appreciation for all depositors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl px-6 font-bold text-xs h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all"
            >
              Explore Vaults <ArrowRight className="size-4 ml-1.5" />
            </Link>
            <a
              href="#math-section"
              className="inline-flex items-center justify-center rounded-2xl px-6 font-semibold text-xs h-11 bg-white/[0.04] border border-border/60 text-foreground hover:bg-white/[0.08] transition-all"
            >
              See The Math Behind It
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-16 sm:gap-24">
        {/* Step 1-4 Flow */}
        <section className="flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">The 4-Step Flywheel</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              How Depositors Earn Continuous Yield
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              You deposit once. Our autonomous keeper infrastructure does the rest around the clock.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Deposit Capital',
                desc: 'You deposit INDEX (or LP tokens) into an ERC-4626 vault. The vault mints rhINDEX shares at the exact current exchange rate.',
                icon: Wallet,
                badge: 'Zero Lockup',
              },
              {
                step: '02',
                title: 'Strategy Deployment',
                desc: 'Vault assets are routed into integrated yield protocols (Index Finance tokenized stocks or Uniswap v4 concentrated liquidity).',
                icon: Layers,
                badge: 'Capital Efficient',
              },
              {
                step: '03',
                title: 'Automated Harvest',
                desc: 'Keepers harvest stock rewards (AAPL, NVDA, TSLA) or trading fees in gas-optimized batches and liquidate them into INDEX.',
                icon: Bot,
                badge: 'Gas-Free for You',
              },
              {
                step: '04',
                title: 'Share Price Growth',
                desc: 'Compounded INDEX is added directly into the vault pool. Since total shares remain fixed, each share becomes worth more INDEX.',
                icon: TrendingUp,
                badge: 'Mathematical Yield',
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.step}
                  className="p-5 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-primary/30 transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-primary px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20">
                        {card.step}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase">
                        {card.badge}
                      </span>
                    </div>
                    <div className="size-10 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* The Mathematical Formula Section */}
        <section id="math-section" className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white/[0.03] via-card/50 to-white/[0.01] border border-border/60 backdrop-blur-md flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">ERC-4626 Standard</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                The Mathematics of Compounding
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Unlike inflationary reward tokens that dilute in value, Robin Harvest increases the real intrinsic redemption value of each vault share.
              </p>
            </div>

            {/* Formula Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-primary/30 shadow-inner flex flex-col items-center text-center gap-1 w-full lg:w-auto">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Intrinsic Share Valuation</span>
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-primary py-1">
                Share Price = Total Vault Assets / Total Vault Shares
              </div>
              <span className="text-[11px] text-muted-foreground">Assets increase with every harvest · Shares stay constant</span>
            </div>
          </div>

          {/* Example Before / After Table */}
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/30 flex flex-col gap-2">
              <span className="text-muted-foreground font-bold uppercase text-[10px]">1. Initial State (Day 1)</span>
              <p className="text-foreground font-semibold">1,000 INDEX deposited = 1,000 shares minted.</p>
              <div className="font-mono text-muted-foreground text-[11px] pt-1">
                Share Price = 1,000 / 1,000 = <strong className="text-foreground">1.0000 INDEX</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/30 flex flex-col gap-2">
              <span className="text-muted-foreground font-bold uppercase text-[10px]">2. After Keeper Harvest</span>
              <p className="text-foreground font-semibold">+100 INDEX harvested from stock dividends.</p>
              <div className="font-mono text-muted-foreground text-[11px] pt-1">
                Share Price = 1,100 / 1,000 = <strong className="text-primary">1.1000 INDEX (+10%)</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/30 flex flex-col gap-2">
              <span className="text-muted-foreground font-bold uppercase text-[10px]">3. Upon Withdrawal</span>
              <p className="text-foreground font-semibold">User burns 1,000 shares to withdraw.</p>
              <div className="font-mono text-muted-foreground text-[11px] pt-1">
                User receives <strong className="text-primary">1,100 INDEX</strong> (100 INDEX pure profit).
              </div>
            </div>
          </div>
        </section>

        {/* Vault Strategies Comparison */}
        <section className="flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">Strategy Comparison</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Three Tailored Strategies for Every Investor
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Core */}
            <div className="p-6 rounded-3xl bg-card/40 border border-border/50 flex flex-col justify-between gap-5 hover:border-primary/30 transition-all">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    MEDIUM RISK
                  </span>
                  <span className="font-mono text-base font-extrabold text-primary">18.40% APY</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">rhINDEX-Core</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  100% reward liquidation. Converts all tokenized equity rewards (AAPL, NVDA, TSLA) into pure INDEX to maximize your principal holding.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-border/30 flex flex-col gap-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Allocation</span>
                  <span className="font-mono font-bold text-foreground">INDEX 100% | Stocks 0%</span>
                </div>
              </div>
              <Link
                href="/"
                className="w-full text-xs font-bold h-9 rounded-xl border border-border/50 bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center transition-colors"
              >
                View Core Vault
              </Link>
            </div>

            {/* Growth */}
            <div className="p-6 rounded-3xl bg-card/40 border border-warning/30 flex flex-col justify-between gap-5 hover:border-warning/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-warning/15 text-warning font-mono text-[10px] font-bold rounded-bl-xl border-l border-b border-warning/30">
                In-Kind Redeem
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    MEDIUM-HIGH
                  </span>
                  <span className="font-mono text-base font-extrabold text-warning">32.15% APY</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">rhINDEX-Growth</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dynamic equity exposure. Retains 70% of stock dividends while compounding 30% into INDEX. Allows direct withdrawal of raw stock tokens.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-border/30 flex flex-col gap-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Allocation</span>
                  <span className="font-mono font-bold text-foreground">INDEX 65% | Equities 35%</span>
                </div>
              </div>
              <Link
                href="/"
                className="w-full text-xs font-bold h-9 rounded-xl bg-warning text-black hover:bg-warning/90 flex items-center justify-center transition-colors font-semibold"
              >
                View Growth Vault
              </Link>
            </div>

            {/* CL */}
            <div className="p-6 rounded-3xl bg-card/40 border border-border/50 flex flex-col justify-between gap-5 hover:border-primary/30 transition-all">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    HIGH RISK
                  </span>
                  <span className="font-mono text-base font-extrabold text-accent">68.50% APY</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">rhINDEX-CL (v4)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Uniswap v4 Concentrated Liquidity. Deploys capital into narrow tick bands with EIP-1153 flash accounting to capture high trading volume fees.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-border/30 flex flex-col gap-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Allocation</span>
                  <span className="font-mono font-bold text-foreground">INDEX-ETH-USDG LP 100%</span>
                </div>
              </div>
              <Link
                href="/"
                className="w-full text-xs font-bold h-9 rounded-xl border border-border/50 bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center transition-colors"
              >
                View CL Vault
              </Link>
            </div>
          </div>
        </section>

        {/* How The Protocol Makes Money */}
        <section className="p-6 sm:p-8 rounded-3xl bg-card/40 border border-border/50 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/30 pb-4">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Coins className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">How Robin Harvest (The Protocol) Makes Money</h3>
              <p className="text-xs text-muted-foreground">100% aligned economic model powered by smart contracts.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/30 flex flex-col gap-2">
              <span className="font-mono font-bold text-primary text-sm">10% Performance Fee</span>
              <p className="text-muted-foreground leading-relaxed">
                A 10% fee is deducted exclusively from generated harvest profits. If your vault yields 0 INDEX, protocol fee is 0 INDEX.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/30 flex flex-col gap-2">
              <span className="font-mono font-bold text-foreground text-sm">Zero Management Fees</span>
              <p className="text-muted-foreground leading-relaxed">
                We never charge an upfront deposit fee or annual management percentage on your underlying principal.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/30 flex flex-col gap-2">
              <span className="font-mono font-bold text-emerald-400 text-sm">Treasury & Keeper Fuel</span>
              <p className="text-muted-foreground leading-relaxed">
                Performance fees fund automated keeper gas costs and future smart contract protocol development.
              </p>
            </div>
          </div>
        </section>

        {/* Yield Calculator */}
        <YieldCalculator />

        {/* FAQ Section */}
        <section className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          <div className="text-center flex flex-col items-center gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Protocol Safety & Architecture
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/20">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/15 via-primary/8 to-emerald-500/10 border border-primary/30 flex flex-col items-center text-center gap-4 relative overflow-hidden">
          <div className="size-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Vault className="size-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight max-w-xl">
            Start Compounding Your Yield on Robinhood Chain Today
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Choose your vault, deposit once, and let autonomous keeper bots handle execution and compounding.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl px-8 font-bold text-xs h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 mt-2 transition-all"
          >
            Launch Dashboard <ArrowRight className="size-4 ml-1.5" />
          </Link>
        </section>
      </div>
    </div>
  )
}
