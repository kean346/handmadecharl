import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Brand } from './Shared'
import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

const links = [
  { href: '#our-work', name: 'Our Work' },
  { href: '#personalise', name: 'Personalise' },
  { href: '#about', name: 'About' },
  { href: '#contact', name: 'Contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(window.scrollY > 30)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  return (
    <header className={`site-header ${scrolled || open ? 'is-scrolled' : ''}`}>
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a className="nav-link" key={link.href} href={link.href}>
            {link.name}
          </a>
        ))}
        <Link className="nav-link nav-workbench" to="/demo-dashboard">
          <LayoutDashboard size={14} />
          Workshop CRM
        </Link>
      </nav>
      <a href="#contact" className="button button-dark header-quote">
        Request a Quote <ArrowUpRight size={17} />
      </a>
      <button
        className="icon-button mobile-menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link, i) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <small>0{i + 1}</small>
                {link.name}
                <ArrowUpRight size={25} />
              </a>
            ))}
            <Link to="/demo-dashboard" className="mobile-crm-link">
              <small>05</small>Workshop CRM
              <ArrowUpRight size={25} />
            </Link>
            <p>Thoughtfully made. Here in South Africa.</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
