import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionLabel } from './Shared'

const scenes = [
  {
    name: 'The art of time',
    type: 'Decorative clocks',
    first: 'Little details.',
    second: 'Beautifully made.',
    description: 'Laser-cut creations, personalised engraving and handmade woodwork.',
    thumbnail: '/images/charl-clock-real.jpg',
    number: '01',
    note: 'A study in little details',
    image: '/images/charl-clock-hero.webp',
  },
  {
    name: 'A world of wonder',
    type: 'Fairy houses',
    first: 'Small creations.',
    second: 'Big imagination.',
    description: 'Tiny houses. Thoughtful details. A little world waiting to be imagined.',
    thumbnail: '/images/fairy-house-front.jpg',
    number: '02',
    note: 'For the wonderfully imaginative',
    image: '/images/fairy-house-angle.jpg',
  },
  {
    name: 'Yours, in wood',
    type: 'Personalised engraving',
    first: 'Made personal.',
    second: 'Made by hand.',
    description: 'A name, a memory, a little meaning. Make an everyday piece your own.',
    thumbnail: '/images/engraved-spoon-rose.jpg',
    number: '03',
    note: 'An everyday thing, made meaningful',
    image: '/images/engraved-spoon-rose.jpg',
  },
]
const ease = [0.76, 0, 0.24, 1] as const

function SceneFrame({ children, ...props }: HTMLMotionProps<'div'>) {
  const present = useIsPresent()
  return (
    <motion.div {...props} aria-hidden={!present} inert={!present}>
      {children}
    </motion.div>
  )
}

function Headline({ first, second, reduced }: { first: string; second: string; reduced: boolean }) {
  let index = 0
  return (
    <h1>
      {[first, second].map((line, lineIndex) => (
        <span className={`headline-line line-${lineIndex}`} key={line}>
          {line.split(' ').map((word) => {
            const delay = 0.15 + index++ * 0.09
            return (
              <span className="word-mask" key={word}>
                <motion.span
                  initial={reduced ? false : { y: '115%', rotate: 3 }}
                  animate={{ y: '0%', rotate: 0 }}
                  transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                  <span className="word-space"> </span>
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export default function Hero() {
  const [active, setActive] = useState(0)
  const [hasChanged, setHasChanged] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const reduced = !!useReducedMotion()
  const hero = useRef<HTMLElement>(null)
  const x = useMotionValue(0),
    y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-1, 1], [3, -3]), { stiffness: 70, damping: 22 })
  const ry = useSpring(useTransform(x, [-1, 1], [-4, 4]), { stiffness: 70, damping: 22 })
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const productY = useTransform(scrollYProgress, [0, 1], [0, 85])
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const change = (next: number) => {
    if (next === active || transitioning) return
    setHasChanged(true)
    setTransitioning(true)
    setActive((next + scenes.length) % scenes.length)
  }
  return (
    <section
      ref={hero}
      className="hero"
      aria-label="Handmade creations"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== 'mouse') return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set(((event.clientX - rect.left) / rect.width - 0.5) * 2)
        y.set(((event.clientY - rect.top) / rect.height - 0.5) * 2)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <AnimatePresence initial={true} mode="sync">
        <SceneFrame
          className={`hero-scene scene-${active}`}
          key={active}
          initial={{ clipPath: reduced || !hasChanged ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{
            clipPath: reduced ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
            opacity: reduced ? 0 : 1,
          }}
          transition={{ duration: reduced ? 0.15 : 1.15, ease }}
          onAnimationComplete={() => setTransitioning(false)}
        >
          <motion.div
            className="hero-architecture"
            style={reduced ? {} : { y: backgroundY }}
            aria-hidden="true"
          >
            <div className="studio-arch" />
            <div className="sunlight" />
            <div className="studio-floor" />
          </motion.div>
          <div className="hero-copy">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              <SectionLabel>Handcrafted wood creations</SectionLabel>
            </motion.div>
            <Headline
              first={scenes[active].first}
              second={scenes[active].second}
              reduced={reduced}
            />
            <motion.p
              className="hero-description"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {scenes[active].description}
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <a
                className="button button-copper"
                href={active === 2 ? '#personalise' : '#our-work'}
              >
                {active === 2 ? 'Make it personal' : 'Explore our work'}
                <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="#contact">
                Have something in mind? <ArrowUpRight size={17} />
              </a>
            </motion.div>
          </div>
          <motion.div className="hero-object-area" style={reduced ? {} : { y: productY }}>
            {active === 0 ? (
              <>
                <div className="clock-ground-shadow" />
                <motion.div
                  className="clock-perspective"
                  style={reduced ? {} : { rotateX: rx, rotateY: ry }}
                >
                  <motion.img
                    className="hero-clock"
                    src={scenes[active].image}
                    alt="Illustrative reconstruction of Charl's ornate laser-cut wooden clock"
                    width="1124"
                    height="1399"
                    fetchPriority="high"
                    initial={reduced ? false : { opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: reduced ? 0 : [0, -9, 0] }}
                    transition={{
                      opacity: { duration: 0.9 },
                      scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                      y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  />
                </motion.div>
              </>
            ) : active === 1 ? (
              <div className="hero-photo-composition house-composition">
                <motion.img
                  src={scenes[active].image}
                  alt="Charl's actual wooden fairy house with miniature balcony"
                  initial={reduced ? false : { scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                />
                <span className="photo-annotation">Little things. Endless possibilities.</span>
              </div>
            ) : (
              <div className="spoon-composition">
                <img
                  className="spoon-image spoon-image-back"
                  src="/images/engraved-spoon-owl.jpg"
                  alt="Owl engraved on a wooden spoon"
                />
                <motion.img
                  className="spoon-image spoon-image-front"
                  src={scenes[active].image}
                  alt="Rose engraving on a wooden spoon"
                  initial={reduced ? false : { y: 20, rotate: -3 }}
                  animate={{ y: 0, rotate: -7 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="photo-annotation">A little more you.</span>
              </div>
            )}
            <div className="object-caption">
              <span>{scenes[active].type}</span>
              <span>
                {active === 0
                  ? 'Hero illustration · see actual piece below'
                  : 'From Charl’s own workbench'}
              </span>
            </div>
          </motion.div>
        </SceneFrame>
      </AnimatePresence>
      {hasChanged && !reduced && (
        <motion.div
          key={`light-${active}`}
          className="hero-wipe-light"
          aria-hidden="true"
          initial={{ left: '102%', opacity: 0 }}
          animate={{ left: '-3%', opacity: [0, 0.55, 0.55, 0] }}
          transition={{ duration: 1.15, ease }}
        />
      )}
      <span className="visually-hidden" aria-live="polite">
        {scenes[active].type}
      </span>
      <div className="scene-navigation" role="group" aria-label="Choose a hero scene">
        {scenes.map((scene, i) => (
          <motion.button
            key={scene.name}
            className={`scene-thumbnail ${active === i ? 'active' : ''}`}
            onClick={() => change(i)}
            aria-label={`Show ${scene.type.toLowerCase()}`}
            aria-pressed={active === i}
            disabled={transitioning}
            initial={reduced ? false : { opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.6 + i * 0.1 }}
          >
            <span className="thumbnail-ring" />
            <span className="thumbnail-inner">
              <img src={scene.thumbnail} alt="" />
            </span>
            <span className="thumbnail-number">0{i + 1}</span>
          </motion.button>
        ))}
      </div>
      <div className="hero-footer">
        <a href="#collection" className="scroll-cue">
          <span className="scroll-arrow">
            <ArrowDown size={16} />
          </span>
          <span>Good things, made slowly</span>
        </a>
        <div className="scene-counter">
          <span className="current-scene">{scenes[active].number}</span>
          <span className="counter-rule" />
          <span>03</span>
          <div className="hero-prev-next">
            <button
              onClick={() => change(active - 1)}
              disabled={transitioning}
              aria-label="Previous hero scene"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => change(active + 1)}
              disabled={transitioning}
              aria-label="Next hero scene"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <span className="hero-origin">
          A little wood. A lot of heart.<span>Handmade in South Africa</span>
        </span>
      </div>
    </section>
  )
}
