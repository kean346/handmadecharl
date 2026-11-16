export type Category =
  'Clocks' | 'Fairy houses' | 'Engraved gifts' | 'Miniatures' | 'Décor' | 'Home & garden'

export interface Product {
  id: string
  name: string
  category: Category
  description: string
  images: string[]
  material: string
  imageClass?: string
}

export interface ReferenceImage {
  name: string
  dataUrl: string
  type: string
}

export interface QuoteDraft {
  product: string
  details: string
  reference: ReferenceImage | null
}

export const statuses = ['New enquiry', 'Awaiting quotation', 'In progress', 'Completed'] as const
export type EnquiryStatus = (typeof statuses)[number]

export interface Enquiry {
  id: string
  createdAt: string
  name: string
  phone: string
  product: string
  quantity: number
  details: string
  notes: string
  reference: ReferenceImage | null
  status: EnquiryStatus
}
