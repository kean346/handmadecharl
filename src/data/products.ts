import type { Product, Category } from '../types'

const image = (name: string) => `/images/${name}`

export const products: Product[] = [
  {
    id: 'ornamental-clock',
    name: 'Ornamental wooden clock',
    category: 'Clocks',
    description:
      'An intricate, laser-cut wooden clock with layered scrollwork and Roman numerals. A little detail that gives a room its character.',
    images: [image('charl-clock-real.jpg')],
    material: 'Laser-cut wood · decorative clock',
  },
  {
    id: 'fairy-house',
    name: 'A little fairy house',
    category: 'Fairy houses',
    description:
      'A wooden miniature with a steep pitched roof, a tiny balcony and delicate details. Made for little worlds and big imaginations.',
    images: [
      image('fairy-house-front.jpg'),
      image('fairy-house-angle.jpg'),
      image('fairy-house-small.jpg'),
    ],
    material: 'Wood · miniature construction',
    imageClass: 'house-photo',
  },
  {
    id: 'engraved-spoons',
    name: 'Something personal',
    category: 'Engraved gifts',
    description:
      'Wooden spoons with detailed rose and owl engravings. A starting point for a thoughtful gift: ask Charl about a name, a message or your own design.',
    images: [image('engraved-spoon-rose.jpg'), image('engraved-spoon-owl.jpg')],
    material: 'Wood · personalised engraving',
  },
  {
    id: 'miniature-tables',
    name: 'Small-scale living',
    category: 'Miniatures',
    description:
      'Little wooden tables, carefully cut and assembled. A miniature take on familiar furniture for your own small-scale world.',
    images: [image('miniature-tables.jpg')],
    material: 'Laser-cut wood · miniature furniture',
    imageClass: 'table-photo',
  },
  {
    id: 'decorative-insect',
    name: 'The little winged one',
    category: 'Décor',
    description:
      'A dimensional decorative insect assembled from precisely cut pieces. Fine wings, little legs and a surprising amount of character.',
    images: [image('laser-cut-bug.jpg')],
    material: 'Laser-cut pieces · decorative model',
    imageClass: 'insect-photo',
  },
  {
    id: 'miniature-woodwork',
    name: 'Woodwork in miniature',
    category: 'Miniatures',
    description:
      'A small decorative wooden model with cut-out details. Explore the possibilities of little pieces, carefully put together.',
    images: [image('miniature-woodwork.jpg')],
    material: 'Wood · miniature model',
    imageClass: 'model-photo',
  },
  {
    id: 'festive-creations',
    name: 'A handmade Christmas',
    category: 'Décor',
    description:
      'A selection of laser-cut festive shapes and ornament kits. Ask Charl about a handmade touch for your seasonal decorating or craft project.',
    images: [image('christmas-ornament-kits.jpg')],
    material: 'Wood · seasonal craft kits',
  },
  {
    id: 'home-garden',
    name: 'For home & garden',
    category: 'Home & garden',
    description:
      'Practical wooden creations, from bird feeders and planter boxes to useful pieces for the home. Share your idea with Charl to explore what can be made.',
    images: [image('home-garden-catalog.jpg')],
    material: 'Woodwork · practical creations',
  },
]

export const categories: Category[] = [
  'Clocks',
  'Fairy houses',
  'Engraved gifts',
  'Miniatures',
  'Décor',
  'Home & garden',
]
export const businessWhatsApp = '27845117007'
export const archiveNote =
  'Archive photographs. Any pictured prices are historical; please request a current quote.'

export function whatsappUrl(message: string) {
  return `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`
}
