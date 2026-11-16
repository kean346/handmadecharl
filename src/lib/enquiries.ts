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
  const enquiry: Enquiry = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'New enquiry',
  }
  writeEnquiries([enquiry, ...readEnquiries()])
  return enquiry
}

export function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  if (!statuses.includes(status)) throw new Error('Choose a valid enquiry status.')
  writeEnquiries(
    readEnquiries().map((enquiry) => (enquiry.id === id ? { ...enquiry, status } : enquiry)),
  )
}

export function enquiryNumber(id: string) {
  return `HBC-${id.slice(0, 6).toUpperCase()}`
}
