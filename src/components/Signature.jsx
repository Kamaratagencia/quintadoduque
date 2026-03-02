import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Fish, Knife, Wine, ArrowRight } from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'

import fotoBacalhau from '../assets/fotobacalhaucardapio.png'
import fotoCarne from '../assets/fotocarnecardapio.png'
import fotoVinho from '../assets/fotovinhocardapio.png'

/* ═══════════════════════════════════════════════════
   DADOS
   ═══════════════════════════════════════════════════ */

const CARDS = [
  {
    id: 'bacalhau',
    icon: Fish,
    image: fotoBacalhau,
    title: 'Bacalhau à Portuguesa',
    text: 'Receitas de família transmitidas por gerações, com o melhor bacalhau do Atlântico Norte.',
    accentLabel: 'Mar & Tradição',
  },
  {
    id: 'carnes',
    icon: Knife,
    image: fotoCarne,
    title: 'Carnes Nobres',
    text: 'Peças selecionadas, maturadas e grelhadas com a precisão que a excelência exige.',
    accentLabel: 'Fogo & Precisão',
  },
  {
    id: 'vinho',
    icon: Wine,
    image: fotoVinho,
    title: 'Adega Privada',
    text: 'Mais de 200 referências nacionais escolhidas a dedo para harmonizar com cada momento.',
    accentLabel: 'Terroir & Requinte',
  },
]

const TITLE_WORDS = 'Tradicao que se sente a mesa'.split(' ')

/* ═══════════════════════════════════════════════════
   MICRO-LABEL COM ORNAMENTOS
   ═══════════════════════════════════════════════════ */

function OrnamentedLabel() {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <div ref={ref} className="flex items-center gap-3">
      <motion.span
        initial={{ width: 0 }}
        animate={inView ? { width: 32 } : { width: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="block h-[1px] bg-gold-deep/40"
      />
      <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold-deep font-medium whitespace-nowrap">
        A Nossa Historia
      </span>
      <motion.span
        initial={{ width: 0 }}
        animate={inView ? { width: 32 } : { width: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="block h-[1px] bg-gold-deep/40"
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   TÍTULO COM STAGGER POR PALAVRA
   ═══════════════════════════════════════════════════ */

function StaggerTitle() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <h2
      ref={ref}
      className="font-display font-bold text-stone-darkest text-[36px] md:text-[48px] leading-[1.1] mt-4 max-w-[460px]"
    >
      {TITLE_WORDS.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2 + i * 0.05,
          }}
          className={`inline-block mr-[0.3em] ${
            word === 'mesa' ? 'gold-text' : ''
          }`}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  )
}

/* ═══════════════════════════════════════════════════
   BARRA DE PROGRESSO SCROLL (por card)
   ═══════════════════════════════════════════════════ */

function ScrollProgressBar({ cardRef }) {
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  const barWidth = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1.0],
    ['0%', '60%', '100%', '60%']
  )

  const dotOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1])

  const widthStyle = useMotionTemplate`${barWidth}`

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 2,
        background: 'rgba(205,152,46,0.12)',
        borderRadius: 2,
        marginTop: 20,
      }}
    >
      <motion.div
        className="h-full animate-shimmer relative"
        style={{
          width: widthStyle,
          background: 'linear-gradient(90deg, #CD982E, #DBBD7E, #CD982E)',
          backgroundSize: '200% auto',
          borderRadius: 2,
          overflow: 'visible',
        }}
      >
        <motion.span
          style={{
            opacity: dotOpacity,
            position: 'absolute',
            right: -3,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#CD982E',
            boxShadow: '0 0 8px rgba(205,152,46,0.6)',
          }}
        />
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CARD INDIVIDUAL
   ═══════════════════════════════════════════════════ */

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.7, ease: 'easeOut' } },
}

function SignatureCard({ card, index, delay }) {
  const cardRef = useRef(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const setRefs = (node) => {
    cardRef.current = node
    inViewRef(node)
  }

  const Icon = card.icon
  const ordinal = String(index + 1).padStart(2, '0')

  return (
    /* Outer wrapper — entry animation + scroll ref */
    <motion.div
      ref={setRefs}
      initial={{ y: 60, opacity: 0, rotateX: 8 }}
      animate={
        inView
          ? { y: 0, opacity: 1, rotateX: 0 }
          : { y: 60, opacity: 0, rotateX: 8 }
      }
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      style={{ zIndex: 1 }}
    >
      {/* Inner wrapper — hover variants propagated to children */}
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={{
          rest: {
            y: 0,
            boxShadow: '0 2px 24px rgba(16,5,2,0.06)',
          },
          hover: {
            y: -6,
            boxShadow:
              '0 12px 40px rgba(16,5,2,0.12), 0 0 0 1px rgba(205,152,46,0.25)',
            transition: { duration: 0.3, ease: 'easeOut' },
          },
        }}
        data-cursor="image"
        className="relative cursor-none overflow-hidden"
        style={{
          borderRadius: 20,
          background: '#FDFAF4',
          border: '1px solid rgba(205,152,46,0.15)',
        }}
      >
        {/* ── ZONA IMAGEM ── */}
        <div className="relative overflow-hidden h-[200px] lg:h-[260px]">
          <motion.img
            src={card.image}
            alt={card.title}
            loading="lazy"
            variants={imageVariants}
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay gradiente */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(16,5,2,0.0) 40%, rgba(16,5,2,0.72) 100%)',
            }}
          />

          {/* Badge accentLabel */}
          <div
            className="absolute bottom-[14px] left-[16px] flex items-center gap-1.5"
            style={{
              background: 'rgba(205,152,46,0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(205,152,46,0.30)',
              borderRadius: 100,
              padding: '5px 12px',
            }}
          >
            <Icon size={12} weight="duotone" className="text-gold-deep" />
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-gold-medium">
              {card.accentLabel}
            </span>
          </div>

          {/* Número ordinal */}
          <span
            className="absolute top-[14px] right-[16px] font-display italic text-[13px]"
            style={{ color: 'rgba(219,189,126,0.7)' }}
          >
            {ordinal}
          </span>
        </div>

        {/* ── ZONA CONTEÚDO ── */}
        <div style={{ padding: '24px 24px 28px 24px' }}>
          <motion.div variants={iconVariants} className="mb-3">
            <Icon size={32} weight="duotone" className="text-gold-deep" />
          </motion.div>

          <h3 className="font-display text-[20px] font-bold text-stone-darkest mb-2">
            {card.title}
          </h3>

          <p className="font-sans text-[14px] text-caramel leading-[1.75]">
            {card.text}
          </p>

          <ScrollProgressBar cardRef={cardRef} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   NÓS DE CONEXÃO (desktop)
   ═══════════════════════════════════════════════════ */

function ConnectionNode() {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0 }}
      animate={inView ? { scale: 1 } : { scale: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        border: '1.5px solid rgba(205,152,46,0.5)',
        background: '#FFFFFF',
        zIndex: 2,
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   COLUNA DIREITA — CARDS + LINHA CONECTORA
   ═══════════════════════════════════════════════════ */

function CardsColumn() {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="relative" style={{ perspective: 800 }}>
      {/* Linha conectora vertical — desktop only */}
      <div
        className="absolute hidden lg:block pointer-events-none"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          bottom: 0,
          width: 1,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(205,152,46,0.3) 15%, rgba(205,152,46,0.3) 85%, transparent 100%)',
          zIndex: 0,
        }}
      />

      <div className="flex flex-col gap-8 lg:gap-10 relative">
        {CARDS.map((card, i) => (
          <div key={card.id} className="relative">
            <SignatureCard card={card} index={i} delay={i * 0.15} />

            {/* Separador mobile entre cards (não no último) */}
            {i < CARDS.length - 1 && (
              <div
                className="block lg:hidden mx-auto mt-8"
                style={{
                  height: 1,
                  background:
                    'linear-gradient(90deg, transparent, rgba(205,152,46,0.2), transparent)',
                  width: '60%',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Nós de conexão — desktop only, posicionados entre os cards */}
      <div className="hidden lg:block">
        <div className="absolute" style={{ top: 'calc(33.33% - 4px)', left: 0, right: 0, zIndex: 2 }}>
          <ConnectionNode />
        </div>
        <div className="absolute" style={{ top: 'calc(66.66% - 4px)', left: 0, right: 0, zIndex: 2 }}>
          <ConnectionNode />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   BLOCO DE TEXTO ESQUERDO
   ═══════════════════════════════════════════════════ */

function TextBlock() {
  return (
    <div className="px-0">
      <OrnamentedLabel />

      <StaggerTitle />

      <AnimatedSection direction="up" delay={0.5}>
        <p className="font-sans text-[17px] text-stone-warm leading-[1.8] mt-6 max-w-[520px]">
          Na Quinta do Duque, cada prato e uma homenagem a cozinha portuguesa
          de raiz — preparada com ingredientes selecionados, tecnica apurada
          e o calor genuino de quem cozinha com orgulho.
        </p>
      </AnimatedSection>

      <AnimatedSection direction="up" delay={0.65}>
        <p className="font-sans text-[17px] text-stone-warm/70 leading-[1.8] mt-4 max-w-[520px]">
          Entre paredes de pedra centenaria e ao som do silencio da quinta,
          recebemos cada hospede como se fosse o unico. Porque para nos,
          hospitalidade nao e um servico — e uma vocacao.
        </p>
      </AnimatedSection>

      <LinkCTA />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LINK CTA
   ═══════════════════════════════════════════════════ */

function LinkCTA() {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ x: -12, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <a
        href="#a-casa"
        data-cursor="button"
        className="inline-flex items-center gap-2 mt-8 font-sans text-[14px] font-semibold text-gold-deep cursor-none group"
      >
        Conheca a nossa historia
        <motion.span
          className="inline-block"
          whileHover={{ x: 6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <ArrowRight
            size={18}
            weight="bold"
            className="text-gold-deep transition-transform duration-300 group-hover:translate-x-1"
          />
        </motion.span>
      </a>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT — SEÇÃO PRINCIPAL
   ═══════════════════════════════════════════════════ */

export default function Signature() {
  const gridRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start start', 'end end'],
  })

  const textY = useTransform(scrollYProgress, (v) => {
    if (!gridRef.current) return 0
    const maxTravel = gridRef.current.offsetHeight - window.innerHeight
    return v * Math.max(0, maxTravel)
  })

  return (
    <div className="bg-white section-padding">
      <div className="container-site">
        {/* ── MOBILE: coluna única ── */}
        <div className="block lg:hidden">
          <div className="px-0">
            <TextBlock />
          </div>
          <div className="mt-12">
            <CardsColumn />
          </div>
        </div>

        {/* ── DESKTOP: 2 colunas — JS-powered sticky ── */}
        <div ref={gridRef} className="hidden lg:grid grid-cols-[1fr_0.75fr] gap-20">
          <div>
            <motion.div
              style={{
                y: textY,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TextBlock />
            </motion.div>
          </div>
          <CardsColumn />
        </div>
      </div>
    </div>
  )
}