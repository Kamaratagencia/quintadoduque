import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Star, ArrowSquareOut } from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import SectionTitle from './ui/SectionTitle'
import googleLogo from '../assets/logogoogle.png'
import theforkLogo from '../assets/logothefork.png'

const testimonials = [
  {
    text: 'Uma refeicao memoravel do inicio ao fim. O servico e impecavel, cada detalhe foi pensado para nos fazer sentir em casa. A vitela assada derretia no prato e o vinho do Douro que nos recomendaram foi a combinacao perfeita.',
    name: 'Maria Fernandes',
    source: 'TheFork',
    date: 'Jan 2025',
  },
  {
    text: 'O bacalhau com natas e simplesmente o melhor que ja provei em Portugal. A textura, o sabor, a apresentacao — tudo num nivel que raramente se encontra. Voltaremos sem duvida.',
    name: 'Joao Carvalho',
    source: 'TheFork',
    date: 'Dez 2024',
  },
  {
    text: 'O espaco e deslumbrante, as paredes de pedra criam uma atmosfera unica e acolhedora. Fomos muito bem recebidos e cada prato superou as nossas expectativas. Uma verdadeira joia em Vila do Conde.',
    name: 'Ana Sofia Costa',
    source: 'Google',
    date: 'Nov 2024',
  },
  {
    text: 'Fui celebrar o meu aniversario e nao podia ter escolhido melhor. O menu de degustacao e uma viagem pela gastronomia portuguesa, com toques contemporaneos que surpreendem. Atendimento de excelencia.',
    name: 'Ricardo Mendes',
    source: 'TheFork',
    date: 'Out 2024',
  },
  {
    text: 'A adega e extraordinaria, o sommelier conhece cada garrafa como se fosse um filho. Recomendou-nos um vinho verde que transformou completamente a experiencia. Um restaurante que honra a tradicao.',
    name: 'Teresa Almeida',
    source: 'Google',
    date: 'Set 2024',
  },
]

function StarRating({ count = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} weight="fill" className="text-gold-deep" />
      ))}
    </div>
  )
}

function PartialStarRating({ rating, size = 16 }) {
  const full = Math.floor(rating)
  const partial = rating - full
  const empty = 5 - full - (partial > 0 ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={size} weight="fill" className="text-gold-deep" />
      ))}
      {partial > 0 && (
        <div className="relative" style={{ width: size, height: size }}>
          <Star size={size} weight="fill" className="text-gold-deep/20 absolute inset-0" />
          <div style={{ width: `${partial * 100}%`, overflow: 'hidden' }} className="absolute inset-0">
            <Star size={size} weight="fill" className="text-gold-deep" />
          </div>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={size} weight="fill" className="text-gold-deep/20" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  )

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
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

  return (
    <div className="bg-stone-darkest section-padding">
      <div className="container-site">
        <AnimatedSection>
          <SectionTitle
            microlabel="O que dizem de nos"
            title="Experiencias que ficam"
            centered
            light
          />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mt-16 mb-16">
            <div className="glass-card px-7 py-7 md:px-9 md:py-7 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={theforkLogo}
                  alt="TheFork"
                  style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-[64px] font-black text-gold-deep leading-none">
                  9.1
                </span>
                <span className="font-sans text-[20px] text-beige">/ 10</span>
              </div>

              <StarRating count={5} size={18} />

              <span className="font-sans text-[13px] text-gold-light/70 mt-2">
                30 avaliacoes verificadas
              </span>

              <span
                className="inline-block mt-3 font-sans text-[12px] text-gold-medium px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(205,152,46,0.2)' }}
              >
                Excelente
              </span>
            </div>

            <div className="glass-card px-7 py-7 md:px-9 md:py-7 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={googleLogo}
                  alt="Google"
                  style={{ height: '32px', width: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }}
                  loading="lazy"
                />
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-[64px] font-black text-gold-deep leading-none">
                  4.8
                </span>
                <span className="font-sans text-[20px] text-beige">/ 5</span>
              </div>

              <PartialStarRating rating={4.8} size={18} />

              <span className="font-sans text-[13px] text-gold-light/70 mt-2">
                Avaliacoes Google
              </span>

              <span
                className="inline-block mt-3 font-sans text-[12px] text-gold-medium px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(205,152,46,0.2)' }}
              >
                Recomendado
              </span>
            </div>
          </div>
        </AnimatedSection>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-none w-[85vw] md:w-[480px] mx-3"
              >
                <div
                  className="relative rounded-2xl p-9 h-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(205,152,46,0.1)',
                  }}
                >
                  <span
                    className="absolute -top-2 left-5 font-display text-[120px] leading-none select-none pointer-events-none"
                    style={{ color: 'rgba(205,152,46,0.15)' }}
                  >
                    &ldquo;
                  </span>

                  <p className="font-display italic text-[18px] text-white leading-[1.8] relative z-10 max-w-[480px]">
                    {t.text}
                  </p>

                  <div
                    className="w-10 h-[2px] my-5"
                    style={{
                      background: 'linear-gradient(90deg, #CD982E, #DBBD7E)',
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans text-[15px] font-semibold text-gold-medium block">
                        {t.name}
                      </span>
                      <span className="font-sans text-[12px] text-beige/60">
                        {t.source} &middot; {t.date}
                      </span>
                    </div>
                    <StarRating count={5} size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => scrollTo(i)}
              data-cursor="button"
              className="h-[8px] rounded-full cursor-none"
              animate={{
                width: i === selectedIndex ? 24 : 8,
                backgroundColor:
                  i === selectedIndex ? '#CD982E' : 'rgba(166,119,83,0.4)',
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            />
          ))}
        </div>

        <AnimatedSection delay={0.2} className="flex justify-center mt-10">
          <a
            href="https://www.thefork.pt/restaurante/quinta-do-duque-r854283"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="button"
            className="btn-outline border-gold-light text-gold-light hover:bg-gold-deep hover:border-gold-deep hover:text-white cursor-none"
          >
            Ver todas as avaliacoes no TheFork
            <ArrowSquareOut size={18} weight="bold" />
          </a>
        </AnimatedSection>
      </div>
    </div>
  )
}
