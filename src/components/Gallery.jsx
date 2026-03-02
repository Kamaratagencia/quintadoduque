import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { Flower, Armchair, Door, Sun, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import GoldDivider from './ui/GoldDivider'

import fotojardim from '../assets/fotojardim.png'
import fotosalao from '../assets/fotosalaoprincipal.png'
import fotoentrada from '../assets/fotoentrada.png'
import fotoexterna from '../assets/fotoexterna.png'

const SLIDES = [
  {
    id: 'jardim',
    image: fotojardim,
    icon: <Flower weight="duotone" />,
    label: 'Jardim',
    title: 'Um jardim que recebe com calma',
    description: 'Natureza, silêncio e luz suave — o começo perfeito para uma noite especial.',
  },
  {
    id: 'salao',
    image: fotosalao,
    icon: <Armchair weight="duotone" />,
    label: 'Salão Principal',
    title: 'O coração da quinta',
    description: 'Pedra centenária, madeira nobre e mesas postas com atenção a cada detalhe.',
  },
  {
    id: 'entrada',
    image: fotoentrada,
    icon: <Door weight="duotone" />,
    label: 'Entrada',
    title: 'A nossa entrada',
    description: 'Preparada para recebê-lo da melhor forma, desde o primeiro passo.',
  },
  {
    id: 'externa',
    image: fotoexterna,
    icon: <Sun weight="duotone" />,
    label: 'Área Externa',
    title: 'Sob o céu aberto',
    description: 'Uma esplanada pensada para quem aprecia o ar livre com conforto e elegância.',
  },
]

const AUTOPLAY_INTERVAL = 5000
const BREATHE_DURATION = 0.25
const EMERGE_EASE = [0.16, 1, 0.3, 1]

export default function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: false,
    skipSnaps: false,
    duration: 30,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [breatheIndex, setBreatheIndex] = useState(null)
  const timerRef = useRef(null)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setBreatheIndex(null)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('pointerDown', () => {
      setIsUserInteracting(true)
      clearTimeout(timerRef.current)
    })
    emblaApi.on('settle', () => {
      setIsUserInteracting(false)
    })
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (isUserInteracting || !emblaApi) return

    timerRef.current = setTimeout(() => {
      setBreatheIndex(selectedIndex)
      setTimeout(() => {
        emblaApi.scrollNext()
      }, BREATHE_DURATION * 1000)
    }, AUTOPLAY_INTERVAL)

    return () => clearTimeout(timerRef.current)
  }, [selectedIndex, isUserInteracting, emblaApi])

  return (
    <section
      id="galeria"
      style={{
        backgroundColor: '#100502',
        paddingTop: 56,
        overflow: 'hidden',
      }}
      className="lg:pt-[80px]"
    >
      {/* ── CABEÇALHO ── */}
      <div
        style={{ textAlign: 'center' }}
        className="px-6 pb-8 lg:pb-12"
      >
        <AnimatedSection direction="none" threshold={0.2}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#CD982E',
              fontWeight: 500,
              display: 'block',
            }}
          >
            Espaço & Ambiente
          </span>

          <GoldDivider width={48} centered />

          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              color: '#FFFFFF',
            }}
            className="text-[28px] lg:text-[40px]"
          >
            Viva a experiência
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              color: 'rgba(219,189,126,0.70)',
              marginTop: 12,
            }}
            className="text-[14px] lg:text-[15px]"
          >
            Conheça cada canto da nossa quinta.
          </p>
        </AnimatedSection>
      </div>

      {/* ── CARROSSEL ── */}
      <AnimatedSection direction="up" delay={0.3}>
        <div
          className="pl-6 sm:pl-8 lg:pl-0 lg:max-w-[1100px] lg:mx-auto lg:px-12 xl:max-w-[1280px]"
        >
          <div ref={emblaRef} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex' }}>
              {SLIDES.map((slide, i) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  index={i}
                  isActive={i === selectedIndex}
                  isBreathe={i === breatheIndex}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── NAVEGAÇÃO ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 24,
          }}
          className="pb-8 lg:pb-12"
        >
          {/* Dots + Setas */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {/* Seta esquerda — desktop */}
            <motion.button
              onClick={() => emblaApi?.scrollPrev()}
              whileHover={{
                backgroundColor: 'rgba(205,152,46,0.15)',
                borderColor: 'rgba(205,152,46,0.40)',
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(205,152,46,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'none',
                marginRight: 12,
              }}
              className="hidden md:flex"
              data-cursor="button"
            >
              <ArrowLeft size={18} weight="bold" color="#DBBD7E" />
            </motion.button>

            {/* Dots */}
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                data-cursor="button"
              >
                <motion.div
                  layout
                  style={{
                    height: 6,
                    borderRadius: 100,
                    backgroundColor: i === selectedIndex ? '#CD982E' : 'rgba(210,175,145,0.30)',
                  }}
                  animate={{
                    width: i === selectedIndex ? 20 : 6,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              </button>
            ))}

            {/* Seta direita — desktop */}
            <motion.button
              onClick={() => emblaApi?.scrollNext()}
              whileHover={{
                backgroundColor: 'rgba(205,152,46,0.15)',
                borderColor: 'rgba(205,152,46,0.40)',
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(205,152,46,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'none',
                marginLeft: 12,
              }}
              className="hidden md:flex"
              data-cursor="button"
            >
              <ArrowRight size={18} weight="bold" color="#DBBD7E" />
            </motion.button>
          </div>

          {/* Barra de progresso do timer */}
          <div
            style={{
              width: 120,
              height: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(219,189,126,0.15)',
              marginTop: 16,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              key={selectedIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #CD982E, #DBBD7E)',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

function SlideCard({ slide, index, isActive, isBreathe }) {
  const getAnimateProps = () => {
    if (isBreathe) return { scale: 1.03, opacity: 0.7 }
    if (isActive) return { scale: 1, opacity: 1 }
    return { scale: 1, opacity: 1 }
  }

  const getTransition = () => {
    if (isBreathe) return { duration: BREATHE_DURATION, ease: 'easeIn' }
    if (isActive) return { scale: { duration: 0.5, ease: EMERGE_EASE, from: 0.97 }, opacity: { duration: 0.4, from: 0.8 } }
    return { duration: 0.3 }
  }

  return (
    <div
      className="w-[78vw] mr-4 sm:w-[60vw] sm:mr-5 lg:w-[420px] lg:mr-6 xl:w-[480px] xl:mr-7"
      style={{ flexShrink: 0 }}
    >
      <motion.div
        animate={getAnimateProps()}
        transition={getTransition()}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(205,152,46,0.18)',
          boxShadow: '0 4px 24px rgba(16,5,2,0.3)',
          backgroundColor: 'rgba(16,5,2,0.97)',
          cursor: 'none',
        }}
        data-cursor="image"
      >
        {/* Zona Imagem */}
        <div
          className="h-[78vw] sm:h-[340px] lg:h-[380px] xl:h-[420px]"
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={slide.image}
            alt={slide.label}
            loading={index === 0 ? 'eager' : 'lazy'}
            style={{
              position: 'absolute',
              inset: 0,
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
              background: 'linear-gradient(to bottom, rgba(16,5,2,0) 50%, rgba(16,5,2,0.75) 100%)',
            }}
          />
        </div>

        {/* Zona Conteúdo */}
        <div
          className="p-5 lg:p-6"
          style={{ backgroundColor: 'rgba(16,5,2,0.97)' }}
        >
          {/* Badge pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(205,152,46,0.10)',
              border: '1px solid rgba(205,152,46,0.20)',
              borderRadius: 100,
              padding: '5px 12px',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, color: '#CD982E', display: 'flex' }}>
              {slide.icon}
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(219,189,126,0.80)',
              }}
            >
              {slide.label}
            </span>
          </div>

          {/* Título */}
          <h3
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 18,
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: 10,
            }}
          >
            {slide.title}
          </h3>

          {/* Separador */}
          <div
            style={{
              width: 40,
              height: 1,
              marginBottom: 10,
              background: 'linear-gradient(to right, #CD982E, transparent)',
            }}
          />

          {/* Descrição */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              color: 'rgba(219,189,126,0.70)',
              lineHeight: 1.65,
            }}
          >
            {slide.description}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
