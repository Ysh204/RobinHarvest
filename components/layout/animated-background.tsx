/**
 * GPU-friendly ambient background with rich multi-layer radial glows and an institutional grid overlay.
 * Designed to give the terminal a living, dynamic feel while maintaining high performance.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Primary Emerald Glow (Top Left) */}
      <div
        className="absolute -top-48 -left-24 size-[44rem] rounded-full opacity-[0.09] blur-[100px] motion-safe:animate-pulse"
        style={{ background: 'oklch(0.6 0.2 155)', animationDuration: '8s' }}
      />
      {/* Secondary Mint Glow (Middle Right) */}
      <div
        className="absolute top-1/3 -right-32 size-[38rem] rounded-full opacity-[0.07] blur-[120px] motion-safe:animate-pulse"
        style={{ background: 'oklch(0.55 0.18 160)', animationDuration: '11s', animationDelay: '2s' }}
      />
      {/* Deep Accent Glow (Bottom Center) */}
      <div
        className="absolute -bottom-48 left-1/3 size-[40rem] rounded-full opacity-[0.06] blur-[110px] motion-safe:animate-pulse"
        style={{ background: 'oklch(0.5 0.15 150)', animationDuration: '14s', animationDelay: '4s' }}
      />
      {/* Institutional Technical Grid with Radial Fade */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 95% 75% at 50% 10%, black 20%, transparent 85%)',
        }}
      />
    </div>
  )
}
