import { useState } from 'react'
import { ArrowUpRight, Clock3, MessageSquare, Paperclip, Plus, UserRound } from 'lucide-react'
import { Modal } from '../Shared'
import { statuses, type Enquiry, type EnquiryStatus } from '../../types'
import { addInternalNote, enquiryNumber } from '../../lib/enquiries'
import { crmDate, initials, customerWhatsAppUrl } from '../../lib/crm-format'

export default function EnquiryDrawer({
  enquiry,
  onClose,
  onStatus,
  onUpdated,
}: {
  enquiry: Enquiry
  onClose: () => void
  onStatus: (id: string, status: EnquiryStatus) => void
  onUpdated: () => void
}) {
  const [tab, setTab] = useState<'details' | 'activity'>('details')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const followUp = customerWhatsAppUrl(enquiry)
  function addNote() {
    try {
      addInternalNote(enquiry.id, note)
      setNote('')
      setError('')
      onUpdated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The note could not be saved.')
    }
  }
  return (
    <Modal
      onClose={onClose}
      titleId="enquiry-title"
      className="crm-drawer enquiry-detail"
      variant="drawer"
    >
      <div className="crm-drawer-top">
        <span className="crm-mono">ENQUIRY / {enquiryNumber(enquiry.id)}</span>
        {enquiry.isSample && <span className="crm-sample-tag">SAMPLE</span>}
      </div>
      <h2 id="enquiry-title">{enquiry.product}</h2>
      <p className="crm-subtitle">Created {crmDate(enquiry.createdAt)} · Saved in this browser</p>
      <div className="crm-client-card">
        <span className="crm-avatar">{initials(enquiry.name)}</span>
        <span>
          <strong>{enquiry.name}</strong>
          <small>{enquiry.phone}</small>
        </span>
        <UserRound size={18} />
      </div>
      <div className="crm-drawer-status">
        <label className="dashboard-status-label">
          Enquiry status
          <select
            value={enquiry.status}
            onChange={(event) => onStatus(enquiry.id, event.target.value as EnquiryStatus)}
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <span>
          <small>QUANTITY</small>
          <strong>
            {enquiry.quantity} <em>{enquiry.quantity === 1 ? 'piece' : 'pieces'}</em>
          </strong>
        </span>
      </div>
      <div className="crm-tabs" role="tablist" aria-label="Enquiry detail tabs">
        <button
          role="tab"
          aria-selected={tab === 'details'}
          aria-controls="crm-details-panel"
          id="crm-details-tab"
          onClick={() => setTab('details')}
        >
          Details & notes
        </button>
        <button
          role="tab"
          aria-selected={tab === 'activity'}
          aria-controls="crm-activity-panel"
          id="crm-activity-tab"
          onClick={() => setTab('activity')}
        >
          Activity <span>{enquiry.activity?.length ?? 1}</span>
        </button>
      </div>
      {tab === 'details' ? (
        <div id="crm-details-panel" role="tabpanel" aria-labelledby="crm-details-tab">
          <div className="enquiry-notes">
            <h3>Customisation details</h3>
            <p>{enquiry.details || 'No customisation details added.'}</p>
            <h3>Customer notes</h3>
            <p>{enquiry.notes || 'No additional notes.'}</p>
          </div>
          {enquiry.reference && (
            <figure className="enquiry-reference">
              <div className="crm-attachment-label">
                <Paperclip size={14} />
                Reference image
              </div>
              <img src={enquiry.reference.dataUrl} alt="Customer's uploaded design reference" />
              <figcaption>{enquiry.reference.name} · Local attachment</figcaption>
            </figure>
          )}
          <div className="crm-internal-notes">
            <h3>
              <MessageSquare size={15} />
              Workshop notes <span>Internal · demo only</span>
            </h3>
            {enquiry.internalNotes?.map((item) => (
              <div key={item.id} className="crm-note">
                <p>{item.text}</p>
                <small>{crmDate(item.at, true)}</small>
              </div>
            ))}
            <label className="visually-hidden" htmlFor="crm-note">
              Internal note
            </label>
            <textarea
              id="crm-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={1000}
              placeholder="Add a detail, a reminder, or the next step…"
              rows={3}
            />
            <button
              className="crm-button crm-button-secondary"
              onClick={addNote}
              disabled={!note.trim()}
            >
              <Plus size={14} />
              Add note
            </button>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          className="crm-activity-list"
          id="crm-activity-panel"
          role="tabpanel"
          aria-labelledby="crm-activity-tab"
        >
          {[
            ...(enquiry.activity ?? [
              { id: 'created', text: 'Enquiry created', at: enquiry.createdAt },
            ]),
          ]
            .reverse()
            .map((item) => (
              <div key={item.id}>
                <span>
                  <Clock3 size={13} />
                </span>
                <p>
                  <strong>{item.text}</strong>
                  <small>{crmDate(item.at, true)}</small>
                </p>
              </div>
            ))}
        </div>
      )}
      <div className="crm-drawer-footer">
        {followUp ? (
          <a
            className="crm-button crm-button-primary"
            target="_blank"
            rel="noreferrer"
            href={followUp}
          >
            Message customer
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <button className="crm-button crm-button-secondary" disabled>
            {enquiry.isSample
              ? 'Sample contact · messaging disabled'
              : 'WhatsApp unavailable for this contact'}
          </button>
        )}
        <p>
          {followUp
            ? 'Opens a draft to the customer. You send it manually. Reference files are not attached automatically.'
            : enquiry.isSample
              ? 'Sample contacts are fictional. No message is sent from this demo.'
              : 'A valid international contact number is required. Nothing has been sent.'}
        </p>
      </div>
    </Modal>
  )
}
