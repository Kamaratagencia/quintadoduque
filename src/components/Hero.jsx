import { useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { MapPin, CalendarBlank, BookOpenText, ArrowDown, Star } from '@phosphor-icons/react'

import hero1 from '../assets/hero1.png'
import hero2 from '../assets/hero2.png'
import hero3 from '../assets/hero3.png'

const HERO_IMAGES = [
  { src: hero1, alt: 'Salao com fonte de pedra, arvore de natal, mesas postas' },
  { src: hero2, alt: 'Salao principal com adega, luz quente, vigas de madeira' },
  { src: hero3, alt: 'Salao amplo, arcos de pedra, cadeiras bege, luz noturna' },
]

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1],
      delay: custom || 0,
    },
  }),
}

function TheForkBadge({ className, delay = 1.5, style: extraStyle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={className}
      style={{
        background: 'rgba(16,5,2,0.7)',
        border: '1px solid rgba(205,152,46,0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 12,
        padding: '12px 16px',
        ...extraStyle,
      }}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center gap-2"
      >
        <Star size={14} weight="fill" className="text-gold-deep" />
        <span className="font-sans text-[13px] text-gold-medium font-medium">
          9.1 &middot; TheFork
        </span>
      </motion.div>
    </motion.div>
  )
}

function HeroTextContent({ onOpenMenu, scrollToSection, isMobile }) {
  return (
    <>
      <motion.h1
        custom={isMobile ? 0.6 : 0.5}
        variants={childVariants}
        initial="hidden"
        animate="visible"
        className="font-display font-bold text-white text-[36px] md:text-[56px] lg:text-[72px] leading-[1.08] max-w-[620px]"
      >
        Uma Mesa no Cora&ccedil;&atilde;o
        <br />
        de <span className="gold-text">Portugal</span>
      </motion.h1>

      <motion.p
        custom={isMobile ? 0.8 : 0.8}
        variants={childVariants}
        initial="hidden"
        animate="visible"
        className="font-sans text-[16px] md:text-[18px] text-beige max-w-[460px] leading-[1.7] mt-6"
      >
        Cozinha portuguesa de alma. Vinhos da terra. Um espaco onde cada
        refeicao se torna memoria para sempre.
      </motion.p>

      <motion.div
        custom={isMobile ? 1.0 : 1.0}
        variants={childVariants}
        initial="hidden"
        animate="visible"
        className={`flex gap-4 mt-10 ${isMobile ? 'flex-col w-full' : 'flex-wrap items-center'}`}
      >
        <button
          data-cursor="button"
          onClick={() => scrollToSection('reservas')}
          className={`btn-primary cursor-none ${isMobile ? 'w-full justify-center' : ''}`}
        >
          <CalendarBlank size={18} weight="bold" />
          Reservar Mesa
        </button>
        <button
          data-cursor="button"
          onClick={onOpenMenu}
          className={`btn-outline border-white/60 text-white hover:bg-white hover:text-stone-darkest cursor-none ${isMobile ? 'w-full justify-center' : ''}`}
        >
          <BookOpenText size={18} weight="bold" />
          Ver Menu
        </button>
      </motion.div>
    </>
  )
}

export default function Hero({ onOpenMenu }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', containScroll: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => emblaApi.off('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const { scrollY } = useScroll()
  const imagesY = useTransform(scrollY, [0, 600], ['0%', '15%'])
  const contentY = useTransform(scrollY, [0, 600], ['0%', '-8%'])
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <div className="relative min-h-[100svh] overflow-hidden" style={{ backgroundColor: '#100502' }}>

      {/* ═══ DESKTOP LAYOUT (≥1024px) — EDITORIAL FULLSCREEN ═══ */}
      <div
        className="hidden lg:block"
        style={{
          height: '100svh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: '#100502',
        }}
      >
        {/* CAMADA 1 — Mosaico de imagens */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.9fr 0.9fr',
            gridTemplateRows: '1fr',
            gap: 3,
            y: imagesY,
          }}
        >
          {/* Imagem 1 — coluna esquerda */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.img
              src={hero1}
              alt={HERO_IMAGES[0].alt}
              loading="eager"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                willChange: 'transform',
              }}
            />
          </div>

          {/* Imagem 2 — coluna do meio */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.img
              src={hero2}
              alt={HERO_IMAGES[1].alt}
              loading="eager"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                willChange: 'transform',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(16,5,2,0.2), rgba(16,5,2,0.0))',
              }}
            />
          </div>

          {/* Imagem 3 — coluna direita */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.img
              src={hero3}
              alt={HERO_IMAGES[2].alt}
              loading="eager"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                willChange: 'transform',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(16,5,2,0.2), rgba(16,5,2,0.0))',
              }}
            />
          </div>
        </motion.div>

        {/* CAMADA 2 — Overlays de profundidade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(16,5,2,0.96) 0%, rgba(16,5,2,0.80) 25%, rgba(16,5,2,0.40) 52%, rgba(16,5,2,0.10) 70%, rgba(16,5,2,0.0) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(16,5,2,0.65) 0%, rgba(16,5,2,0.0) 30%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(16,5,2,0.60) 0%, rgba(16,5,2,0.0) 25%)',
          }}
        />

        {/* CAMADA 3 — Linha dourada vertical decorativa */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.0, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute',
            left: 52,
            top: '20%',
            height: 140,
            width: 1,
            background: 'linear-gradient(transparent, #CD982E 30%, #CD982E 70%, transparent)',
            opacity: 0.5,
            transformOrigin: 'top',
          }}
        />

        {/* CAMADA 4 — Conteúdo principal */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 96,
            pointerEvents: 'none',
            y: contentY,
            opacity: contentOpacity,
          }}
          className="px-16 2xl:px-24"
        >
          <div style={{ maxWidth: 720 }}>
            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <motion.div
                animate={{
                  borderColor: [
                    'rgba(205,152,46,0.28)',
                    'rgba(205,152,46,0.55)',
                    'rgba(205,152,46,0.28)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(205,152,46,0.10)',
                  border: '1px solid rgba(205,152,46,0.28)',
                  borderRadius: 100,
                  padding: '6px 16px',
                  width: 'fit-content',
                }}
              >
                <MapPin size={14} weight="duotone" color="#CD982E" />
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#D2A956',
                  }}
                >
                  Guilhabreu · Vila do Conde · Portugal
                </span>
              </motion.div>
            </motion.div>

            {/* Título H1 — duas linhas com stagger */}
            <h1 style={{ marginTop: 20, maxWidth: 620 }}>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(52px, 5.5vw, 88px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.06,
                  display: 'block',
                }}
              >
                Uma Mesa no Cora&ccedil;&atilde;o
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.50 }}
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(52px, 5.5vw, 88px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.06,
                  display: 'block',
                }}
              >
                de <span className="gold-text">Portugal</span>
              </motion.span>
            </h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 17,
                color: '#D2AF91',
                lineHeight: 1.7,
                maxWidth: 460,
                marginTop: 24,
              }}
            >
              Cozinha portuguesa de alma. Vinhos da terra. Um espa&ccedil;o onde cada
              refei&ccedil;&atilde;o se torna mem&oacute;ria para sempre.
            </motion.p>

            {/* Grupo de botões */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.80 }}
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginTop: 40,
                pointerEvents: 'auto',
              }}
            >
              <button
                data-cursor="button"
                onClick={() => scrollToSection('reservas')}
                className="btn-primary cursor-none"
              >
                <CalendarBlank size={18} weight="bold" />
                Reservar Mesa
              </button>
              <motion.button
                data-cursor="button"
                onClick={onOpenMenu}
                className="btn-outline border-white/50 text-white hover:bg-white hover:text-stone-darkest cursor-none"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <BookOpenText size={18} weight="bold" />
                Ver Menu
              </motion.button>
            </motion.div>

            {/* Linha separadora gold animada */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
              style={{
                height: 1,
                background: 'linear-gradient(to right, #CD982E, transparent)',
                marginTop: 40,
              }}
            />

            {/* Trio de Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 40,
                marginTop: 28,
              }}
            >
              {/* Stat 1 — TheFork */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#CD982E',
                    }}
                  >
                    9.1
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      color: 'rgba(210,175,145,0.50)',
                      marginLeft: 2,
                    }}
                  >
                    /10
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: 'rgba(210,175,145,0.50)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginTop: 4,
                  }}
                >
                  TheFork &middot; 30 avalia&ccedil;&otilde;es
                </p>
              </motion.div>

              {/* Divisor vertical */}
              <div
                style={{
                  width: 1,
                  height: 32,
                  background: 'rgba(205,152,46,0.20)',
                }}
              />

              {/* Stat 2 — Adega */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <span
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#CD982E',
                    display: 'block',
                  }}
                >
                  200+
                </span>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: 'rgba(210,175,145,0.50)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginTop: 4,
                  }}
                >
                  Refer&ecirc;ncias na Adega
                </p>
              </motion.div>

              {/* Divisor vertical */}
              <div
                style={{
                  width: 1,
                  height: 32,
                  background: 'rgba(205,152,46,0.20)',
                }}
              />

              {/* Stat 3 — Fundação */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <span
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#CD982E',
                    display: 'block',
                  }}
                >
                  1751
                </span>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: 'rgba(210,175,145,0.50)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginTop: 4,
                  }}
                >
                  Funda&ccedil;&atilde;o da Quinta
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* CAMADA 5 — Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.7 }}
          style={{
            position: 'absolute',
            bottom: 36,
            left: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            pointerEvents: 'auto',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'rgba(219,189,126,0.50)',
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ height: [0, 32, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 1,
              background: 'rgba(205,152,46,0.40)',
            }}
          />
        </motion.div>

        {/* CAMADA 6 — Indicador inferior direito */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          style={{
            position: 'absolute',
            bottom: 36,
            right: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'none',
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.20)',
                  border: '1px solid rgba(205,152,46,0.30)',
                }}
              />
              <span
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'rgba(205,152,46,0.60)',
                }}
              >
                {String(n).padStart(2, '0')}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══ MOBILE LAYOUT (<1024px) ═══ */}
      <div className="lg:hidden flex flex-col min-h-[100svh]">

        {/* TOP — Carousel */}
        <div className="relative" style={{ height: '45svh', flexShrink: 0 }}>
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {HERO_IMAGES.map((img, i) => (
                <div key={i} className="flex-none w-full h-full relative overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Overlay gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(16,5,2,0.15) 0%, rgba(16,5,2,0.0) 40%, rgba(16,5,2,0.85) 90%, rgba(16,5,2,1.0) 100%)',
            }}
          />

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {HERO_IMAGES.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width: i === selectedIndex ? 20 : 6,
                  height: 6,
                  backgroundColor: i === selectedIndex ? '#CD982E' : 'rgba(238,227,201,0.4)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            ))}
          </div>

          </div>

        {/* BOTTOM — Text content */}
        <div
          className="flex-1 flex flex-col px-6 pb-10"
          style={{
            backgroundColor: '#100502',
            marginTop: -2,
          }}
        >
          <div className="flex flex-col pt-6">
            <HeroTextContent
              onOpenMenu={onOpenMenu}
              scrollToSection={scrollToSection}
              isMobile={true}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.7 }}
            className="flex flex-col items-center gap-2 mt-auto pt-6"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <button
                data-cursor="button"
                onClick={() => scrollToSection('a-casa')}
                className="cursor-none"
              >
                <ArrowDown size={20} weight="bold" className="text-gold-light/60" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
