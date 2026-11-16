import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { products, categories, studioNote } from '../data/products'
import type { Category, Product } from '../types'
import { Reveal, RoundArrow, SectionLabel } from './Shared'

const featured = [
  { product: products[1], title: 'Fairy houses', caption: 'For a world of your own', index: '01' },
  {
    product: products[2],
    title: 'Engraved gifts',
    caption: 'Everyday things, with meaning',
    index: '02',
  },
  {
    product: products[3],
    title: 'Miniature furniture',
    caption: 'Small in scale. Full of character.',
    index: '03',
  },
]

function FeaturedCard({
  product,
  title,
  caption,
  index,
  cardIndex,
  onSelect,
}: (typeof featured)[number] & { cardIndex: number; onSelect: (product: Product) => void }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0),
    y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-1, 1], [2.5, -2.5]), { stiffness: 110, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-1, 1], [-3, 3]), { stiffness: 110, damping: 22 })
  return (
    <motion.button
      className={`featured-card featured-${cardIndex}`}
      onClick={() => onSelect(product)}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={reduced ? {} : { scale: 0.985 }}
      style={reduced ? {} : { rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || reduced) return
        const bounds = event.currentTarget.getBoundingClientRect()
        x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
        y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      variants={{ rest: { y: 0 }, hover: { y: reduced ? 0 : -9 } }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="featured-image"
        layoutId={`featured-${product.id}`}
        transition={{ layout: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
      >
        <img
          src={product.studioImages[0]}
          alt={`${product.name} — AI studio visualisation`}
          loading="lazy"
          style={{ objectPosition: product.studioFocus ?? 'center' }}
        />
      </motion.div>
      <span className="featured-number">{index} /</span>
      <span className="studio-image-badge">AI STUDIO VIEW</span>
      <motion.span
        className="featured-open-hint"
        variants={{ rest: { opacity: 0, y: 20 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.45 }}
      >
        <span>Step inside</span>
        <ArrowUpRight size={22} />
      </motion.span>
      <span className="featured-copy">
        <span className="featured-caption">{caption}</span>
        <span className="featured-title">{title}</span>
        <motion.span
          className="featured-reveal-line"
          variants={{ rest: { scaleX: 0.2 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.6 }}
        />
      </span>
      <RoundArrow />
    </motion.button>
  )
}

export function Collection({
  onSelect,
  onFilter,
}: {
  onSelect: (product: Product) => void
  onFilter: (category: Category) => void
}) {
  return (
    <section id="collection" className="collection section-pad">
      <Reveal className="section-heading">
        <div>
          <SectionLabel>01 / The collection</SectionLabel>
          <h2>
            A little world,
            <br />
            <em>made of wood.</em>
          </h2>
        </div>
        <p>
          For the corner that needs a little character.
          <br className="desktop-break" /> For the person who deserves something personal.
          <br className="desktop-break" /> For the joy of a thing made by hand.
        </p>
      </Reveal>
      <div className="featured-grid">
        {featured.map(({ product, title, caption, index }, i) => (
          <Reveal delay={i * 0.1} key={product.id}>
            <FeaturedCard
              product={product}
              title={title}
              caption={caption}
              index={index}
              cardIndex={i}
              onSelect={onSelect}
            />
          </Reveal>
        ))}
      </div>
      <p className="collection-provenance">
        Studio visualisations, made from Charl’s original product references. Tap a collection to
        explore and compare.
      </p>
      <Reveal className="decorative-link">
        <span className="tiny-label">And a little of the unexpected</span>
        <a href="#our-work" onClick={() => onFilter('Décor')}>
          Discover decorative creations <ArrowRight size={20} />
        </a>
        <span className="decorative-line" />
      </Reveal>
    </section>
  )
}

export function Gallery({
  filter,
  onFilter,
  onSelect,
}: {
  filter: Category | 'All'
  onFilter: (category: Category | 'All') => void
  onSelect: (product: Product) => void
}) {
  const reduced = useReducedMotion()
  const shown = products.filter((product) => filter === 'All' || product.category === filter)
  return (
    <section id="our-work" className="work-section section-pad">
      <Reveal className="section-heading">
        <div>
          <SectionLabel>02 / From the workbench</SectionLabel>
          <h2>
            Honest materials.
            <br />
            <em>Wonderful possibilities.</em>
          </h2>
        </div>
        <p>
          A few of the things Charl has made.
          <br />
          Find a favourite, or let it spark an idea of your own.
        </p>
      </Reveal>
      <div className="gallery-toolbar">
        <div className="gallery-filters" role="group" aria-label="Filter our work">
          {(['All', ...categories] as const).map((category) => (
            <button
              key={category}
              onClick={() => onFilter(category)}
              aria-pressed={filter === category}
              className={filter === category ? 'selected' : ''}
            >
              {category === 'All' ? 'All creations' : category}
            </button>
          ))}
        </div>
        <span className="gallery-count" aria-live="polite">
          {String(shown.length).padStart(2, '0')} pieces
        </span>
      </div>
      <motion.div layout={!reduced} className="gallery-grid">
        {shown.map((product, i) => (
          <motion.button
            layout={!reduced}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.035, layout: { duration: 0.4 } }}
            className="product-card"
            key={product.id}
            onClick={() => onSelect(product)}
          >
            <motion.div
              layoutId={reduced ? undefined : `product-${product.id}`}
              className={`product-image studio-view ${product.imageClass ?? ''}`}
            >
              <img
                src={product.studioImages[0]}
                alt={`${product.name} — AI studio visualisation`}
                loading="lazy"
                style={{ objectPosition: product.studioFocus ?? 'center' }}
              />
              <span className="studio-image-badge">STUDIO VIEW</span>
              <span className="product-view">
                Take a closer look <ArrowUpRight size={17} />
              </span>
            </motion.div>
            <span className="product-info">
              <span>
                <small>{product.category}</small>
                <span className="product-name">{product.name}</span>
              </span>
              <ArrowUpRight className="product-card-arrow" size={19} strokeWidth={1.5} />
            </span>
          </motion.button>
        ))}
      </motion.div>
      <p className="archive-note">{studioNote}</p>
    </section>
  )
}
