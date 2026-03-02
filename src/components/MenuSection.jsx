import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ArrowsOut,
  X,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Flame,
  Fish,
  Shrimp,
} from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import SectionTitle from './ui/SectionTitle'

import galeryArrozDeMarisco from '../assets/galeryarrozdemarisco.png'
import galeryBacalhau1 from '../assets/galerybacalhau1.png'
import galeryCarnes1 from '../assets/galerycarnes1.png'
import galeryCarnes2 from '../assets/galerycarnes2.png'
import galeryCostela1 from '../assets/galerycostela1.png'
import galeryCosteleta2 from '../assets/galerycosteleta2.png'
import galeryLulaComGambas from '../assets/galerylulacomgambas.png'
import galeryPicanha1 from '../assets/galerypicanha1.png'
import galeryPicanha2 from '../assets/galerypicanha2.png'
import galeryPicanha3 from '../assets/galerypicanha3.png'
import galeryPicanha4 from '../assets/galerypicanha4.png'
import galeryPicanha5 from '../assets/galerypicanha5.png'

/* ═══════════════════════════════════════════════════
   DADOS
   ═══════════════════════════════════════════════════ */

const GALLERY_IMAGES = [
  { src: galeryPicanha1, label: 'Picanha', category: 'Carnes' },
  { src: galeryArrozDeMarisco, label: 'Arroz de Marisco', category: 'Mariscos' },
  { src: galeryCosteleta2, label: 'Costeleta', category: 'Carnes' },
  { src: galeryBacalhau1, label: 'Bacalhau', category: 'Peixe' },
  { src: galeryPicanha3, label: 'Picanha Maturada', category: 'Carnes' },
  { src: galeryLulaComGambas, label: 'Lula com Gambas', category: 'Mariscos' },
  { src: galeryCarnes1, label: 'Seleção de Carnes', category: 'Carnes' },
  { src: galeryPicanha4, label: 'Espetadas', category: 'Carnes' },
  { src: galeryCarnes2, label: 'Corte Nobre', category: 'Carnes' },
  { src: galeryCostela1, label: 'Costela Assada', category: 'Carnes' },
  { src: galeryPicanha5, label: 'Picanha ao Lume', category: 'Carnes' },
  { src: galeryPicanha2, label: 'Picanha Premium', category: 'Carnes' },
]

const ROW_1 = GALLERY_IMAGES.filter((_, i) => i % 2 === 0)
const ROW_2 = GALLERY_IMAGES.filter((_, i) => i % 2 !== 0)
const ROW_1_LOOP = [...ROW_1, ...ROW_1]
const ROW_2_LOOP = [...ROW_2, ...ROW_2]

/* ═══════════════════════════════════════════════════
   MARQUEE KEYFRAMES (CSS puro para loop suave)
   ═══════════════════════════════════════════════════ */

const MARQUEE_STYLES = `
@keyframes marquee-row1 {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes marquee-row2 {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
`

/* ═══════════════════════════════════════════════════
   FRAMER VARIANTS — GALLERY CARD
   ═══════════════════════════════════════════════════ */

const cardVariants = { rest: {}, hover: {} }

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.6, ease: 'easeOut' } },
}

const overlayVariants = {
  rest: { opacity: 0.6 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
}

const labelVariants = {
  rest: { y: 4, opacity: 0.7 },
  hover: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
}

const lineVariants = {
  rest: { width: 24 },
  hover: { width: 40, transition: { duration: 0.4, ease: 'easeOut' } },
}

const expandVariants = {
  rest: { opacity: 0, scale: 0.8 },
  hover: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
}

/* ═══════════════════════════════════════════════════
   GALLERY CARD (memo)
   ═══════════════════════════════════════════════════ */

const GalleryCard = memo(function GalleryCard({ item, globalIndex, onClick }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      data-cursor="image"
      aria-label={`Abrir imagem de ${item.label}`}
      role="button"
      tabIndex={0}
      className="w-[180px] h-[140px] sm:w-[220px] sm:h-[160px] lg:w-[280px] lg:h-[200px] xl:w-[320px] xl:h-[220px] flex-shrink-0 cursor-none"
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}
    >
      <motion.div
        variants={{
          rest: { borderColor: 'rgba(205,152,46,0.0)' },
          hover: { borderColor: 'rgba(205,152,46,0.35)' },
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          border: '1px solid rgba(205,152,46,0.0)',
          zIndex: 5,
          pointerEvents: 'none',
          transition: 'border-color 0.3s ease',
        }}
      />

      <motion.img
        src={item.src}
        alt={item.label}
        loading={globalIndex < 4 ? 'eager' : 'lazy'}
        variants={imageVariants}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />

      <motion.div
        variants={overlayVariants}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, rgba(16,5,2,0.90) 0%, rgba(16,5,2,0.30) 50%, rgba(16,5,2,0.0) 100%)',
        }}
      />

      <motion.div
        variants={labelVariants}
        style={{
          position: 'absolute',
          bottom: 14,
          left: 16,
          right: 16,
        }}
      >
        <motion.div
          variants={lineVariants}
          style={{
            height: 1,
            marginBottom: 6,
            background: 'linear-gradient(to right, #CD982E, transparent)',
          }}
        />
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 15,
            fontWeight: 600,
            color: '#FFFFFF',
            display: 'block',
          }}
        >
          {item.label}
        </span>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(219,189,126,0.70)',
            marginTop: 2,
            display: 'block',
          }}
        >
          {item.category}
        </span>
      </motion.div>

      <motion.div
        variants={expandVariants}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(16,5,2,0.50)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '50%',
          padding: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowsOut size={16} weight="bold" style={{ color: '#DBBD7E' }} />
      </motion.div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════
   CATEGORY ICON HELPER
   ═══════════════════════════════════════════════════ */

function getCategoryIcon(category) {
  switch (category) {
    case 'Carnes':
      return <Flame size={10} weight="duotone" />
    case 'Peixe':
      return <Fish size={10} weight="duotone" />
    case 'Mariscos':
      return <Shrimp size={10} weight="duotone" />
    default:
      return null
  }
}

/* ═══════════════════════════════════════════════════
   MODAL LIGHTBOX
   ═══════════════════════════════════════════════════ */

function ModalLightbox({ modalIndex, setModalIndex, onOpenMenu }) {
  const modalRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const current = GALLERY_IMAGES[modalIndex]

  const closeModal = useCallback(() => setModalIndex(null), [setModalIndex])
  const goNext = useCallback(
    () => setModalIndex((p) => (p + 1) % GALLERY_IMAGES.length),
    [setModalIndex]
  )
  const goPrev = useCallback(
    () => setModalIndex((p) => (p - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length),
    [setModalIndex]
  )

  useEffect(() => {
    if (modalIndex === null) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalIndex, goNext, goPrev, closeModal])

  useEffect(() => {
    if (modalIndex !== null && modalRef.current) modalRef.current.focus()
  }, [modalIndex])

  if (modalIndex === null || !current) return null

  const thumbStart = Math.max(0, Math.min(modalIndex - 3, GALLERY_IMAGES.length - 6))
  const thumbs = GALLERY_IMAGES.slice(thumbStart, thumbStart + 6)

  const counter = `${String(modalIndex + 1).padStart(2, '0')} / ${String(GALLERY_IMAGES.length).padStart(2, '0')}`

  const springTransition = prefersReduced
    ? { duration: 0.15 }
    : { type: 'spring', stiffness: 300, damping: 28 }

  const slideTransition = prefersReduced
    ? { duration: 0.1 }
    : { duration: 0.3, ease: [0.32, 0.72, 0, 1] }

  return (
    <>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(16,5,2,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={current.label}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          outline: 'none',
        }}
        className="p-5 lg:p-10"
      >
        <motion.div
          key="modal-card"
          initial={prefersReduced ? { opacity: 0 } : { scale: 0.88, opacity: 0, y: 40 }}
          animate={prefersReduced ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { scale: 0.92, opacity: 0, y: -20 }}
          transition={springTransition}
          style={{
            position: 'relative',
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 900,
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(205,152,46,0.15)',
            boxShadow: '0 40px 120px rgba(16,5,2,0.8)',
          }}
          className="rounded-2xl lg:rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={modalIndex}
                src={current.src}
                alt={current.label}
                initial={prefersReduced ? { opacity: 0 } : { x: 80, opacity: 0 }}
                animate={prefersReduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { x: -80, opacity: 0 }}
                transition={slideTransition}
                className="max-h-[45vh] lg:max-h-[55vh]"
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  aspectRatio: '16/10',
                }}
              />
            </AnimatePresence>

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(transparent, rgba(16,5,2,0.95))',
                pointerEvents: 'none',
              }}
            />
          </div>

          <motion.button
            onClick={closeModal}
            aria-label="Fechar"
            data-cursor="button"
            whileHover={{ scale: 1.1, background: 'rgba(205,152,46,0.20)' }}
            whileTap={{ scale: 0.9 }}
            className="cursor-none"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(16,5,2,0.70)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(205,152,46,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <X size={18} weight="bold" style={{ color: '#DBBD7E' }} />
          </motion.button>

          <motion.button
            onClick={goPrev}
            aria-label="Imagem anterior"
            data-cursor="button"
            whileHover={{
              scale: 1.1,
              background: 'rgba(205,152,46,0.25)',
              borderColor: 'rgba(205,152,46,0.60)',
            }}
            whileTap={{ scale: 0.9, x: -3 }}
            className="cursor-none hidden sm:flex"
            style={{
              position: 'absolute',
              top: '35%',
              transform: 'translateY(-50%)',
              left: 16,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(16,5,2,0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(205,152,46,0.30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <ArrowLeft size={20} weight="bold" style={{ color: '#DBBD7E' }} />
          </motion.button>

          <motion.button
            onClick={goNext}
            aria-label="Próxima imagem"
            data-cursor="button"
            whileHover={{
              scale: 1.1,
              background: 'rgba(205,152,46,0.25)',
              borderColor: 'rgba(205,152,46,0.60)',
            }}
            whileTap={{ scale: 0.9, x: 3 }}
            className="cursor-none hidden sm:flex"
            style={{
              position: 'absolute',
              top: '35%',
              transform: 'translateY(-50%)',
              right: 16,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(16,5,2,0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(205,152,46,0.30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <ArrowRight size={20} weight="bold" style={{ color: '#DBBD7E' }} />
          </motion.button>

          <div
            style={{
              background: 'rgba(16,5,2,0.98)',
              position: 'relative',
            }}
            className="px-5 py-5 lg:px-8 lg:pt-7 lg:pb-8"
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 32,
                right: 32,
                height: 1,
                background:
                  'linear-gradient(to right, transparent, rgba(205,152,46,0.4), transparent)',
              }}
            />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`badge-${modalIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(205,152,46,0.10)',
                      border: '1px solid rgba(205,152,46,0.25)',
                      borderRadius: 100,
                      padding: '4px 12px',
                    }}
                  >
                    <span style={{ color: '#CD982E', display: 'flex' }}>
                      {getCategoryIcon(current.category)}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: '#DBBD7E',
                      }}
                    >
                      {current.category}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.h3
                    key={`title-${modalIndex}`}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-[20px] lg:text-[26px]"
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginTop: 8,
                    }}
                  >
                    {current.label}
                  </motion.h3>
                </AnimatePresence>

                <span
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 13,
                    color: 'rgba(205,152,46,0.60)',
                    marginTop: 6,
                    display: 'block',
                  }}
                >
                  {counter}
                </span>
              </div>

              <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                data-cursor="button"
                onClick={() => {
                  closeModal()
                  setTimeout(() => onOpenMenu(), 300)
                }}
                className="btn-primary cursor-none text-[13px] uppercase tracking-[0.08em] self-start"
                style={{ padding: '12px 24px', flexShrink: 0 }}
              >
                <BookOpenText size={16} weight="bold" />
                Ver Menu Completo
              </motion.button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 20,
                overflow: 'hidden',
                justifyContent: 'flex-start',
              }}
            >
              {thumbs.map((img) => {
                const idx = GALLERY_IMAGES.indexOf(img)
                const isActive = idx === modalIndex
                return (
                  <motion.img
                    key={idx}
                    src={img.src}
                    alt={img.label}
                    onClick={() => setModalIndex(idx)}
                    whileHover={!isActive ? { scale: 1.05 } : {}}
                    data-cursor="button"
                    className="w-[44px] h-[32px] lg:w-[56px] lg:h-[40px] cursor-none"
                    style={{
                      objectFit: 'cover',
                      borderRadius: 6,
                      flexShrink: 0,
                      border: isActive
                        ? '2px solid #CD982E'
                        : '2px solid transparent',
                      opacity: isActive ? 1 : 0.5,
                      transition: 'opacity 0.3s, border-color 0.3s',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT — SEÇÃO PRINCIPAL
   ═══════════════════════════════════════════════════ */

export default function MenuSection({ onOpenMenu }) {
  const [modalIndex, setModalIndex] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReduced = useReducedMotion()

  const openModal = useCallback(
    (index) => setModalIndex(index),
    []
  )

  const row1Duration = prefersReduced ? 0 : 35
  const row2Duration = prefersReduced ? 0 : 28

  return (
    <div className="bg-stone-darkest section-padding relative overflow-hidden">
      <style>{MARQUEE_STYLES}</style>

      <div
        className="absolute -right-[200px] top-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(205,152,46,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container-site relative z-10">
        <AnimatedSection>
          <SectionTitle
            microlabel="O que servimos"
            title="Uma cozinha com alma"
            highlightWord="alma"
            subtitle="Cada prato conta uma historia. Cada ingrediente tem origem conhecida. Cada refeicao e uma celebracao da cozinha portuguesa."
            centered
            light
          />
        </AnimatedSection>
      </div>

      <div
        className="mb-10 lg:mb-16 mt-10 lg:mt-16"
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
            background:
              'linear-gradient(to right, #100502 0%, transparent 8%, transparent 92%, #100502 100%)',
          }}
        />

        <div className="flex flex-col gap-2 lg:gap-3">
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                width: 'max-content',
                willChange: 'transform',
                animation: row1Duration
                  ? `marquee-row1 ${row1Duration}s linear infinite`
                  : 'none',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {ROW_1_LOOP.map((item, index) => {
                const globalIdx = GALLERY_IMAGES.indexOf(item)
                return (
                  <GalleryCard
                    key={`r1-${index}`}
                    item={item}
                    globalIndex={globalIdx}
                    onClick={() => openModal(globalIdx)}
                  />
                )
              })}
            </div>
          </div>

          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                width: 'max-content',
                willChange: 'transform',
                animation: row2Duration
                  ? `marquee-row2 ${row2Duration}s linear infinite`
                  : 'none',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {ROW_2_LOOP.map((item, index) => {
                const globalIdx = GALLERY_IMAGES.indexOf(item)
                return (
                  <GalleryCard
                    key={`r2-${index}`}
                    item={item}
                    globalIndex={globalIdx}
                    onClick={() => openModal(globalIdx)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container-site relative z-10">
        <AnimatedSection delay={0.3} className="flex justify-center">
          <motion.button
            data-cursor="button"
            onClick={onOpenMenu}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-outline border-gold-light text-gold-light hover:bg-gold-deep hover:border-gold-deep hover:text-white px-12 py-4 cursor-none"
          >
            <BookOpenText size={20} weight="bold" />
            Consultar Menu Completo
          </motion.button>
        </AnimatedSection>
      </div>

      <AnimatePresence>
        {modalIndex !== null && (
          <ModalLightbox
            modalIndex={modalIndex}
            setModalIndex={setModalIndex}
            onOpenMenu={onOpenMenu}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
