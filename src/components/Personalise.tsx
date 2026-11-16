import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Check } from 'lucide-react'
import type { QuoteDraft, ReferenceImage } from '../types'
import ReferenceUpload from './ReferenceUpload'
import { Reveal, SectionLabel } from './Shared'

const examples = [
  { id: 'spoon', name: 'Wooden spoon' },
  { id: 'tag', name: 'Keepsake tag' },
  { id: 'plaque', name: 'Wooden plaque' },
]
const styles = [
  { id: 'serif', name: 'Classic', sample: 'Aa' },
  { id: 'script', name: 'Handwritten', sample: 'Aa' },
  { id: 'sans', name: 'Modern', sample: 'Aa' },
]

export default function Personalise({ onContinue }: { onContinue: (draft: QuoteDraft) => void }) {
  const [product, setProduct] = useState('spoon')
  const [text, setText] = useState('Made with love')
  const [lettering, setLettering] = useState('serif')
  const [reference, setReference] = useState<ReferenceImage | null>(null)
  const [readingReference, setReadingReference] = useState(false)
  const reduced = useReducedMotion()
  return (
    <section id="personalise" className="personalise-section section-pad">
      <Reveal className="personalise-heading">
        <SectionLabel>03 / Yours, in wood</SectionLabel>
        <h2>
          A little more <em>personal.</em>
        </h2>
        <p>Turn a simple piece into something that says a little more.</p>
      </Reveal>
      <div className="personalise-grid">
        <Reveal className="engraving-preview">
          <div className="preview-topline">
            <span>THE ENGRAVING STUDIO</span>
            <span>YOUR IDEA, TAKING SHAPE</span>
          </div>
          <div className="preview-stage">
            <div className="preview-guide guide-one" />
            <div className="preview-guide guide-two" />
            <AnimatePresence mode="wait">
              <motion.div
                key={product}
                className={`wood-example wood-${product}`}
                initial={reduced ? false : { opacity: 0, rotate: -5, y: 15 }}
                animate={{
                  opacity: 1,
                  rotate: product === 'spoon' ? -12 : product === 'tag' ? -5 : 0,
                  y: 0,
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="wood-grain" />
                <div className="engraving-content">
                  {reference && (
                    <img src={reference.dataUrl} alt="Your design in the illustrative preview" />
                  )}
                  <motion.span
                    key={lettering}
                    className={`engraving-text lettering-${lettering} ${text.length > 23 ? 'long-engraving' : ''}`}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    {text || 'Your words here'}
                  </motion.span>
                  <span className="engraving-flourish" aria-hidden="true">
                    — ✧ —
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="preview-bottomline">
            <span>Designed by you. Made by Charl.</span>
            <span className="preview-pencil" aria-hidden="true">
              ↗
            </span>
          </div>
          <p className="preview-disclaimer">
            Illustrative preview only. Product, placement and design are subject to Charl’s
            approval.
          </p>
        </Reveal>
        <Reveal className="engraving-controls" delay={0.1}>
          <fieldset>
            <legend>
              <span>01</span> Choose your canvas
            </legend>
            <div className="example-options">
              {examples.map((example) => (
                <label key={example.id} className={product === example.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="example-product"
                    value={example.id}
                    checked={product === example.id}
                    onChange={() => setProduct(example.id)}
                  />
                  <span>{example.name}</span>
                  {product === example.id && <Check size={13} />}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="engraving-input-group">
            <label htmlFor="engraving-text">
              <span>02</span> A few meaningful words
            </label>
            <input
              id="engraving-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={36}
              placeholder="A name. A message. A memory."
            />
            <span className="character-count">{text.length} / 36</span>
          </div>
          <fieldset>
            <legend>
              <span>03</span> Give it a little character
            </legend>
            <div className="lettering-options">
              {styles.map((style) => (
                <label key={style.id} className={lettering === style.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="lettering-style"
                    value={style.id}
                    checked={lettering === style.id}
                    onChange={() => setLettering(style.id)}
                  />
                  <span className={`lettering-sample lettering-${style.id}`}>{style.sample}</span>
                  <span>{style.name}</span>
                  {lettering === style.id && <Check size={12} />}
                </label>
              ))}
            </div>
          </fieldset>
          <ReferenceUpload
            value={reference}
            onChange={setReference}
            onBusyChange={setReadingReference}
          />
          <button
            className="button button-dark personalise-continue"
            disabled={readingReference}
            onClick={() =>
              onContinue({
                product: `Personalised ${examples.find((example) => example.id === product)!.name.toLowerCase()}`,
                details: `Engraving: ${text.trim() || '(to be discussed)'}\nLettering: ${styles.find((style) => style.id === lettering)!.name}\nIllustrative design; subject to Charl’s approval.`,
                reference,
              })
            }
          >
            Let’s make it yours <ArrowUpRight size={18} />
          </button>
          <p className="no-commitment">An idea, not an order. We’ll start with a conversation.</p>
        </Reveal>
      </div>
    </section>
  )
}
