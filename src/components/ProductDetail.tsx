import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Camera, Sparkles, ArrowUpRight } from 'lucide-react'
import type { Product } from '../types'
import { archiveNote, studioNote } from '../data/products'
import { Modal, SectionLabel } from './Shared'

export default function ProductDetail({
  product,
  source,
  onClose,
  onEnquire,
}: {
  product: Product
  source: 'featured' | 'product'
  onClose: () => void
  onEnquire: (product: Product) => void
}) {
  const [photo, setPhoto] = useState(0)
  const [original, setOriginal] = useState(false)
  const reduced = useReducedMotion()
  const images = original ? product.images : product.studioImages
  return (
    <Modal
      onClose={onClose}
      titleId="product-detail-title"
      className="product-detail product-detail-v2"
    >
      <header className="detail-page-header">
        <button className="detail-back" onClick={onClose}>
          <ArrowRight size={16} />
          Back to the collection
        </button>
        <span>HANDMADE BY CHARL / {product.category}</span>
      </header>
      <div className="detail-visual">
        <div className="detail-image-modes" role="group" aria-label="Choose product image source">
          <button
            aria-pressed={!original}
            onClick={() => {
              setOriginal(false)
              setPhoto(0)
            }}
          >
            <Sparkles size={14} />
            Studio view
          </button>
          <button
            aria-pressed={original}
            onClick={() => {
              setOriginal(true)
              setPhoto(0)
            }}
          >
            <Camera size={14} />
            Original photos
          </button>
        </div>
        <motion.div
          layoutId={reduced ? undefined : `${source}-${product.id}`}
          className="detail-main-image"
          transition={{ layout: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
        >
          <img
            src={images[photo]}
            alt={`${product.name}${original ? ', original product photograph' : ', AI studio visualisation'}${photo ? `, view ${photo + 1}` : ''}`}
            style={{ objectPosition: !original ? (product.studioFocus ?? 'center') : 'center' }}
          />
        </motion.div>
        {images.length > 1 && (
          <div className="detail-thumbnails" aria-label="Product photographs">
            {images.map((image, index) => (
              <button
                className={photo === index ? 'selected' : ''}
                key={image}
                aria-pressed={photo === index}
                onClick={() => setPhoto(index)}
                aria-label={`View photograph ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
        <p className="detail-visual-disclaimer">
          {original
            ? 'Charl’s original archive photography. Historical labels may be visible.'
            : 'AI studio visualisation · Original product photography available above.'}
        </p>
      </div>
      <motion.div
        className="detail-copy"
        initial={reduced ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        <SectionLabel>{product.category}</SectionLabel>
        <h2 id="product-detail-title">{product.name}</h2>
        <p>{product.description}</p>
        <span className="detail-material">{product.material}</span>
        <p className="detail-footnote">
          {original ? <Camera size={15} /> : <Sparkles size={15} />}
          {original
            ? 'Actual photograph of Charl’s work'
            : 'Reconstructed from Charl’s product references'}
        </p>
        <button className="button button-copper" onClick={() => onEnquire(product)}>
          Enquire about this
          <ArrowUpRight size={18} />
        </button>
        <p className="archive-note">
          {original ? archiveNote : studioNote} Design, materials and personalisation can be
          discussed with Charl.
        </p>
        <span className="detail-craft-signature">Small things. Thoughtfully made.</span>
      </motion.div>
    </Modal>
  )
}
