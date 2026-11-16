import type { Enquiry } from '../types'

export function customerWhatsAppUrl(enquiry: Enquiry): string | null {
  if (enquiry.isSample) return null
  const digits = enquiry.phone.replace(/\D/g, '')
  const international = digits.startsWith('0') ? `27${digits.slice(1)}` : digits
  if (!/^[1-9]\d{7,14}$/.test(international)) return null
  const message = `Hi ${enquiry.name}, it’s Charl from Handmade by Charl. Thanks for your enquiry about ${enquiry.product}. Let’s discuss the details.`
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`
}

export const crmDate = (value: string, time = false) =>
  new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(time ? ({ hour: '2-digit', minute: '2-digit' } as const) : {}),
    timeZone: 'Africa/Johannesburg',
  }).format(new Date(value))
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
