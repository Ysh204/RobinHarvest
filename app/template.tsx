'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageVariants } from '@/lib/constants/motion'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}
