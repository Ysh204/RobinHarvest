/**
 * GPU-friendly ambient background: two slowly drifting radial glows in the
 * brand greens plus a faint grid. Pure CSS (no JS animation loop), respects
 * prefers-reduced-motion via the global media query in globals.css.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-40 left-1/4 size-[36rem] rounded-full opacity-[0.07] blur-3xl motion-safe:animate-pulse"
        style={{ background: 'var(--primary)', animationDuration: '9s' }}
      />
      <div
        className="absolute -bottom-48 right-1/5 size-[30rem] rounded-full opacity-[0.06] blur-3xl motion-safe:animate-pulse"
        style={{ background: 'var(--accent)', animationDuration: '12s', animationDelay: '3s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 20%, transparent 75%)',
        }}
      />
    </div>
  )
}
