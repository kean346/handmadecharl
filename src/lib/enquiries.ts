import { statuses } from '../types'
import type { Enquiry, EnquiryStatus } from '../types'

const storageKey = 'handmade-by-charl.enquiries.v1'

function isEnquiry(value: unknown): value is Enquiry {
  if (!value || typeof value !== 'object') return false
  const e = value as Enquiry
  return (
    ['id', 'createdAt', 'name', 'phone', 'product', 'details', 'notes'].every(
      (key) => typeof e[key as keyof Enquiry] === 'string',
    ) &&
    Number.isInteger(e.quantity) &&
    e.quantity > 0 &&
    statuses.includes(e.status) &&
    (e.isSample === undefined || typeof e.isSample === 'boolean') &&
    (e.updatedAt === undefined || Number.isFinite(Date.parse(e.updatedAt))) &&
    (e.internalNotes === undefined ||
      (Array.isArray(e.internalNotes) &&
        e.internalNotes.every(
          (note) =>
            typeof note.id === 'string' &&
            typeof note.text === 'string' &&
            Number.isFinite(Date.parse(note.at)),
        ))) &&
    (e.activity === undefined ||
      (Array.isArray(e.activity) &&
        e.activity.every(
          (item) =>
            typeof item.id === 'string' &&
            typeof item.text === 'string' &&
            Number.isFinite(Date.parse(item.at)),
        ))) &&
    Number.isFinite(Date.parse(e.createdAt)) &&
    (e.reference === null ||
      (typeof e.reference?.name === 'string' &&
        typeof e.reference?.type === 'string' &&
        /^data:image\/(png|jpeg|webp);base64,/.test(e.reference?.dataUrl)))
  )
}

export function readEnquiries(): Enquiry[] {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(
      'The saved demo data could not be read. Your existing data has been preserved. Please try another browser profile for a fresh demo.',
    )
  }
  if (!Array.isArray(parsed) || !parsed.every(isEnquiry))
    throw new Error(
      'The saved demo data could not be read. Your existing data has been preserved. Please try another browser profile for a fresh demo.',
    )
  return parsed
}

function writeEnquiries(enquiries: Enquiry[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(enquiries))
    window.dispatchEvent(new Event('charl:enquiries'))
  } catch {
    throw new Error(
      'This browser could not save your enquiry. Storage may be full or unavailable. Try removing the reference image, or use the WhatsApp option below.',
    )
  }
}

export function saveEnquiry(data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
  const now = new Date().toISOString()
  const enquiry: Enquiry = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    status: 'New enquiry',
    updatedAt: now,
    activity: [{ id: crypto.randomUUID(), text: 'Enquiry created', at: now }],
  }
  writeEnquiries([enquiry, ...readEnquiries()])
  return enquiry
}

export function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  if (!statuses.includes(status)) throw new Error('Choose a valid enquiry status.')
  const now = new Date().toISOString()
  writeEnquiries(
    readEnquiries().map((enquiry) =>
      enquiry.id === id && enquiry.status !== status
        ? {
            ...enquiry,
            status,
            updatedAt: now,
            activity: [
              ...(enquiry.activity ?? []),
              { id: crypto.randomUUID(), text: `Moved to ${status.toLowerCase()}`, at: now },
            ],
          }
        : enquiry,
    ),
  )
}

export function addInternalNote(id: string, text: string) {
  const message = text.trim()
  if (!message || message.length > 1000)
    throw new Error('Add a note of between 1 and 1,000 characters.')
  const at = new Date().toISOString()
  writeEnquiries(
    readEnquiries().map((enquiry) =>
      enquiry.id === id
        ? {
            ...enquiry,
            updatedAt: at,
            internalNotes: [
              ...(enquiry.internalNotes ?? []),
              { id: crypto.randomUUID(), text: message, at },
            ],
            activity: [
              ...(enquiry.activity ?? []),
              { id: crypto.randomUUID(), text: 'Internal note added', at },
            ],
          }
        : enquiry,
    ),
  )
}

export function loadSampleEnquiries() {
  const existing = readEnquiries()
  if (existing.some((enquiry) => enquiry.isSample)) return
  const samples: Enquiry[] = [
    {
      name: 'Alex Jacobs',
      product: 'Ornamental wooden clock',
      quantity: 1,
      status: 'New enquiry',
      details: 'A decorative clock for a reading nook. Please confirm size options.',
      notes: 'Sample enquiry — fictional contact.',
    },
    {
      name: 'Leah Naidoo',
      product: 'Personalised wooden spoon',
      quantity: 6,
      status: 'Awaiting quotation',
      details: 'Six engraved spoons with individual names in a classic lettering style.',
      notes: 'Sample enquiry — fictional contact.',
    },
    {
      name: 'Sam Williams',
      product: 'A little fairy house',
      quantity: 2,
      status: 'In progress',
      details: 'Two miniature fairy houses. Natural timber finish.',
      notes: 'Sample enquiry — fictional contact.',
    },
    {
      name: 'Jamie Botha',
      product: 'Small-scale living',
      quantity: 3,
      status: 'Completed',
      details: 'A set of miniature tables for a small display.',
      notes: 'Sample enquiry — fictional contact.',
    },
    {
      name: 'Taylor Smith',
      product: 'For home & garden',
      quantity: 1,
      status: 'New enquiry',
      details: 'A bird feeder for a sheltered garden. Design to be discussed.',
      notes: 'Sample enquiry — fictional contact.',
    },
  ].map((sample, i) => {
    const at = new Date(Date.now() - i * 86400000).toISOString()
    return {
      ...sample,
      status: sample.status as EnquiryStatus,
      id: crypto.randomUUID(),
      phone: 'Sample contact',
      createdAt: at,
      updatedAt: at,
      isSample: true,
      reference: null,
      activity: [{ id: crypto.randomUUID(), text: 'Sample enquiry added', at }],
    }
  })
  writeEnquiries([...existing, ...samples])
}

export function removeSampleEnquiries() {
  writeEnquiries(readEnquiries().filter((enquiry) => !enquiry.isSample))
}

export function enquiryNumber(id: string) {
  return `HBC-${id.slice(0, 6).toUpperCase()}`
}
