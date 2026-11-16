import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import type { Product } from '../types'
import { archiveNote } from '../data/products'
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
  const reduced = useReducedMotion()
  return (
    <Modal onClose={onClose} titleId="product-detail-title" className="product-detail">
      <div className="detail-visual">
        <motion.div
          layoutId={reduced ? undefined : `${source}-${product.id}`}
          className="detail-main-image"
        >
          <img
            src={product.images[photo]}
            alt={`${product.name}${photo ? `, view ${photo + 1}` : ''}`}
          />
        </motion.div>
        {product.images.length > 1 && (
          <div className="detail-thumbnails" aria-label="Product photographs">
            {product.images.map((image, i) => (
              <button
                className={photo === i ? 'selected' : ''}
                key={image}
                onClick={() => setPhoto(i)}
                aria-label={`View photograph ${i + 1}`}
                aria-pressed={photo === i}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="detail-copy">
        <SectionLabel>{product.category}</SectionLabel>
        <h2 id="product-detail-title">{product.name}</h2>
        <p>{product.description}</p>
        <span className="detail-material">{product.material}</span>
        <p className="detail-footnote">
          <Check size={15} />
          Actual photograph of Charl’s work
        </p>
        <button className="button button-copper" onClick={() => onEnquire(product)}>
          Enquire about this <ArrowRight size={17} />
        </button>
        <p className="archive-note">
          {archiveNote} Design, materials and personalisation can be discussed with Charl.
        </p>
      </div>
    </Modal>
  )
}
