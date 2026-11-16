import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from './Shared'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand />
        <p>
          Little details.
          <br />
          <em>Beautifully made.</em>
        </p>
        <a href="#top" className="back-to-top" aria-label="Back to top">
          <ArrowUp size={22} strokeWidth={1.4} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Handmade by Charl · South Africa</span>
        <span>Private website concept · Product details subject to confirmation</span>
        <Link to="/demo-dashboard">
          Demo dashboard <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  )
}
