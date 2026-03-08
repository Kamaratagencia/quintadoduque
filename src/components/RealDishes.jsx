import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, CaretLeft, CaretRight, MagnifyingGlassPlus } from '@phosphor-icons/react'
import GoldDivider from './ui/GoldDivider'

/* ═══════════════════════════════════════════════════
   IMPORTS DAS IMAGENS
   ═══════════════════════════════════════════════════ */

const imageModules = import.meta.glob('../assets/realphoto*.jpeg', { eager: true })

const PHOTOS = Object.entries(imageModules)
  .map(([path, mod], i) => {
    const match = path.match(/realphoto(?: \((\d+)\))?\.jpeg$/)
    const num = match?.[1] ? parseInt(match[1], 10) : 0
    return {
      id: `dish-${num}`,
      src: mod.default,
      alt: `Prato real da Quinta do Duque — fotografia ${num + 1}`,
      order: num,
    }
  })
  .sort((a, b) => a.order - b.order)

/* ═══════════════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════════════ */

const BATCH_SIZE = 12
const STAGGER_BASE = 0.04
const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 28 }
const EASE_PREMIUM = [0.25, 0.1, 0.25, 1]

/* ═══════════════════════════════════════════════════
   LAZY IMAGE — carrega com IntersectionObserver
   ═══════════════════════════════════════════════════ */

function LazyImage({ src, alt, className, style, onLoad }) {
  const [loaded, setLoaded] = useState(false)
  const [inViewRef, inView] = useInView({ triggerOnce: true, rootMargin: '200px' })

  return (
    <div ref={inViewRef} className={className} style={{ ...style, position: 'relative' }}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => { setLoaded(true); onLoad?.() }}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(205,152,46,0.06) 0%, rgba(16,5,2,0.95) 100%)',
          }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   DISH CARD
   ═══════════════════════════════════════════════════ */

function DishCard({ photo, index, staggerDelay, onOpen }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced.current ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
      animate={
        inView
          ? prefersReduced.current
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: 1 }
          : {}
      }
      transition={{
        duration: 0.6,
        ease: EASE_PREMIUM,
        delay: staggerDelay,
      }}
      className="relative group"
      style={{ breakInside: 'avoid', marginBottom: 12 }}
    >
      <motion.button
        onClick={() => onOpen(index)}
        whileTap={{ scale: 0.97 }}
        data-cursor="image"
        className="relative w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD982E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#100502]"
        style={{
          border: '1px solid rgba(205,152,46,0.10)',
          boxShadow: '0 2px 16px rgba(16,5,2,0.35)',
          cursor: 'none',
          display: 'block',
        }}
        aria-label={`Ampliar ${photo.alt}`}
      >
        <LazyImage
          src={photo.src}
          alt={photo.alt}
          style={{ width: '100%', aspectRatio: '3/4' }}
        />

        {/* Overlay hover/tap */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(16,5,2,0.7) 0%, rgba(16,5,2,0) 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Borda glow hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(205,152,46,0.30), 0 0 20px rgba(205,152,46,0.08)',
          }}
        />

        {/* Ícone ampliar */}
        <div
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{
            background: 'rgba(16,5,2,0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(205,152,46,0.25)',
            borderRadius: 8,
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MagnifyingGlassPlus size={16} weight="bold" color="#DBBD7E" />
        </div>
      </motion.button>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════ */

function Lightbox({ photos, activeIndex, onClose, onNext, onPrev }) {
  const photo = photos[activeIndex]
  const touchStart = useRef(null)
  const contentRef = useRef(null)

  // Body scroll lock
  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onNext, onPrev])

  // Focus trap
  useEffect(() => {
    contentRef.current?.focus()
  }, [activeIndex])

  // Preload neighbors
  useEffect(() => {
    const preload = (i) => {
      if (i >= 0 && i < photos.length) {
        const img = new Image()
        img.src = photos[i].src
      }
    }
    preload(activeIndex - 1)
    preload(activeIndex + 1)
  }, [activeIndex, photos])

  // Touch swipe
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? onNext() : onPrev()
    }
    touchStart.current = null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(8,2,1,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada do prato"
    >
      {/* Fechar */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(205,152,46,0.15)' }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 flex items-center justify-center cursor-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD982E]"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(16,5,2,0.6)',
          border: '1px solid rgba(205,152,46,0.20)',
        }}
        aria-label="Fechar"
        data-cursor="button"
      >
        <X size={20} weight="bold" color="#DBBD7E" />
      </motion.button>

      {/* Contador */}
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 z-10"
        style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '0.1em',
          color: 'rgba(219,189,126,0.6)',
        }}
      >
        <span style={{ color: '#DBBD7E', fontWeight: 600 }}>{activeIndex + 1}</span>
        <span style={{ margin: '0 4px' }}>/</span>
        <span>{photos.length}</span>
      </div>

      {/* Setas desktop */}
      <motion.button
        onClick={onPrev}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(205,152,46,0.12)' }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-3 md:left-6 z-10 hidden md:flex items-center justify-center cursor-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD982E]"
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(16,5,2,0.5)',
          border: '1px solid rgba(205,152,46,0.15)',
        }}
        aria-label="Imagem anterior"
        data-cursor="button"
      >
        <CaretLeft size={22} weight="bold" color="#DBBD7E" />
      </motion.button>

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(205,152,46,0.12)' }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-3 md:right-6 z-10 hidden md:flex items-center justify-center cursor-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD982E]"
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(16,5,2,0.5)',
          border: '1px solid rgba(205,152,46,0.15)',
        }}
        aria-label="Próxima imagem"
        data-cursor="button"
      >
        <CaretRight size={22} weight="bold" color="#DBBD7E" />
      </motion.button>

      {/* Imagem */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className="relative w-full h-full flex items-center justify-center px-4 py-16 md:px-20 md:py-12 outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={photo.src}
            alt={photo.alt}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="max-w-full max-h-full rounded-lg select-none"
            style={{
              objectFit: 'contain',
              boxShadow: '0 8px 60px rgba(0,0,0,0.5)',
              border: '1px solid rgba(205,152,46,0.10)',
            }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Indicadores mobile */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex md:hidden gap-1">
        {photos.length <= 20 ? (
          photos.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIndex ? 16 : 5,
                height: 5,
                borderRadius: 100,
                backgroundColor: i === activeIndex ? '#CD982E' : 'rgba(219,189,126,0.25)',
                transition: 'all 0.3s ease',
              }}
            />
          ))
        ) : (
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(219,189,126,0.5)' }}>
            Deslize para navegar
          </span>
        )}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════ */

function SectionHeader() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <div ref={ref} className="text-center px-6 pb-10 lg:pb-14">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        className="block"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#CD982E',
          fontWeight: 500,
        }}
      >
        Da Nossa Cozinha
      </motion.span>

      <GoldDivider width={48} centered />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 700,
          color: '#FFFFFF',
        }}
        className="text-[28px] lg:text-[42px] leading-[1.15]"
      >
        Momentos Servidos
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.2 }}
        style={{
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(219,189,126,0.65)',
          marginTop: 14,
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        className="text-[14px] lg:text-[15px] leading-[1.7]"
      >
        Fotografias reais dos nossos pratos — sem filtros, sem artifícios.
        Apenas o que sai da nossa cozinha para a sua mesa.
      </motion.p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MASONRY GRID
   ═══════════════════════════════════════════════════ */

function MasonryGrid({ photos, visibleCount, onOpen }) {
  const cols = useMemo(() => {
    const visible = photos.slice(0, visibleCount)
    const colCount = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 3 : 2
    const columns = Array.from({ length: colCount }, () => [])
    visible.forEach((photo, i) => {
      columns[i % colCount].push({ photo, globalIndex: i })
    })
    return columns
  }, [photos, visibleCount])

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 lg:px-0"
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      {cols.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-3 md:gap-4">
          {col.map(({ photo, globalIndex }) => (
            <DishCard
              key={photo.id}
              photo={photo}
              index={globalIndex}
              staggerDelay={Math.min((globalIndex % BATCH_SIZE) * STAGGER_BASE, 0.4)}
              onOpen={onOpen}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT PRINCIPAL
   ═══════════════════════════════════════════════════ */

export default function RealDishes() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = useCallback((i) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const goNext = useCallback(() => setLightboxIndex((p) => (p + 1) % PHOTOS.length), [])
  const goPrev = useCallback(() => setLightboxIndex((p) => (p - 1 + PHOTOS.length) % PHOTOS.length), [])

  const showMore = () => setVisibleCount((v) => Math.min(v + BATCH_SIZE, PHOTOS.length))
  const hasMore = visibleCount < PHOTOS.length

  return (
    <section
      style={{ backgroundColor: '#100502', paddingTop: 64, paddingBottom: 64, overflow: 'hidden' }}
      className="lg:pt-[88px] lg:pb-[88px]"
    >
      <SectionHeader />

      <MasonryGrid photos={PHOTOS} visibleCount={visibleCount} onOpen={openLightbox} />

      {/* Botão "Ver mais" */}
      {hasMore && (
        <div className="flex justify-center mt-10 px-4">
          <motion.button
            onClick={showMore}
            whileHover={{ scale: 1.03, borderColor: 'rgba(205,152,46,0.50)' }}
            whileTap={{ scale: 0.97 }}
            data-cursor="button"
            className="cursor-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD982E]"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#DBBD7E',
              padding: '14px 36px',
              borderRadius: 12,
              background: 'rgba(205,152,46,0.06)',
              border: '1px solid rgba(205,152,46,0.20)',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
          >
            Descobrir mais pratos
            <span
              style={{
                display: 'inline-block',
                marginLeft: 8,
                fontSize: 11,
                color: 'rgba(219,189,126,0.45)',
              }}
            >
              {visibleCount}/{PHOTOS.length}
            </span>
          </motion.button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            key="lightbox"
            photos={PHOTOS}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
