import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Inbox, MessageCircle, RefreshCw } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { Brand, Modal, SectionLabel } from '../components/Shared'
import { enquiryNumber, readEnquiries, updateEnquiryStatus } from '../lib/enquiries'
import { whatsappUrl } from '../data/products'
import { statuses, type Enquiry, type EnquiryStatus } from '../types'

const date = (value: string) =>
  new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Johannesburg',
  }).format(new Date(value))

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<EnquiryStatus | 'All'>('All')
  const [selected, setSelected] = useState<string | null>(null)
  const close = useCallback(() => setSelected(null), [])
  const load = useCallback(() => {
    try {
      setEnquiries(readEnquiries())
      setError('')
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Saved enquiries could not be read. Browser storage may be unavailable.',
      )
    }
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Demo Workbench — Handmade by Charl'
    load()
    window.addEventListener('storage', load)
    window.addEventListener('charl:enquiries', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('charl:enquiries', load)
      document.title = 'Handmade by Charl — Little details. Beautifully made.'
    }
  }, [load])
  function changeStatus(id: string, status: EnquiryStatus) {
    try {
      updateEnquiryStatus(id, status)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The status could not be saved.')
    }
  }
  const shown = enquiries.filter((e) => filter === 'All' || e.status === filter)
  const detail = enquiries.find((e) => e.id === selected)
  return (
    <>
      <div className="dashboard-page" inert={!!detail}>
        <header className="dashboard-header">
          <Brand />
          <Link to="/" className="text-link">
            <ArrowLeft size={17} /> Back to the website
          </Link>
        </header>
        <main className="dashboard-main">
          <SectionLabel>The demo workbench</SectionLabel>
          <div className="dashboard-heading">
            <h1>
              A place for
              <br />
              <em>every idea.</em>
            </h1>
            <div>
              <span className="demo-pill">
                <span className="demo-dot" />
                LOCAL DEMO
              </span>
              <p>
                Enquiries stay in this browser.
                <br />
                No messages are sent. No customer account needed.
              </p>
              <Link className="text-link" to="/#personalise">
                Try the customer journey <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="dashboard-stats">
            {statuses.map((status, i) => (
              <button
                className={filter === status ? 'active' : ''}
                key={status}
                onClick={() => setFilter(filter === status ? 'All' : status)}
                aria-pressed={filter === status}
              >
                <span className={`status-dot status-${i}`} />
                <span>{status === 'New enquiry' ? 'New enquiries' : status}</span>
                <strong>{enquiries.filter((e) => e.status === status).length}</strong>
              </button>
            ))}
          </div>
          <div className="dashboard-table-heading">
            <h2>
              {filter === 'All' ? 'All enquiries' : filter}
              <span>{shown.length}</span>
            </h2>
            <div>
              {filter !== 'All' && (
                <button className="subtle-button" onClick={() => setFilter('All')}>
                  Show all
                </button>
              )}
              <button className="icon-button" onClick={load} aria-label="Refresh enquiries">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          {shown.length ? (
            <div className="enquiry-list">
              <div className="enquiry-table-labels">
                <span>Enquiry / Customer</span>
                <span>The idea</span>
                <span>Status</span>
                <span />
              </div>
              {shown.map((enquiry) => (
                <button
                  className="enquiry-row"
                  key={enquiry.id}
                  onClick={() => setSelected(enquiry.id)}
                >
                  <span>
                    <small>
                      {enquiryNumber(enquiry.id)} · {date(enquiry.createdAt)}
                    </small>
                    <strong>{enquiry.name}</strong>
                  </span>
                  <span>
                    <strong>{enquiry.product}</strong>
                    <small>Quantity: {enquiry.quantity}</small>
                  </span>
                  <span className={`status-badge badge-${statuses.indexOf(enquiry.status)}`}>
                    {enquiry.status}
                  </span>
                  <ArrowUpRight size={19} />
                </button>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <Inbox size={35} strokeWidth={1} />
              <h3>
                {enquiries.length
                  ? 'Nothing in this part of the workshop.'
                  : 'Your workbench is waiting.'}
              </h3>
              <p>
                {enquiries.length
                  ? 'Choose another status to see more enquiries.'
                  : 'Make a little design, save a demo enquiry, and find it here.'}
              </p>
              {!enquiries.length && (
                <Link to="/#personalise" className="button button-dark">
                  Make your first demo enquiry <ArrowUpRight size={17} />
                </Link>
              )}
            </div>
          )}
          <p className="dashboard-storage-note">
            Demo data and uploaded references are stored in localStorage on this browser and origin.
            Clearing site data removes them. This page has no authentication and is not a production
            administration system.
          </p>
        </main>
        <footer className="dashboard-footer">
          Handmade by Charl <span>A little wood. A lot of heart.</span>
        </footer>
      </div>
      <AnimatePresence>
        {detail && (
          <Modal onClose={close} titleId="enquiry-title" className="enquiry-detail">
            <SectionLabel>{enquiryNumber(detail.id)}</SectionLabel>
            <h2 id="enquiry-title">{detail.product}</h2>
            <p className="enquiry-detail-date">Saved {date(detail.createdAt)} · Local demo only</p>
            <div className="enquiry-person">
              <span>
                <small>FROM</small>
                <strong>{detail.name}</strong>
              </span>
              <span>
                <small>WHATSAPP</small>
                <strong>{detail.phone}</strong>
              </span>
              <span>
                <small>QUANTITY</small>
                <strong>{detail.quantity}</strong>
              </span>
            </div>
            <label className="dashboard-status-label">
              Enquiry status
              <select
                value={detail.status}
                onChange={(event) => changeStatus(detail.id, event.target.value as EnquiryStatus)}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <div className="enquiry-notes">
              <h3>Customisation details</h3>
              <p>{detail.details || 'No customisation details added.'}</p>
              <h3>Additional notes</h3>
              <p>{detail.notes || 'No additional notes.'}</p>
            </div>
            {detail.reference && (
              <figure className="enquiry-reference">
                <img src={detail.reference.dataUrl} alt="Customer's uploaded design reference" />
                <figcaption>{detail.reference.name} · Stored in this browser</figcaption>
              </figure>
            )}
            <a
              href={whatsappUrl(
                `Hi Charl, I’d like to discuss ${enquiryNumber(detail.id)}: ${detail.quantity} × ${detail.product}.\n${detail.details}\n${detail.notes}\nMy name: ${detail.name}`,
              )}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <MessageCircle size={17} /> Enquire with Charl on WhatsApp <ArrowUpRight size={16} />
            </a>
            <p className="upload-help">
              Opens a message to Charl. Attach reference files yourself; they are not sent
              automatically.
            </p>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
