import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

const heroScenes = [
  {
    name: 'The art of time',
    type: 'Decorative clocks',
    first: 'Little details.',
    second: 'Beautifully made.',
    description: 'Laser-cut creations, personalised engraving and handmade woodwork.',
    image: '/images/studio/clock-studio.webp',
    thumbnail: '/images/studio/clock-studio.webp',
    color: '#38271d',
    accent: '#d5a365',
    focus: '72% center',
    note: 'An everyday moment. An extraordinary little detail.',
  },
  {
    name: 'A world of wonder',
    type: 'Fairy houses',
    first: 'Small creations.',
    second: 'Big imagination.',
    description: 'Tiny houses. Thoughtful details. A little world waiting to be imagined.',
    image: '/images/studio/fairy-house-studio.webp',
    thumbnail: '/images/studio/fairy-house-angle-studio.webp',
    color: '#29382b',
    accent: '#c0c08a',
    focus: '72% center',
    note: 'A small world, full of possibilities.',
  },
  {
    name: 'Yours, in wood',
    type: 'Personalised engraving',
    first: 'Made personal.',
    second: 'Made by hand.',
    description: 'A name, a memory, a little meaning. Make an everyday piece your own.',
    image: '/images/studio/engraving-studio.webp',
    thumbnail: '/images/studio/engraved-spoon-owl-studio.webp',
    color: '#492b24',
    accent: '#e0a27c',
    focus: '74% center',
    note: 'Some things mean a little more when they’re yours.',
  },
]
const ease = [0.65, 0, 0.35, 1] as const

function Headline({
  scene,
  reduced,
  outgoing,
}: {
  scene: (typeof heroScenes)[number]
  reduced: boolean
  outgoing: boolean
}) {
  let index = 0
  return (
    <h1>
      {[scene.first, scene.second].map((line, lineIndex) => (
        <span key={line} className={`headline-line line-${lineIndex}`}>
          {line.split(' ').map((word) => (
            <span className="word-mask" key={word}>
              <motion.span
                initial={reduced || outgoing ? false : { y: '108%', rotate: 2 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.2 + index++ * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
                <span className="word-space"> </span>
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function Scene({
  index,
  outgoing,
  changing,
  mask,
  reduced,
  backgroundY,
  rx,
  ry,
}: {
  index: number
  outgoing: boolean
  changing: boolean
  mask: MotionValue<string>
  reduced: boolean
  backgroundY: MotionValue<number>
  rx: MotionValue<number>
  ry: MotionValue<number>
}) {
  const scene = heroScenes[index]
  return (
    <motion.div
      className={`hero-scene v2-scene scene-${index}`}
      aria-hidden={outgoing}
      inert={outgoing}
      style={{
        backgroundColor: scene.color,
        zIndex: outgoing ? 1 : 2,
        ...(changing && !outgoing ? { maskImage: mask, WebkitMaskImage: mask } : {}),
      }}
    >
      <motion.div
        className={`hero-photograph ${index === 0 ? 'clock-perspective' : index === 1 ? 'house-composition' : 'spoon-composition'}`}
        style={reduced ? {} : { y: backgroundY, rotateX: rx, rotateY: ry }}
      >
        <motion.img
          src={scene.image}
          className={`hero-plate ${index === 0 ? 'hero-clock' : ''}`}
          alt={`AI studio visualisation of Charl’s ${scene.type.toLowerCase()}, reconstructed from supplied photographs`}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          style={{ objectPosition: scene.focus }}
          initial={
            reduced || outgoing
              ? false
              : { scale: changing ? 1.12 : 1.07, x: changing ? '2%' : '0%' }
          }
          animate={{ scale: outgoing ? 1.09 : 1.04, x: outgoing ? '-2%' : '0%' }}
          transition={{ duration: reduced ? 0 : 1.7, ease }}
        />
      </motion.div>
      <div
        className="hero-studio-tint"
        style={{
          background: `linear-gradient(90deg, ${scene.color}e6 0%, ${scene.color}8a 37%, ${scene.color}05 68%, ${scene.color}16 100%)`,
        }}
      />
      <div className="hero-top-shade" />
      <div
        className="hero-lower-blend"
        style={{
          background: `linear-gradient(0deg, ${scene.color} 0%, ${scene.color}88 35%, ${scene.color}00 100%)`,
        }}
      />
      <div className="hero-copy">
        <motion.div
          className="hero-kicker"
          initial={reduced || outgoing ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <span />
          <span>Handmade by Charl / South Africa</span>
        </motion.div>
        <Headline scene={scene} reduced={reduced} outgoing={outgoing} />
        <motion.p
          className="hero-description"
          initial={reduced || outgoing ? false : { y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          {scene.description}
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={reduced || outgoing ? false : { y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <a className="button button-copper" href={index === 2 ? '#personalise' : '#our-work'}>
            {index === 2 ? 'Make it personal' : 'Explore our work'}
            <ArrowUpRight size={18} />
          </a>
          <a className="text-link" href="#contact">
            Request a custom piece
            <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
      <div className="hero-scene-story">
        <span className="hero-story-rule" />
        <div>
          <span className="tiny-label">
            0{index + 1} / {scene.type}
          </span>
          <strong>{scene.name}</strong>
          <p>{scene.note}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero({ onSceneChange }: { onSceneChange?: (color: string) => void }) {
  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [ringTop, setRingTop] = useState(60)
  const reduced = !!useReducedMotion()
  const hero = useRef<HTMLElement>(null),
    rail = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(1)
  const mask = useTransform(progress, (p) => {
    const edge = 100 - p * 134
    return `linear-gradient(90deg, transparent ${edge}%, rgba(0,0,0,.6) ${edge + 17}%, #000 ${edge + 34}%)`
  })
  const hazeX = useTransform(progress, [0, 1], ['100vw', '-36vw'])
  const hazeOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0.25, 0.25, 0])
  const x = useMotionValue(0),
    y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-1, 1], [1.2, -1.2]), { stiffness: 65, damping: 25 })
  const ry = useSpring(useTransform(x, [-1, 1], [-1.5, 1.5]), { stiffness: 65, damping: 25 })
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 145])
  const railY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const railOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  useEffect(() => {
    heroScenes.forEach((scene) => {
      const image = new Image()
      image.src = scene.image
    })
  }, [])
  useEffect(() => {
    onSceneChange?.(heroScenes[active].color)
  }, [active, onSceneChange])
  useEffect(() => {
    if (!transitioning) return
    const control = animate(progress, 1, {
      duration: reduced ? 0.05 : 1.25,
      ease,
      onComplete: () => {
        setPrevious(null)
        setTransitioning(false)
      },
    })
    return () => control.stop()
  }, [active, transitioning, reduced, progress])
  useLayoutEffect(() => {
    const measure = () => {
      const button = rail.current?.querySelector<HTMLElement>('[aria-pressed="true"]')
      if (button) setRingTop(button.offsetTop + button.offsetHeight / 2)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])
  function change(next: number) {
    const index = (next + heroScenes.length) % heroScenes.length
    if (index === active || transitioning) return
    progress.set(0)
    setPrevious(active)
    setActive(index)
    setTransitioning(true)
  }
  const sceneProps = { changing: transitioning, mask, reduced, backgroundY, rx, ry }
  return (
    <motion.section
      ref={hero}
      className="hero hero-v2"
      aria-label="Handmade creations"
      animate={{ backgroundColor: heroScenes[active].color }}
      transition={{ duration: 1.25, ease }}
      data-scene={active}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== 'mouse') return
        const bounds = event.currentTarget.getBoundingClientRect()
        x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
        y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {previous !== null && (
        <Scene key={`out-${previous}`} {...sceneProps} index={previous} outgoing />
      )}
      <Scene key={`in-${active}`} {...sceneProps} index={active} outgoing={false} />
      {transitioning && !reduced && (
        <motion.div
          className="hero-transition-haze"
          style={{ x: hazeX, opacity: hazeOpacity }}
          aria-hidden="true"
        />
      )}
      <motion.div
        className="v2-scene-rail"
        style={reduced ? {} : { y: railY, opacity: railOpacity }}
      >
        <div ref={rail} className="v2-rail-inner" role="group" aria-label="Choose a hero scene">
          <motion.div
            className="rail-orbits"
            animate={{ top: ringTop }}
            transition={{ duration: 0.9, ease }}
            aria-hidden="true"
          >
            <span />
            <span />
          </motion.div>
          {heroScenes.map((scene, index) => (
            <motion.button
              layout
              className={`scene-thumbnail ${index === active ? 'active' : ''}`}
              style={{
                width: index === active ? 'var(--thumb-active)' : 'var(--thumb-small)',
                height: index === active ? 'var(--thumb-active)' : 'var(--thumb-small)',
              }}
              key={scene.name}
              onClick={() => change(index)}
              aria-label={`Show ${scene.type.toLowerCase()}`}
              aria-pressed={index === active}
              disabled={transitioning}
              initial={reduced ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={reduced ? {} : { scale: 1.06 }}
              transition={{
                layout: { duration: 0.9, ease },
                scale: { duration: 0.65, delay: 0.2 + index * 0.12 },
                opacity: { duration: 0.65, delay: 0.2 + index * 0.12 },
              }}
            >
              <span className="thumbnail-inner">
                <img
                  src={scene.thumbnail}
                  alt=""
                  style={{ objectPosition: index === 0 ? '73% center' : 'center' }}
                />
              </span>
              <span className="thumbnail-number">0{index + 1}</span>
            </motion.button>
          ))}
          <motion.span
            className="rail-connector"
            animate={{ top: ringTop, scaleX: transitioning ? 0 : 1 }}
            transition={{
              top: { duration: 0.9, ease },
              scaleX: { duration: 0.4, delay: transitioning ? 0 : 0.05 },
            }}
            aria-hidden="true"
          />
        </div>
      </motion.div>
      <span className="visually-hidden" aria-live="polite">
        {heroScenes[active].type}
      </span>
      <div className="hero-footer">
        <a href="#collection" className="scroll-cue">
          <span className="scroll-arrow">
            <ArrowDown size={15} />
          </span>
          <span>A world of little details</span>
        </a>
        <div className="scene-counter">
          <span className="current-scene">0{active + 1}</span>
          <span className="counter-rule" />
          <span>03</span>
          <div className="hero-prev-next">
            <button
              aria-label="Previous hero scene"
              disabled={transitioning}
              onClick={() => change(active - 1)}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              aria-label="Next hero scene"
              disabled={transitioning}
              onClick={() => change(active + 1)}
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <span className="hero-ai-note">
          AI studio visualisations<span>Original product photos inside each collection</span>
        </span>
      </div>
    </motion.section>
  )
}
