import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import { Collection, Gallery } from '../components/Collection'
import Personalise from '../components/Personalise'
import About from '../components/About'
import QuoteForm from '../components/QuoteForm'
import ProductDetail from '../components/ProductDetail'
import Footer from '../components/Footer'
import type { Category, Product, QuoteDraft } from '../types'

export default function Home() {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [selected, setSelected] = useState<{
    product: Product
    source: 'featured' | 'product'
  } | null>(null)
  const [draft, setDraft] = useState<QuoteDraft | null>(null)
  const { hash } = useLocation()
  const close = useCallback(() => setSelected(null), [])
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    else window.scrollTo(0, 0)
  }, [hash])
  function continueToQuote(next: QuoteDraft) {
    setDraft(next)
    setSelected(null)
    window.setTimeout(() => {
      document
        .getElementById('contact')
        ?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
        })
    }, 150)
  }
  return (
    <>
      <div inert={!!selected} id="top">
        <a className="skip-link" href="#collection">
          Skip to the collection
        </a>
        <Navigation />
        <main>
          <Hero />
          <div className="craft-ribbon" aria-label="Our approach">
            <span>Thoughtfully designed</span>
            <i />
            <span>Carefully cut</span>
            <i />
            <span>Personally yours</span>
            <i />
            <span>Handmade in South Africa</span>
          </div>
          <Collection
            onSelect={(product) => setSelected({ product, source: 'featured' })}
            onFilter={setFilter}
          />
          <Gallery
            filter={filter}
            onFilter={setFilter}
            onSelect={(product) => setSelected({ product, source: 'product' })}
          />
          <Personalise onContinue={continueToQuote} />
          <About />
          <QuoteForm draft={draft} />
        </main>
        <Footer />
      </div>
      <AnimatePresence>
        {selected && (
          <ProductDetail
            key={selected.product.id}
            product={selected.product}
            source={selected.source}
            onClose={close}
            onEnquire={(product) =>
              continueToQuote({ product: product.name, details: '', reference: null })
            }
          />
        )}
      </AnimatePresence>
    </>
  )
}
