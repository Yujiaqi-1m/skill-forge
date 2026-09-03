import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/**
 * Global Lenis instance. The values below are PLACEHOLDER defaults —
 * overwrite every parameter with the original site's own values found in
 * the dump (constructor call, and any globals like lagSmoothing).
 * Driven by gsap.ticker with lagSmoothing(0) so scrubbed tweens and the
 * smooth scroll share a clock. Exposed as window.__lenis so ported
 * modules can read scroll + velocity exactly like the original's globals.
 */
let lenis = null

export function initLenis() {
  if (lenis) return () => {}

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lenis = new Lenis({
    lerp: prefersReducedMotion ? 1 : 0.09,
    smoothWheel: !prefersReducedMotion,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    syncTouch: false,
    infinite: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  window.__lenis = lenis

  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
    window.__lenis = null
  }
}

export function getLenis() {
  return lenis
}
