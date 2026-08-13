'use client'

import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedNumberProps {
  value: number
  format?: (n: number) => string
  className?: string
  highlightOnChange?: boolean
}

const defaultFormat = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 })

export function AnimatedNumber({
  value,
  format = defaultFormat,
  className,
  highlightOnChange = false,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)
  const displayRef = useRef<HTMLSpanElement>(null)
  const prevValue = useRef(value)
  const highlightRef = useRef<HTMLSpanElement>(null)

  useMotionValueEvent(motionValue, 'change', (v) => {
    if (displayRef.current) {
      displayRef.current.textContent = format(v)
    }
  })

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    })

    if (highlightOnChange && prevValue.current !== value && highlightRef.current) {
      highlightRef.current.classList.add('metric-highlight')
      const timer = setTimeout(() => {
        highlightRef.current?.classList.remove('metric-highlight')
      }, 600)
      prevValue.current = value
      return () => {
        controls.stop()
        clearTimeout(timer)
      }
    }

    prevValue.current = value
    return () => controls.stop()
  }, [value, motionValue, highlightOnChange])

  return (
    <span ref={highlightRef} className={cn('relative inline-block tabular', className)}>
      <span ref={displayRef}>{format(value)}</span>
    </span>
  )
}
