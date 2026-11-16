import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Columns3,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  ListFilter,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react'
import { Brand } from '../components/Shared'
import EnquiryDrawer from '../components/crm/EnquiryDrawer'
import { crmDate, initials } from '../lib/crm-format'
import NewEnquiry from '../components/crm/NewEnquiry'
import {
  enquiryNumber,
  loadSampleEnquiries,
  readEnquiries,
  removeSampleEnquiries,
  updateEnquiryStatus,
} from '../lib/enquiries'
import { products } from '../data/products'
import { statuses, type Enquiry, type EnquiryStatus } from '../types'
import '../styles/crm.css'

type View = 'overview' | 'enquiries' | 'pipeline' | 'contacts'
const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Enquiries', icon: Inbox },
  { id: 'pipeline', label: 'Pipeline', icon: Columns3 },
  { id: 'contacts', label: 'Contacts', icon: UsersRound },
] as const
const stageLabels = ['New enquiries', 'Awaiting quotation', 'In progress', 'Completed']
const stageIcons = [Inbox, MessageSquare, Clock3, CheckCheck]
const stageHelp = [
  'A new idea to explore',
  'Ready for the next conversation',
  'Taking shape in the workshop',
  'A little idea, brought to life',
]
const stageClass = (status: EnquiryStatus) => `badge-${statuses.indexOf(status)}`
const productPhoto = (name: string) =>
  products.find((product) => product.name === name)?.studioImages[0] ??
  (name.toLowerCase().includes('spoon') ? products[2].studioImages[0] : products[0].studioImages[0])

function PipelineCard({
  enquiry,
  onOpen,
  onDrag,
}: {
  enquiry: Enquiry
  onOpen: (id: string) => void
  onDrag: (id: string | null) => void
}) {
  return (
    <button
      className="crm-kanban-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', enquiry.id)
        event.dataTransfer.effectAllowed = 'move'
        onDrag(enquiry.id)
      }}
      onDragEnd={() => onDrag(null)}
      onClick={() => onOpen(enquiry.id)}
    >
      <span className="crm-kanban-card-top">
        <small>{enquiryNumber(enquiry.id)}</small>
        <MoreHorizontal size={15} aria-hidden="true" />
      </span>
      <strong>{enquiry.product}</strong>
      <p>{enquiry.details || 'An idea to explore with Charl.'}</p>
      <span className="crm-kanban-card-footer">
        <span className="crm-avatar">{initials(enquiry.name)}</span>
        <span>
          {enquiry.name}
          <small>
            {enquiry.quantity} {enquiry.quantity === 1 ? 'piece' : 'pieces'}
            {enquiry.isSample ? ' · Sample' : ''}
          </small>
        </span>
        <ArrowUpRight size={15} />
      </span>
    </button>
  )
}

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [error, setError] = useState('')
  const [view, setView] = useState<View>('overview')
  const [filter, setFilter] = useState<EnquiryStatus | 'All'>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [mobile, setMobile] = useState(window.matchMedia('(max-width:600px)').matches)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dropStage, setDropStage] = useState<EnquiryStatus | null>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const close = useCallback(() => setSelected(null), [])
  const closeNew = useCallback(() => setCreating(false), [])
  useEffect(() => {
    if (!mobile || !sidebar) return
    const previous = document.activeElement as HTMLElement | null
    const frame = requestAnimationFrame(() =>
      sidebarRef.current?.querySelector<HTMLElement>('a, button')?.focus(),
    )
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const nodes = Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [],
      ).filter((node) => node.getClientRects().length)
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
    window.addEventListener('keydown', trap)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', trap)
      requestAnimationFrame(() => {
        if (previous?.isConnected) previous.focus({ preventScroll: true })
      })
    }
  }, [mobile, sidebar])
  useEffect(() => {
    const media = window.matchMedia('(max-width:600px)')
    const update = () => {
      setMobile(media.matches)
      setSidebar(false)
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
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
    document.title = 'Workshop CRM — Handmade by Charl'
    load()
    window.addEventListener('storage', load)
    window.addEventListener('charl:enquiries', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('charl:enquiries', load)
      document.title = 'Handmade by Charl — Little details. Beautifully made.'
    }
  }, [load])
  useEffect(() => {
    setPage(1)
  }, [query, filter, view, sort])
  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') setSidebar(false)
      if (
        event.key === '/' &&
        !(event.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))
      ) {
        event.preventDefault()
        document.getElementById('crm-search')?.focus()
      }
    }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [])
  const mutate = (fn: () => void) => {
    try {
      fn()
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'This change could not be saved.')
    }
  }
  const changeStatus = (id: string, status: EnquiryStatus) =>
    mutate(() => updateEnquiryStatus(id, status))
  const detail = enquiries.find((enquiry) => enquiry.id === selected)
  const counts = statuses.map(
    (status) => enquiries.filter((enquiry) => enquiry.status === status).length,
  )
  const active = enquiries.length - counts[3]
  const complete = enquiries.length ? Math.round((counts[3] / enquiries.length) * 100) : 0
  const matches = (enquiry: Enquiry) =>
    `${enquiryNumber(enquiry.id)} ${enquiry.name} ${enquiry.phone} ${enquiry.product} ${enquiry.details}`
      .toLowerCase()
      .includes(query.toLowerCase().trim())
  const searched = enquiries.filter(matches)
  const filtered = searched
    .filter((enquiry) => filter === 'All' || enquiry.status === filter)
    .sort((a, b) =>
      sort === 'oldest'
        ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
        : sort === 'customer'
          ? a.name.localeCompare(b.name)
          : Date.parse(b.createdAt) - Date.parse(a.createdAt),
    )
  const totalPages = Math.max(1, Math.ceil(filtered.length / 6))
  useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])
  const visible = filtered.slice((page - 1) * 6, page * 6)
  const hasSamples = enquiries.some((enquiry) => enquiry.isSample)
  const contacts = useMemo(() => {
    const map = new Map<
      string,
      { name: string; phone: string; count: number; last: string; isSample: boolean }
    >()
    for (const enquiry of enquiries) {
      const key = enquiry.isSample
        ? enquiry.name
        : enquiry.phone.replace(/\D/g, '') || enquiry.name.toLowerCase()
      const existing = map.get(key)
      if (existing) {
        existing.count++
        if (enquiry.createdAt > existing.last) existing.last = enquiry.createdAt
      } else
        map.set(key, {
          name: enquiry.name,
          phone: enquiry.phone,
          count: 1,
          last: enquiry.createdAt,
          isSample: !!enquiry.isSample,
        })
    }
    return [...map.values()]
  }, [enquiries])
  const shownContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.phone}`.toLowerCase().includes(query.toLowerCase().trim()),
  )
  const recentActivity = enquiries
    .flatMap((enquiry) =>
      (
        enquiry.activity ?? [
          { id: `${enquiry.id}-created`, text: 'Enquiry created', at: enquiry.createdAt },
        ]
      ).map((item) => ({ ...item, enquiry })),
    )
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, 3)
  const keyForDate = (date: Date) =>
    new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Africa/Johannesburg',
    }).format(date)
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(Date.now() - (6 - i) * 86400000)
    return {
      day: new Intl.DateTimeFormat('en-ZA', {
        weekday: 'short',
        timeZone: 'Africa/Johannesburg',
      }).format(day),
      count: enquiries.filter(
        (enquiry) => keyForDate(new Date(enquiry.createdAt)) === keyForDate(day),
      ).length,
    }
  })
  const maximum = Math.max(...week.map((day) => day.count), 1)
  function navigate(next: View) {
    setView(next)
    setFilter('All')
    setQuery('')
    setSidebar(false)
  }
  function exportEnquiries() {
    const csv = [
      ['Reference', 'Customer', 'WhatsApp', 'Product', 'Quantity', 'Status', 'Created', 'Sample'],
      ...filtered.map((enquiry) => [
        enquiryNumber(enquiry.id),
        enquiry.name,
        enquiry.phone,
        enquiry.product,
        String(enquiry.quantity),
        enquiry.status,
        enquiry.createdAt,
        enquiry.isSample ? 'Yes' : 'No',
      ]),
    ]
      .map((row) =>
        row
          .map((cell) => `"${(/^[=+@\-\t\r]/.test(cell) ? "'" : '') + cell.replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\r\n')
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'charl-demo-enquiries.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <>
      <div className="crm-app" inert={!!detail || creating}>
        {sidebar && (
          <button
            className="crm-sidebar-scrim"
            aria-label="Close workspace navigation"
            onClick={() => setSidebar(false)}
          />
        )}
        <aside
          ref={sidebarRef}
          className={`crm-sidebar ${sidebar ? 'is-open' : ''}`}
          inert={mobile && !sidebar}
          role={mobile && sidebar ? 'dialog' : undefined}
          aria-modal={mobile && sidebar ? true : undefined}
          aria-label="Workspace navigation"
        >
          <div className="crm-sidebar-brand">
            <Brand />
            <button
              className="crm-mobile-close"
              onClick={() => setSidebar(false)}
              aria-label="Close workspace navigation"
            >
              <X size={19} />
            </button>
          </div>
          <div className="crm-workspace-switch">
            <span className="crm-workspace-icon">h.</span>
            <span>
              Charl’s workshop<small>Demo workspace</small>
            </span>
            <span className="crm-online-dot" />
          </div>
          <span className="crm-nav-caption">WORKSPACE</span>
          <nav aria-label="Workshop navigation">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  aria-label={item.label}
                  title={item.label}
                  className={view === item.id ? 'active' : ''}
                  onClick={() => navigate(item.id)}
                  aria-current={view === item.id ? 'page' : undefined}
                >
                  <Icon size={17} strokeWidth={1.6} />
                  <span>{item.label}</span>
                  {item.id === 'enquiries' && <small>{enquiries.length}</small>}
                </button>
              )
            })}
          </nav>
          <div className="crm-sidebar-divider" />
          <span className="crm-nav-caption">YOUR STOREFRONT</span>
          <Link to="/" className="crm-store-link">
            <ExternalLink size={16} />
            View website
            <ArrowUpRight size={14} />
          </Link>
          <Link to="/#personalise" className="crm-store-link">
            <Sparkles size={16} />
            Engraving studio
            <ArrowUpRight size={14} />
          </Link>
          <div className="crm-sidebar-bottom">
            <div className="crm-local-notice">
              <span>
                <CircleHelp size={16} />A space to try things.
              </span>
              <p>All enquiries stay in this browser. No messages are sent from this demo.</p>
            </div>
            <div className="crm-owner">
              <span className="crm-avatar">C</span>
              <span>
                Charl<small>Workshop owner · Demo</small>
              </span>
              <Check size={14} />
            </div>
          </div>
        </aside>
        <div className="crm-body" inert={mobile && sidebar}>
          <header className="crm-topbar">
            <div className="crm-breadcrumb">
              <button
                className="crm-mobile-toggle"
                onClick={() => setSidebar(!sidebar)}
                aria-label="Open workspace navigation"
                aria-expanded={sidebar}
              >
                <Menu size={20} />
              </button>
              <span>Workspace</span>
              <ChevronRight size={13} />
              <strong>{navigation.find((item) => item.id === view)!.label}</strong>
            </div>
            <div className="crm-search">
              <Search size={15} />
              <label className="visually-hidden" htmlFor="crm-search">
                Search workspace
              </label>
              <input
                id="crm-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search enquiries, people, ideas…"
              />
              <kbd>/</kbd>
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="crm-topbar-right">
              <span className="crm-local-badge">
                <span />
                LOCAL DEMO
              </span>
              <span className="crm-avatar">C</span>
            </div>
          </header>
          <main className="crm-main">
            <div className="crm-page-title">
              <div>
                <span className="crm-mono">THE WORKSHOP, AT A GLANCE</span>
                <h1>
                  {view === 'overview'
                    ? 'Workshop overview'
                    : view === 'enquiries'
                      ? 'Every idea, in one place.'
                      : view === 'pipeline'
                        ? 'From idea to finished piece.'
                        : 'People behind the ideas.'}
                </h1>
                <p>
                  {view === 'overview'
                    ? 'A little clarity. More room to create.'
                    : view === 'pipeline'
                      ? 'Drag a card to a new stage, or open it to make an update.'
                      : view === 'contacts'
                        ? 'Contacts collected from your saved demo enquiries.'
                        : 'Follow up, add the details, and keep good things moving.'}
                </p>
              </div>
              <button className="crm-button crm-button-primary" onClick={() => setCreating(true)}>
                <Plus size={16} />
                New enquiry
              </button>
            </div>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            {view === 'overview' && (
              <motion.section
                className="crm-welcome"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/images/studio/clock-studio.webp"
                  alt="A reconstructed studio view of Charl’s wooden clock"
                />
                <div className="crm-welcome-shade" />
                <div className="crm-welcome-copy">
                  <span className="crm-mono">
                    {new Intl.DateTimeFormat('en-ZA', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      timeZone: 'Africa/Johannesburg',
                    }).format(new Date())}
                  </span>
                  <h2>
                    Good work starts
                    <br />
                    with a little <em>idea.</em>
                  </h2>
                  <p>Your creations. Your conversations. A little more organised.</p>
                  <Link to="/" className="crm-welcome-link">
                    Visit your storefront <ArrowUpRight size={15} />
                  </Link>
                </div>
                <div className="crm-focus-card">
                  <span className="crm-mono">:: TODAY’S FOCUS</span>
                  <div>
                    <strong>{active}</strong>
                    <span>open {active === 1 ? 'conversation' : 'conversations'}</span>
                  </div>
                  <p>
                    {counts[0]
                      ? `${counts[0]} new ${counts[0] === 1 ? 'idea is' : 'ideas are'} waiting for a little attention.`
                      : 'A clear workbench. Room for your next idea.'}
                  </p>
                  <button
                    onClick={() => {
                      navigate('enquiries')
                      setFilter('New enquiry')
                    }}
                  >
                    See new enquiries <ArrowRight size={15} />
                  </button>
                </div>
              </motion.section>
            )}
            {view !== 'contacts' && (
              <div className="crm-stat-grid">
                {statuses.map((status, i) => {
                  const Icon = stageIcons[i]
                  return (
                    <motion.button
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.4 }}
                      key={status}
                      className={`crm-stat ${filter === status ? 'selected' : ''}`}
                      onClick={() => {
                        setView('enquiries')
                        setFilter(filter === status ? 'All' : status)
                      }}
                    >
                      <span className="crm-stat-label">
                        {stageLabels[i]}
                        <span className={`crm-stat-icon ${stageClass(status)}`}>
                          <Icon size={16} />
                        </span>
                      </span>
                      <span className="crm-stat-value">
                        {counts[i]}
                        <ArrowUpRight size={15} />
                      </span>
                      <small>{stageHelp[i]}</small>
                    </motion.button>
                  )
                })}
              </div>
            )}
            <div className={`crm-content-grid ${view === 'overview' ? '' : 'crm-content-full'}`}>
              <div className="crm-primary-panel">
                {view === 'pipeline' ? (
                  <section className="crm-panel crm-board-panel">
                    <div className="crm-panel-heading">
                      <div>
                        <h2>Enquiry pipeline</h2>
                        <p>{searched.length} ideas · Four thoughtful steps</p>
                      </div>
                      <Columns3 size={18} />
                    </div>
                    <div className="crm-kanban">
                      {statuses.map((status, index) => (
                        <div
                          key={status}
                          className={`crm-kanban-column ${dragging && dropStage === status ? 'drag-target' : ''}`}
                          onDragOver={(event) => {
                            event.preventDefault()
                            setDropStage(status)
                          }}
                          onDragLeave={() => setDropStage(null)}
                          onDrop={(event) => {
                            event.preventDefault()
                            const id = event.dataTransfer.getData('text/plain')
                            if (enquiries.some((enquiry) => enquiry.id === id))
                              changeStatus(id, status)
                            setDragging(null)
                            setDropStage(null)
                          }}
                        >
                          <h3>
                            <span className={`status-dot status-${index}`} />
                            {stageLabels[index]}
                            <span>
                              {searched.filter((enquiry) => enquiry.status === status).length}
                            </span>
                          </h3>
                          {searched
                            .filter((enquiry) => enquiry.status === status)
                            .map((enquiry) => (
                              <PipelineCard
                                key={enquiry.id}
                                enquiry={enquiry}
                                onOpen={setSelected}
                                onDrag={setDragging}
                              />
                            ))}
                          {!searched.some((enquiry) => enquiry.status === status) && (
                            <div className="crm-kanban-empty">Room for the next idea.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : view === 'contacts' ? (
                  <section className="crm-panel">
                    <div className="crm-panel-heading">
                      <div>
                        <h2>
                          Your contacts <span>{contacts.length}</span>
                        </h2>
                        <p>Created from saved enquiries. Sample contacts are marked.</p>
                      </div>
                      <UsersRound size={18} />
                    </div>
                    <div className="crm-contact-grid">
                      {shownContacts.map((contact) => (
                        <button
                          key={contact.name + contact.phone}
                          className="crm-contact"
                          onClick={() => {
                            setView('enquiries')
                            setFilter('All')
                            setQuery(contact.name)
                          }}
                        >
                          <span className="crm-avatar">{initials(contact.name)}</span>
                          <strong>
                            {contact.name}
                            {contact.isSample && <small className="crm-sample-tag">SAMPLE</small>}
                          </strong>
                          <span>{contact.phone}</span>
                          <div>
                            <span>
                              {contact.count} {contact.count === 1 ? 'enquiry' : 'enquiries'}
                            </span>
                            <ArrowUpRight size={15} />
                          </div>
                        </button>
                      ))}
                      {!shownContacts.length && (
                        <div className="crm-empty">
                          <UsersRound size={28} />
                          <h3>
                            {contacts.length
                              ? 'No contacts match this search.'
                              : 'Every creation starts with someone.'}
                          </h3>
                          <p>
                            {contacts.length
                              ? 'Try a different name or WhatsApp number.'
                              : 'Contacts appear here when you save an enquiry.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                ) : (
                  <section className="crm-panel crm-enquiries-panel">
                    <div className="crm-panel-heading">
                      <div>
                        <h2>
                          {view === 'overview' ? 'Latest enquiries' : 'All enquiries'}
                          <span>{filtered.length}</span>
                        </h2>
                        <p>A few little ideas, ready for their next step.</p>
                      </div>
                      <div className="crm-panel-actions">
                        <button
                          className="crm-small-button"
                          onClick={exportEnquiries}
                          disabled={!filtered.length}
                          aria-label="Export filtered enquiries"
                        >
                          <ArrowDownToLine size={14} />
                          <span>Export</span>
                        </button>
                        {view === 'overview' && (
                          <button
                            className="crm-small-button"
                            onClick={() => navigate('enquiries')}
                          >
                            View all
                            <ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="crm-table-tools">
                      <div className="crm-filter-chips" role="group" aria-label="Filter enquiries">
                        {(['All', ...statuses] as const).map((status, i) => (
                          <button
                            key={status}
                            aria-pressed={filter === status}
                            className={filter === status ? 'active' : ''}
                            onClick={() => setFilter(status)}
                          >
                            {status === 'All'
                              ? 'All enquiries'
                              : ['New', 'Awaiting quote', 'In progress', 'Completed'][i - 1]}
                          </button>
                        ))}
                      </div>
                      <label className="crm-sort">
                        <ListFilter size={13} />
                        <span className="visually-hidden">Sort enquiries</span>
                        <select value={sort} onChange={(event) => setSort(event.target.value)}>
                          <option value="newest">Newest first</option>
                          <option value="oldest">Oldest first</option>
                          <option value="customer">Customer A–Z</option>
                        </select>
                      </label>
                    </div>
                    {visible.length ? (
                      <div className="crm-enquiry-table">
                        <div className="crm-table-labels">
                          <span>Customer</span>
                          <span>Creation</span>
                          <span>Qty</span>
                          <span>Stage</span>
                          <span>Received</span>
                          <span />
                        </div>
                        {visible.map((enquiry) => (
                          <button
                            className="enquiry-row crm-enquiry-row"
                            key={enquiry.id}
                            onClick={() => setSelected(enquiry.id)}
                          >
                            <span className="crm-table-client">
                              <span className="crm-avatar">{initials(enquiry.name)}</span>
                              <span>
                                <strong>
                                  {enquiry.name}
                                  {enquiry.isSample && (
                                    <i className="crm-sample-dot" title="Sample enquiry" />
                                  )}
                                </strong>
                                <small>{enquiryNumber(enquiry.id)}</small>
                              </span>
                            </span>
                            <span className="crm-table-product">
                              <img src={productPhoto(enquiry.product)} alt="" />
                              <span>{enquiry.product}</span>
                            </span>
                            <span className="crm-table-qty">{enquiry.quantity}</span>
                            <span className={`status-badge ${stageClass(enquiry.status)}`}>
                              <i />
                              {enquiry.status}
                            </span>
                            <span className="crm-table-date">{crmDate(enquiry.createdAt)}</span>
                            <ArrowUpRight size={15} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="crm-empty">
                        <Inbox size={31} strokeWidth={1.2} />
                        <h3>
                          {enquiries.length
                            ? 'No ideas match this view.'
                            : 'Your next little idea belongs here.'}
                        </h3>
                        <p>
                          {enquiries.length
                            ? 'Try another search or stage.'
                            : 'Add an enquiry, try the customer journey, or explore clearly labelled sample data.'}
                        </p>
                        {enquiries.length ? (
                          <button
                            className="crm-button crm-button-secondary"
                            onClick={() => {
                              setQuery('')
                              setFilter('All')
                            }}
                          >
                            Clear filters
                          </button>
                        ) : (
                          <div>
                            <button
                              className="crm-button crm-button-primary"
                              onClick={() => setCreating(true)}
                            >
                              <Plus size={14} />
                              New enquiry
                            </button>
                            <Link className="crm-button crm-button-secondary" to="/#personalise">
                              Try the customer journey
                              <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="crm-table-footer">
                      <span>
                        {filtered.length
                          ? `${(page - 1) * 6 + 1}–${Math.min(page * 6, filtered.length)} of ${filtered.length} enquiries`
                          : 'No enquiries in this view'}
                      </span>
                      <div>
                        <button
                          aria-label="Previous page"
                          onClick={() => setPage(page - 1)}
                          disabled={page <= 1}
                        >
                          <ChevronLeft size={15} />
                        </button>
                        <span>
                          {page} / {totalPages}
                        </span>
                        <button
                          aria-label="Next page"
                          onClick={() => setPage(page + 1)}
                          disabled={page >= totalPages}
                        >
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </section>
                )}
                {view === 'overview' && (
                  <section className="crm-panel crm-week-panel">
                    <div className="crm-panel-heading">
                      <div>
                        <h2>A week of little ideas</h2>
                        <p>Enquiries received over the last seven days</p>
                      </div>
                      <span className="crm-mono">
                        {week.reduce((sum, day) => sum + day.count, 0)} TOTAL
                      </span>
                    </div>
                    <div className="crm-week-chart">
                      {week.map((day, i) => (
                        <div key={day.day}>
                          <span className="crm-chart-count">{day.count}</span>
                          <div className="crm-chart-track">
                            <motion.span
                              initial={reduced ? false : { height: 0 }}
                              animate={{
                                height: `${day.count ? Math.max(8, (day.count / maximum) * 100) : 3}%`,
                              }}
                              transition={{ duration: 0.65, delay: i * 0.06 }}
                              className={day.count ? 'has-enquiries' : ''}
                            />
                          </div>
                          <small>{day.day}</small>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              {view === 'overview' && (
                <aside className="crm-right-panels">
                  <section className="crm-panel crm-pipeline-summary">
                    <div className="crm-panel-heading">
                      <h2>Pipeline health</h2>
                      <span className="crm-mono">:: LIVE</span>
                    </div>
                    <div className="crm-completion">
                      <svg viewBox="0 0 120 74" aria-hidden="true">
                        <path
                          d="M12 61a48 48 0 0 1 96 0"
                          pathLength="100"
                          fill="none"
                          stroke="#e7e1d7"
                          strokeWidth="9"
                          strokeLinecap="round"
                        />
                        <motion.path
                          d="M12 61a48 48 0 0 1 96 0"
                          pathLength="100"
                          fill="none"
                          stroke="#b77b46"
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeDasharray="100"
                          initial={reduced ? false : { strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 100 - complete }}
                          transition={{ duration: 1.1 }}
                        />
                      </svg>
                      <div>
                        <strong>
                          {complete}
                          <em>%</em>
                        </strong>
                        <span>of enquiries completed</span>
                      </div>
                    </div>
                    <div className="crm-pipeline-legend">
                      {statuses.map((status, i) => (
                        <button
                          key={status}
                          onClick={() => {
                            setView('enquiries')
                            setFilter(status)
                          }}
                        >
                          <span className={`status-dot status-${i}`} />
                          {stageLabels[i]}
                          <strong>{counts[i]}</strong>
                        </button>
                      ))}
                    </div>
                  </section>
                  <section className="crm-panel crm-recent">
                    <div className="crm-panel-heading">
                      <h2>At the workbench</h2>
                      <Clock3 size={15} />
                    </div>
                    {recentActivity.length ? (
                      recentActivity.map((item) => (
                        <button key={item.id} onClick={() => setSelected(item.enquiry.id)}>
                          <span className="crm-activity-marker" />
                          <span>
                            <strong>{item.text}</strong>
                            <span>{item.enquiry.name}</span>
                            <small>{crmDate(item.at)}</small>
                          </span>
                          <ChevronRight size={13} />
                        </button>
                      ))
                    ) : (
                      <div className="crm-recent-empty">
                        The story starts with your first enquiry.
                      </div>
                    )}
                  </section>
                </aside>
              )}
            </div>
            <div className="crm-demo-banner">
              <span>
                <Sparkles size={16} />
                <span>
                  <strong>
                    {hasSamples ? 'Sample data is showing' : 'Take the workbench for a spin'}
                  </strong>
                  <small>
                    {hasSamples
                      ? 'Fictional sample enquiries are marked. Your own enquiries stay separate.'
                      : 'Explore a populated CRM with clearly labelled fictional enquiries.'}
                  </small>
                </span>
              </span>
              <button
                className="crm-small-button"
                onClick={() => mutate(hasSamples ? removeSampleEnquiries : loadSampleEnquiries)}
              >
                {hasSamples ? 'Remove sample data' : 'Load sample enquiries'}
                <ArrowRight size={14} />
              </button>
            </div>
            <footer className="crm-footer">
              <span>
                <span className="crm-online-dot" />
                Saved locally in this browser
              </span>
              <span>Handmade by Charl · Workshop CRM</span>
              <Link to="/">
                Back to the website <ArrowUpRight size={12} />
              </Link>
            </footer>
          </main>
        </div>
      </div>
      <AnimatePresence>
        {detail && (
          <EnquiryDrawer
            key={detail.id}
            enquiry={detail}
            onClose={close}
            onStatus={changeStatus}
            onUpdated={load}
          />
        )}
        {creating && (
          <NewEnquiry
            onClose={closeNew}
            onCreated={(id) => {
              setCreating(false)
              load()
              window.setTimeout(() => setSelected(id), 320)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
