import { ArrowUpRight } from 'lucide-react'
import { Reveal, SectionLabel } from './Shared'

export default function About() {
  return (
    <section id="about" className="about-section section-pad">
      <Reveal className="about-image">
        <img
          src="/images/studio/clock-studio.webp"
          alt="AI studio visualisation based on Charl's ornamental wooden clock"
          loading="lazy"
        />
        <span className="about-photo-label">AI studio study · based on Charl’s original</span>
      </Reveal>
      <Reveal className="about-copy" delay={0.1}>
        <SectionLabel light>04 / The hands behind the work</SectionLabel>
        <h2>
          Made with care.
          <br />
          <em>Made by Charl.</em>
        </h2>
        <p>
          There’s something special about a thing made by hand. The grain of the wood. A carefully
          cut detail. The thought that went into making it yours.
        </p>
        <p>
          Handmade by Charl brings together laser-cut creations, personalised engraving and
          practical woodwork, right here in South Africa. From the smallest miniature to a piece for
          your home, it starts with an idea and a little imagination.
        </p>
        <a className="text-link light-link" href="#contact">
          Let’s talk about your idea <ArrowUpRight size={18} />
        </a>
        <span className="charl-signature">A little wood. A lot of heart.</span>
      </Reveal>
    </section>
  )
}
