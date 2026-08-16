'use client'

import { useState, useEffect } from 'react'

const STOCKS = ['AAPL', 'NVDA', 'TSLA', 'AMD', 'SPCX', 'AMZN', 'GOOGL']

interface StockTickerProps {
  prefix?: string
  widthClass?: string
  intervalMs?: number
  className?: string
}

export function StockTicker({
  prefix = '',
  widthClass = 'w-16',
  intervalMs = 2400,
  className = '',
}: StockTickerProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STOCKS.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return (
    <div
      className={`relative h-7 ${widthClass} overflow-hidden bg-white/[0.06] border border-border/60 rounded-full select-none ${className}`}
    >
      {STOCKS.map((ticker, i) => {
        const isCurrent = i === index
        const isPrev = i === (index - 1 + STOCKS.length) % STOCKS.length

        let transformStyle = 'translate-y-7 opacity-0'
        if (isCurrent) {
          transformStyle = 'translate-y-0 opacity-100'
        } else if (isPrev) {
          transformStyle = '-translate-y-7 opacity-0'
        }

        return (
          <span
            key={ticker}
            className={`absolute inset-0 flex items-center justify-center text-foreground font-bold font-mono text-xs tracking-wider transition-all duration-500 ease-in-out transform ${transformStyle}`}
          >
            {prefix}
            <span className="text-primary">{ticker}</span>
          </span>
        )
      })}
    </div>
  )
}
