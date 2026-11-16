import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, ArrowRight, Check, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products, whatsappUrl } from '../data/products'
import { enquiryNumber, saveEnquiry } from '../lib/enquiries'
import type { Enquiry, QuoteDraft, ReferenceImage } from '../types'
import { Reveal, SectionLabel } from './Shared'
import ReferenceUpload from './ReferenceUpload'

export default function QuoteForm({ draft }: { draft: QuoteDraft | null }) {
  const [product, setProduct] = useState('')
  const [details, setDetails] = useState('')
  const [reference, setReference] = useState<ReferenceImage | null>(null)
  const [readingReference, setReadingReference] = useState(false)
  const [saved, setSaved] = useState<Enquiry | null>(null)
  const [error, setError] = useState('')
  const confirmation = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (draft) {
      setProduct(draft.product)
      setDetails(draft.details)
      setReference(draft.reference)
      setSaved(null)
      setError('')
    }
  }, [draft])
  useEffect(() => {
    if (saved) confirmation.current?.focus({ preventScroll: true })
  }, [saved])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (readingReference) return
    const fields = new FormData(event.currentTarget)
    const phoneInput = event.currentTarget.elements.namedItem('phone') as HTMLInputElement
    phoneInput.setCustomValidity('')
    const phone = String(fields.get('phone')).trim()
    if (
      !/^\+?[\d ()-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 7 ||
      phone.replace(/\D/g, '').length > 15
    ) {
      phoneInput.setCustomValidity(
        'Enter a valid WhatsApp number, including an area or country code.',
      )
      phoneInput.reportValidity()
      return
    }
    const name = String(fields.get('name')).trim()
    if (!name) {
      setError('Please tell us your name.')
      return
    }
    setError('')
    try {
      const enquiry = saveEnquiry({
        name,
        phone,
        product,
        quantity: Number(fields.get('quantity')),
        details: details.trim(),
        notes: String(fields.get('notes')).trim(),
        reference,
      })
      setSaved(enquiry)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'The request could not be saved. Please try WhatsApp instead.',
      )
    }
  }
  const options = [
    ...products.map((p) => p.name),
    'Personalised wooden spoon',
    'Personalised keepsake tag',
    'Personalised wooden plaque',
    'Something else — let’s talk',
  ]
  const selectedCategory = products.find((p) => p.name === product)?.category
  const message = saved
    ? `Hi Charl, I’d like to enquire about ${saved.quantity} × ${saved.product}.\n\n${saved.details}${saved.notes ? `\n${saved.notes}` : ''}\n\nMy name: ${saved.name}\nWhatsApp: ${saved.phone}${saved.reference ? '\nI have a reference image to attach separately.' : ''}`
    : 'Hi Charl, I have an idea for a handmade wooden creation. Can we chat?'
  return (
    <section id="contact" className="contact-section section-pad">
      <Reveal className="contact-intro">
        <SectionLabel>05 / Let’s make something</SectionLabel>
        <h2>
          It starts
          <br />
          with <em>an idea.</em>
        </h2>
        <p>
          A thoughtful gift? A little something for home?
          <br />
          Tell Charl what you have in mind.
        </p>
        <a
          className="whatsapp-contact"
          href={whatsappUrl(message)}
          target="_blank"
          rel="noreferrer"
        >
          <span className="whatsapp-icon">
            <MessageCircle size={22} strokeWidth={1.5} />
          </span>
          <span>
            Prefer a conversation?
            <strong>
              Chat with Charl on WhatsApp <ArrowUpRight size={15} />
            </strong>
            <small>084 511 7007</small>
          </span>
        </a>
        <div className="demo-note">
          <span className="demo-dot" />
          <p>
            You’re exploring a working demo.
            <br />
            Enquiries are saved only in this browser and are <strong>
              not sent to Charl.
            </strong>{' '}
            WhatsApp opens a real conversation.
          </p>
        </div>
      </Reveal>
      <Reveal className="quote-form-wrap" delay={0.1}>
        {saved ? (
          <div className="quote-success" ref={confirmation} tabIndex={-1} role="status">
            <span className="success-mark">
              <Check size={30} strokeWidth={1.2} />
            </span>
            <span className="tiny-label">{enquiryNumber(saved.id)}</span>
            <h3>
              An idea worth
              <br />
              <em>making.</em>
            </h3>
            <p>
              Your demo enquiry is saved in this browser.
              <br />
              It has <strong>not</strong> been delivered to Charl.
            </p>
            <div className="success-summary">
              <span>{saved.product}</span>
              <span>Quantity: {saved.quantity}</span>
            </div>
            <a
              className="button button-copper"
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
            >
              Continue on WhatsApp <ArrowUpRight size={18} />
            </a>
            <p className="upload-help">
              This opens a prefilled message. Send it yourself and attach any reference images
              separately; uploads are not sent through WhatsApp.
            </p>
            <Link className="text-link" to="/demo-dashboard">
              View the demo enquiry <ArrowRight size={17} />
            </Link>
            <button
              className="subtle-button"
              onClick={() => {
                setSaved(null)
                setDetails('')
                setReference(null)
                setProduct('')
              }}
            >
              Start another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="quote-form">
            <div className="form-heading">
              <h3>Your next little creation.</h3>
              <span>* Required</span>
            </div>
            <div className="form-two-col">
              <label>
                Your name *
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="First and last name"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                WhatsApp number *
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. 084 123 4567"
                  required
                  maxLength={24}
                  onChange={(event) => event.currentTarget.setCustomValidity('')}
                />
              </label>
            </div>
            <div className="form-product-row">
              <label>
                What do you have in mind? *
                <select
                  name="product"
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a product or idea
                  </option>
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Quantity *
                <input
                  name="quantity"
                  aria-label="Quantity"
                  type="number"
                  required
                  min="1"
                  max="1000"
                  defaultValue="1"
                />
              </label>
            </div>
            {selectedCategory && (
              <p className="prefilled-category">Selected from {selectedCategory.toLowerCase()}</p>
            )}
            <label>
              Make it personal
              <textarea
                name="details"
                rows={3}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                maxLength={1500}
                placeholder="A name, a message, a special detail…"
              />
            </label>
            <label>
              Anything else?
              <textarea
                name="notes"
                rows={2}
                maxLength={1500}
                placeholder="An occasion, a size, or a little more about your idea."
              />
            </label>
            <ReferenceUpload
              value={reference}
              onChange={setReference}
              onBusyChange={setReadingReference}
            />
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="button button-dark quote-submit"
              disabled={readingReference}
            >
              Save demo enquiry <ArrowUpRight size={18} />
            </button>
            <p className="form-disclaimer">
              No payment. No order placed. Just the beginning of an idea.
              <br />
              Saved locally for demonstration; nothing is sent automatically.
            </p>
          </form>
        )}
      </Reveal>
    </section>
  )
}
