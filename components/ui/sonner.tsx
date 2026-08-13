"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { motion } from "framer-motion"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

function AnimatedCheck() {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <CircleCheckIcon className="size-4 text-primary" />
    </motion.span>
  )
}

function AnimatedLoader() {
  return <Loader2Icon className="size-4 animate-spin text-primary/70" />
}

function AnimatedError() {
  return (
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: [0, -3, 3, -2, 2, 0] }}
      transition={{ duration: 0.4 }}
    >
      <OctagonXIcon className="size-4 text-destructive" />
    </motion.span>
  )
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <AnimatedCheck />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <AnimatedError />,
        loading: <AnimatedLoader />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast backdrop-blur-md",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
