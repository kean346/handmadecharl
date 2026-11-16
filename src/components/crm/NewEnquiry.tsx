import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from '../Shared'
import { saveEnquiry } from '../../lib/enquiries'
import { products } from '../../data/products'
import ReferenceUpload from '../ReferenceUpload'
import type { ReferenceImage } from '../../types'

export default function NewEnquiry({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [reference, setReference] = useState<ReferenceImage | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name')).trim(),
      phone = String(data.get('phone')).trim()
    if (
      !name ||
      !/^\+?[\d ()-]{7,24}$/.test(phone) ||
      phone.replace(/\D/g, '').length < 7 ||
      phone.replace(/\D/g, '').length > 15
    ) {
      setError('Add a name and a valid WhatsApp number.')
      return
    }
    try {
      const saved = saveEnquiry({
        name,
        phone,
        product: String(data.get('product')),
        quantity: Number(data.get('quantity')),
        details: String(data.get('details')).trim(),
        notes: '',
        reference,
      })
      onCreated(saved.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The enquiry could not be saved.')
    }
  }
  return (
    <Modal onClose={onClose} titleId="new-enquiry-title" className="crm-new-enquiry">
      <span className="crm-mono">A NEW BEGINNING</span>
      <h2 id="new-enquiry-title">New enquiry</h2>
      <p>Add an idea to the workshop. This saves locally for the demo.</p>
      <form onSubmit={submit} className="quote-form">
        <div className="form-two-col">
          <label>
            Customer name *
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="First and last name"
            />
          </label>
          <label>
            WhatsApp number *
            <input
              name="phone"
              type="tel"
              required
              maxLength={24}
              autoComplete="tel"
              placeholder="084 123 4567"
            />
          </label>
        </div>
        <div className="form-product-row">
          <label>
            Product *
            <select name="product" required defaultValue="">
              <option value="" disabled>
                Choose a creation
              </option>
              {products.map((product) => (
                <option key={product.id}>{product.name}</option>
              ))}
              <option>Personalised wooden spoon</option>
              <option>Custom woodwork</option>
            </select>
          </label>
          <label>
            Quantity *
            <input name="quantity" type="number" required min={1} max={1000} defaultValue={1} />
          </label>
        </div>
        <label>
          The idea
          <textarea
            name="details"
            rows={3}
            maxLength={1500}
            placeholder="The details that will make it theirs…"
          />
        </label>
        <ReferenceUpload value={reference} onChange={setReference} onBusyChange={setBusy} />
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="crm-new-actions">
          <button type="button" className="crm-button crm-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="crm-button crm-button-primary" type="submit" disabled={busy}>
            <Plus size={15} />
            Save enquiry
          </button>
        </div>
      </form>
    </Modal>
  )
}
