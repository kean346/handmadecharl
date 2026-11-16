import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { X, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Handmade by Charl home">
      <span>
        Handmade<span className="brand-by">by Charl</span>
      </span>
      <small>WOOD. WONDER. ONE OF A KIND.</small>
    </Link>
  )
}

export function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}) {
  return (
    <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>
      <span className="eyebrow-line" />
      {children}
    </div>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { clipPath: 'inset(0 0 12% 0)', y: 30, opacity: 0 }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function RoundArrow({ className = '' }: { className?: string }) {
  return (
    <span className={`round-arrow ${className}`} aria-hidden="true">
      <ArrowUpRight size={20} strokeWidth={1.5} />
    </span>
  )
}

export function Modal({
  children,
  onClose,
  className = '',
  titleId,
  variant = 'dialog',
}: {
  children: ReactNode
  onClose: () => void
  className?: string
  titleId: string
  variant?: 'dialog' | 'drawer'
}) {
  const root = useRef<HTMLDivElement>(null)
  // Capture before the parent becomes inert in the commit phase.
  // Keep this stable through StrictMode's effect setup/cleanup cycle.
  const previousFocus = useRef(document.activeElement as HTMLElement | null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const previous = previousFocus.current
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    root.current?.querySelector<HTMLButtonElement>('.modal-close')?.focus({ preventScroll: true })
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab') return
      const nodes = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex="0"]',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length)
      const first = nodes[0],
        last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', handler)
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [onClose])
  return (
    <motion.div
      className={`modal-backdrop ${variant === 'drawer' ? 'modal-is-drawer' : ''}`}
      initial={{ backgroundColor: 'rgba(32,25,19,0)' }}
      animate={{ backgroundColor: 'rgba(32,25,19,.62)' }}
      exit={{ backgroundColor: 'rgba(32,25,19,0)' }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={root}
        className={`modal-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={
          reduced
            ? false
            : { opacity: 0, y: variant === 'drawer' ? 0 : 20, x: variant === 'drawer' ? 40 : 0 }
        }
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: variant === 'drawer' ? 0 : 12, x: variant === 'drawer' ? 40 : 0 }}
        transition={{ duration: 0.28 }}
      >
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close detail view"
        >
          <X size={22} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}
