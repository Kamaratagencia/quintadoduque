import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  BookOpenText,
  ForkKnife,
  Fish,
  Flame,
  Cake,
  Wine,
  ArrowRight,
} from '@phosphor-icons/react'
import clsx from 'clsx'

import imgEntradas from '../../assets/cardapioentradas.png'
import imgPeixes from '../../assets/cardapiopeixes.png'
import imgCarnes from '../../assets/cardapiocarnes.png'
import imgSobremesas from '../../assets/cardapiosobremesas.png'
import imgVinhos from '../../assets/cardapiovinhos.png'

const ACCENT = '#CD982E'
const ACCENT_LIGHT = '#DBBD7E'
const ACCENT_PALE = '#EEE3C9'
const ACCENT_DIM = 'rgba(205,152,46,0.12)'
const STONE_WARM = '#A67753'
const STONE_DARK = '#884A28'
const SAND = '#D2AF91'

const ICON_MAP = { ForkKnife, Fish, Flame, Cake, Wine }

const CATEGORY_IMAGES = {
  entradas: imgEntradas,
  peixes: imgPeixes,
  carnes: imgCarnes,
  sobremesas: imgSobremesas,
  vinhos: imgVinhos,
}

const CATEGORY_ALT = {
  entradas: 'Mesa de entradas com chouriço, queijos e enchidos portugueses',
  peixes: 'Pratos de bacalhau e peixes frescos do Atlântico',
  carnes: 'Cortes nobres de carne grelhados na brasa',
  sobremesas: 'Seleção de sobremesas tradicionais portuguesas',
  vinhos: 'Garrafas de vinho tinto, branco e espumante da adega',
}

const MENU_DATA = [
  {
    id: 'entradas',
    label: 'Entradas',
    icon: 'ForkKnife',
    image: CATEGORY_IMAGES.entradas,
    description: 'Para começar com distinção',
    particleType: 'sparkle',
    items: [
      { name: 'Chouriço Assado',                   price: '6,50 €' },
      { name: 'Tábua de Queijos e Enchidos',        price: '12,00 €' },
      { name: 'Amêijoas à Bolhão de Pato',          price: '19,00 €' },
      { name: 'Gambas ao Alho',                     price: '19,00 €' },
      { name: 'Melão com Presunto',                 price: '9,50 €' },
      { name: 'Pataniscas de Bacalhau (unid.)',      price: '1,20 €' },
      { name: 'Salgadinhos (unid.)',                 price: '1,50 €' },
      { name: 'Moelinhas',                           price: '3,50 €' },
    ]
  },
  {
    id: 'peixes',
    label: 'Peixes & Bacalhau',
    icon: 'Fish',
    image: CATEGORY_IMAGES.peixes,
    description: 'O melhor do Atlântico Norte',
    particleType: 'wave',
    items: [
      { name: 'Bacalhau na Moranga (por encomenda)', price: '28,00 €' },
      { name: 'Bacalhau Assado na Brasa (30 min)',   price: '24,50 €' },
      { name: 'Bacalhau à Braga',                    price: '24,50 €' },
      { name: 'Bacalhau à Zé do Pipo',               price: '25,50 €' },
      { name: 'Bacalhau à Brás',                     price: '19,50 €' },
      { name: 'Polvo à Lagareiro',                   price: '26,50 €' },
      { name: 'Espetada de Lulas com Gambas',        price: '26,50 €' },
      { name: 'Salmão Grelhado com Molho Manteiga',  price: '16,00 €' },
      { name: 'Arroz de Robalo com Coentros',        price: '19,50 €' },
      { name: 'Arroz de Marisco (2px)',               price: '49,50 €' },
    ]
  },
  {
    id: 'carnes',
    label: 'Carnes & Grelhados',
    icon: 'Flame',
    image: CATEGORY_IMAGES.carnes,
    description: 'Fogo, técnica e tradição portuguesa',
    particleType: 'ember',
    groups: [
      {
        groupLabel: 'Especialidades',
        items: [
          { name: 'Posta de Vitela à Duque',           price: '37,00 €' },
          { name: 'Laminado ao Alho',                  price: '36,00 €' },
          { name: 'Tornedo com Molho Selvagem',        price: '42,00 €' },
          { name: 'Bife Wellington',                   price: '46,00 €' },
          { name: 'Secretos de Porco Preto à Mirandesa', price: '34,00 €' },
          { name: 'Magret de Canard',                  price: '41,00 €' },
          { name: 'Bife na Caçarola',                  price: '31,00 €' },
          { name: 'Bifinhos de Frango na Brasa',       price: '29,00 €' },
        ]
      },
      {
        groupLabel: 'Da Brasa',
        items: [
          { name: 'Frango na Brasa',                   price: '13,00 €' },
          { name: 'Costeletão na Tábua (dose)',        price: '45,00 €' },
          { name: 'Costeletão na Tábua (meia dose)',   price: '26,00 €' },
          { name: 'Francesinha Especial',              price: '13,50 €' },
        ]
      },
      {
        groupLabel: 'Rodízios',
        items: [
          { name: 'Rodízio Misto',                     price: '27,00 €' },
          { name: 'Rodízio Nobre',                     price: '35,00 €' },
          { name: 'Rodízio Criança',                   price: '12,50 €' },
        ]
      }
    ]
  },
  {
    id: 'sobremesas',
    label: 'Sobremesas',
    icon: 'Cake',
    image: CATEGORY_IMAGES.sobremesas,
    description: 'O final perfeito para uma refeição memorável',
    particleType: 'sugar',
    items: [
      { name: 'Mousse de Lima com Chocolate',    price: '4,50 €' },
      { name: 'Leite Creme Queimado',             price: '4,50 €' },
      { name: 'Torta de Noz',                    price: '5,50 €' },
      { name: 'Mousse de Chocolate Caseira',     price: '4,50 €' },
      { name: 'Baba de Camelo',                  price: '4,50 €' },
      { name: 'Petit Gateau com Gelado',         price: '5,50 €' },
      { name: 'Taça de Gelado (uni)',             price: '3,00 €' },
      { name: 'Quente e Frio',                   price: '4,50 €' },
      { name: 'Queijo da Serra com Marmelada',   price: '9,50 €' },
      { name: 'Salada de Frutas',                price: '4,50 €' },
      { name: 'Misto de Frutas',                 price: '5,50 €' },
      { name: 'Manga',                            price: '3,90 €' },
      { name: 'Melão',                            price: '3,50 €' },
      { name: 'Fruta da Época',                  price: '2,50 €' },
    ]
  },
  {
    id: 'vinhos',
    label: 'Carta de Vinhos',
    icon: 'Wine',
    image: CATEGORY_IMAGES.vinhos,
    description: 'Uma adega criteriosamente selecionada',
    particleType: 'bubble',
    groups: [
      {
        groupLabel: 'Vinhos Verdes',
        items: [
          { name: 'Lavrador',    price: '11,50 €' },
          { name: 'Tojeira',     price: '16,00 €' },
          { name: 'Gatão',       price: '12,00 €' },
          { name: 'Muralhas',    price: '13,00 €' },
          { name: 'Casal Garcia', price: '12,00 €' },
          { name: 'Alvarinho (esp.)', price: '17,00 €' },
          { name: 'Espadal',     price: '11,50 €' },
          { name: 'Mateus Rosé', price: '12,50 €' },
        ]
      },
      {
        groupLabel: 'Maduros Brancos',
        items: [
          { name: 'Altano',          price: '14,50 €' },
          { name: 'Planalto',        price: '13,50 €' },
          { name: 'João Pires',      price: '17,00 €' },
          { name: 'Monte Velho',     price: '16,00 €' },
          { name: 'Monte Perdizes',  price: '14,00 €' },
          { name: 'E.A.',            price: '14,50 €' },
          { name: 'Periquita',       price: '19,00 €' },
          { name: 'Bulas',           price: '19,00 €' },
          { name: 'Duas Quintas',    price: '22,00 €' },
        ]
      },
      {
        groupLabel: 'Maduros Tintos',
        items: [
          { name: 'Z.S. Grande Reserva',      price: '45,00 €' },
          { name: 'Moiras Reserva',            price: '20,00 €' },
          { name: 'Monte Velho',               price: '13,00 €' },
          { name: 'Merlot',                    price: '22,00 €' },
          { name: 'Papa Figos',                price: '16,50 €' },
          { name: 'Linhas Tortas Reserva',     price: '17,00 €' },
          { name: 'Bulas 2011',                price: '45,00 €' },
          { name: 'Linhas Tortas',             price: '12,50 €' },
        ]
      },
      {
        groupLabel: 'Sangrias',
        items: [
          { name: 'Branca',     price: '18,50 €' },
          { name: 'Tinta',      price: '18,50 €' },
          { name: 'Espumante',  price: '20,00 €' },
        ]
      },
      {
        groupLabel: 'Espumantes & Champagne',
        items: [
          { name: 'Veuve Pelletier',  price: '75,00 €' },
          { name: 'Moët Chandon',     price: '90,00 €' },
          { name: 'Millesimato',      price: '18,00 €' },
          { name: 'Terras do Demo',   price: '25,00 €' },
          { name: 'Murganheira',      price: '25,00 €' },
          { name: 'Asti',             price: '20,00 €' },
        ]
      }
    ]
  }
]

/* ═══════════════════════════════════════════════════
   PARTICLE SEED DATA — pre-calculated outside render
   ═══════════════════════════════════════════════════ */

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const sparkleColors = [ACCENT, ACCENT_LIGHT, ACCENT_PALE, SAND]
const sparkleParticles = (() => {
  const rng = seededRandom(42)
  return Array.from({ length: 20 }, () => ({
    x: rng() * 100,
    y: rng() * 100,
    size: 4 + rng() * 4,
    color: sparkleColors[Math.floor(rng() * sparkleColors.length)],
    duration: 1.5 + rng() * 2,
    delay: rng() * 3,
    isRay: rng() > 0.8,
  }))
})()

const waveParticles = (() => {
  const rng = seededRandom(77)
  return Array.from({ length: 8 }, (_, i) => ({
    y: 10 + i * 11,
    duration: 3 + rng() * 2,
    delay: i * 0.5,
    amplitude: 8 + rng() * 12,
  }))
})()
const waveDotsData = (() => {
  const rng = seededRandom(78)
  return Array.from({ length: 12 }, () => ({
    x: 5 + rng() * 90,
    y: 10 + rng() * 80,
    size: 3 + rng() * 3,
    duration: 2.5 + rng() * 2,
    delay: rng() * 3,
    color: [ACCENT + '66', ACCENT_LIGHT + '80', SAND + '99'][Math.floor(rng() * 3)],
  }))
})()

const emberColors = [ACCENT, ACCENT_LIGHT, STONE_DARK, STONE_WARM, ACCENT_PALE]
const emberParticles = (() => {
  const rng = seededRandom(101)
  return Array.from({ length: 20 }, () => ({
    x: 10 + rng() * 80,
    y: 50 + rng() * 50,
    size: 4 + rng() * 4,
    color: emberColors[Math.floor(rng() * emberColors.length)],
    duration: 2 + rng() * 3,
    delay: rng() * 4,
    drift: -25 + rng() * 50,
  }))
})()
const smokeParticles = (() => {
  const rng = seededRandom(200)
  return Array.from({ length: 6 }, () => ({
    x: 15 + rng() * 70,
    size: 30 + rng() * 20,
    duration: 4 + rng() * 4,
    delay: rng() * 3,
  }))
})()

const sugarColors = [ACCENT_PALE, ACCENT_LIGHT, SAND, ACCENT + '99']
const sugarParticles = (() => {
  const rng = seededRandom(55)
  return Array.from({ length: 16 }, () => ({
    x: 5 + rng() * 90,
    size: 5 + rng() * 5,
    color: sugarColors[Math.floor(rng() * sugarColors.length)],
    duration: 3 + rng() * 3,
    delay: rng() * 3,
    drift: -10 + rng() * 20,
  }))
})()
const sugarMeringues = (() => {
  const rng = seededRandom(56)
  return Array.from({ length: 4 }, () => ({
    x: 10 + rng() * 80,
    size: 20,
    duration: 5 + rng() * 3,
    delay: rng() * 3,
  }))
})()
const caramelSparks = (() => {
  const rng = seededRandom(57)
  return Array.from({ length: 8 }, () => ({
    x: 5 + rng() * 90,
    y: 10 + rng() * 80,
    duration: 0.8 + rng() * 0.7,
    delay: rng() * 4,
  }))
})()

const bubbleParticles = (() => {
  const rng = seededRandom(88)
  return Array.from({ length: 20 }, (_, i) => ({
    x: 5 + rng() * 90,
    size: 3 + rng() * 7,
    duration: 1.5 + rng() * 2.5,
    delay: i * 0.15,
    drift: -5 + rng() * 10,
    opacity: 0.35 + rng() * 0.3,
  }))
})()
const wineReflections = (() => {
  const rng = seededRandom(89)
  return Array.from({ length: 3 }, () => ({
    x: 15 + rng() * 70,
    y: 20 + rng() * 60,
    duration: 4 + rng() * 3,
    delay: rng() * 2,
  }))
})()

/* ═══════════════════════════════════════════════════
   PARTICLE LAYER COMPONENT
   ═══════════════════════════════════════════════════ */

function ParticleLayer({ type }) {
  if (type === 'sparkle') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkleParticles.map((p, i) =>
          p.isRay ? (
            <motion.div
              key={`ray-${i}`}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 1,
                height: 12,
                backgroundColor: ACCENT,
                transformOrigin: 'center',
                willChange: 'transform, opacity',
              }}
              initial={{ rotate: Math.floor(p.x * 3.6), scale: 0, opacity: 0 }}
              animate={{ opacity: [0, 0.75, 0], scale: [0, 1.2, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ) : (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size > 5 ? 6 : 4,
                height: p.size > 5 ? 6 : 4,
                backgroundColor: p.color,
                borderRadius: 2,
                transformOrigin: 'center',
                willChange: 'transform, opacity',
              }}
              initial={{ rotate: 45, scale: 0, opacity: 0 }}
              animate={{ rotate: 45, opacity: [0, 0.75, 0], scale: [0, 1.2, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          )
        )}
      </div>
    )
  }

  if (type === 'wave') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {waveParticles.map((w, i) => (
            <motion.path
              key={i}
              d={`M 0 ${w.y} Q 25 ${w.y - w.amplitude} 50 ${w.y} Q 75 ${w.y + w.amplitude} 100 ${w.y}`}
              stroke={`${ACCENT_LIGHT}80`}
              strokeWidth="1"
              fill="none"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: w.duration, repeat: Infinity, delay: w.delay, ease: 'easeInOut' }}
              style={{ willChange: 'opacity' }}
            />
          ))}
        </svg>
        {waveDotsData.map((d, i) => (
          <motion.div
            key={`wd-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
              willChange: 'transform, opacity',
            }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -15, 0] }}
            transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>
    )
  }

  if (type === 'ember') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {emberParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: `${100 - p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -180],
              x: [0, p.drift * 0.5, p.drift, p.drift * 0.5, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 0.2],
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
          />
        ))}
        {smokeParticles.map((s, i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              bottom: '10%',
              width: s.size,
              height: s.size,
              background: `radial-gradient(circle, ${STONE_WARM}40, transparent)`,
              filter: 'blur(12px)',
              willChange: 'transform, opacity',
            }}
            animate={{ y: [0, -250], opacity: [0, 0.5, 0], scale: [1, 3] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeOut' }}
          />
        ))}
        {[0, 1].map((fi) => (
          <motion.div
            key={`flame-${fi}`}
            className="absolute"
            style={{
              left: `${40 + fi * 20}%`,
              bottom: '10%',
              width: 60,
              height: 80,
              background: `radial-gradient(ellipse, ${ACCENT}33 0%, transparent 70%)`,
              filter: 'blur(20px)',
              willChange: 'transform',
            }}
            animate={{ scale: [1, 1.3, 0.9, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    )
  }

  if (type === 'sugar') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sugarParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: '5%',
              width: p.size,
              height: p.size,
              backgroundColor: p.color + '99',
              border: `1px solid ${ACCENT_LIGHT}66`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -80],
              x: [0, p.drift, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0.6],
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
        {sugarMeringues.map((m, i) => (
          <motion.div
            key={`mer-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${m.x}%`,
              bottom: '15%',
              width: m.size,
              height: m.size,
              background: `radial-gradient(circle, ${ACCENT_PALE}4D, transparent)`,
              filter: 'blur(6px)',
              willChange: 'transform, opacity',
            }}
            animate={{ y: [0, -60], opacity: [0, 0.5, 0], scale: [1, 1.4] }}
            transition={{ duration: m.duration, repeat: Infinity, delay: m.delay, ease: 'easeInOut' }}
          />
        ))}
        {caramelSparks.map((c, i) => (
          <motion.div
            key={`car-${i}`}
            className="absolute"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: 3,
              height: 3,
              backgroundColor: ACCENT,
              transform: 'rotate(45deg)',
              willChange: 'opacity',
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>
    )
  }

  if (type === 'bubble') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbleParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: '2%',
              width: p.size,
              height: p.size,
              background: `rgba(238,227,201,0.15)`,
              border: `1px solid ${ACCENT_LIGHT}80`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -200],
              x: [0, p.drift],
              opacity: [0, p.opacity, 0],
              scale: [0.5, 1, 0.8],
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
          />
        ))}
        {wineReflections.map((r, i) => (
          <motion.div
            key={`ref-${i}`}
            className="absolute"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: 40,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${ACCENT}1A, ${ACCENT_LIGHT}0D)`,
              filter: 'blur(16px)',
              willChange: 'transform, opacity',
            }}
            animate={{ x: [-10, 10, -10], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: r.duration, repeat: Infinity, delay: r.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>
    )
  }

  return null
}

/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════ */

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(16px) saturate(1.2)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

const overlayVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const modalVariants = {
  hidden: { scale: 0.88, opacity: 0, y: 60 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
  exit: {
    scale: 0.92,
    opacity: 0,
    y: 40,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

const modalVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 },
  },
}

const tabContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.55 },
  },
}

const tabItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
}

const contentContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
  exit: {},
}

const contentItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
}

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

const PAREN_REGEX = /\(([^)]+)\)/

function ItemName({ name }) {
  const match = name.match(PAREN_REGEX)
  if (!match) {
    return (
      <span className="font-sans text-[15px] md:text-[16px] leading-[1.4] min-w-0" style={{ color: 'rgba(255,255,255,0.90)' }}>
        {name}
      </span>
    )
  }
  const before = name.slice(0, match.index).trim()
  const inside = match[1]
  const after = name.slice(match.index + match[0].length).trim()
  return (
    <span className="font-sans text-[15px] md:text-[16px] leading-[1.4] min-w-0" style={{ color: 'rgba(255,255,255,0.90)' }}>
      {before}{' '}
      <span className="font-sans text-[13px] italic" style={{ color: `${ACCENT_LIGHT}80` }}>
        ({inside})
      </span>
      {after && ` ${after}`}
    </span>
  )
}

function MenuItemRow({ item, isLast }) {
  return (
    <motion.div
      variants={contentItemVariants}
      whileHover={{
        x: 6,
        backgroundColor: `${ACCENT}0A`,
        borderRadius: 8,
        paddingLeft: 8,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      className={clsx(
        'group flex items-center gap-3 py-4 cursor-none rounded-lg px-1 -mx-1',
        !isLast && 'border-b'
      )}
      style={{ borderColor: `${ACCENT}1A` }}
    >
      <span
        className="w-[4px] h-[4px] flex-shrink-0 rotate-45 mt-0.5"
        style={{ backgroundColor: ACCENT }}
      />

      <ItemName name={item.name} />

      <span
        className="flex-1 min-w-[20px] self-end mb-1.5 mx-2"
        style={{ borderBottom: `1px dotted ${ACCENT}33` }}
      />

      <span
        className="font-display text-[15px] font-semibold whitespace-nowrap flex-shrink-0"
        style={{ color: ACCENT_LIGHT }}
      >
        {item.price}
      </span>

      <motion.span
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ArrowRight size={12} weight="bold" style={{ color: ACCENT }} />
      </motion.span>
    </motion.div>
  )
}

function GroupDivider({ label }) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-3">
      <div className="h-[1px] w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT})` }} />
      <span
        className="font-sans text-[11px] uppercase tracking-[0.2em] px-3 py-1"
        style={{ color: ACCENT, backgroundColor: '#100502' }}
      >
        {label}
      </span>
      <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export default function MenuModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('entradas')
  const contentRef = useRef(null)
  const tabScrollRef = useRef(null)
  const closeBtnRef = useRef(null)
  const modalRef = useRef(null)
  const [showScrollFade, setShowScrollFade] = useState(true)
  const prefersReduced = useReducedMotion()

  const activeCat = useMemo(
    () => MENU_DATA.find((c) => c.id === activeCategory) || MENU_DATA[0],
    [activeCategory]
  )

  const switchCategory = useCallback(
    (id) => {
      setActiveCategory(id)
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    []
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setActiveCategory('entradas')
      setShowScrollFade(true)
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const currentIndex = MENU_DATA.findIndex((c) => c.id === activeCategory)
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = (currentIndex + 1) % MENU_DATA.length
        switchCategory(MENU_DATA[next].id)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = (currentIndex - 1 + MENU_DATA.length) % MENU_DATA.length
        switchCategory(MENU_DATA[prev].id)
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, activeCategory, onClose, switchCategory])

  const handleScroll = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30
    setShowScrollFade(!atBottom)
  }, [])

  const CatIcon = ICON_MAP[activeCat.icon] || ForkKnife

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={prefersReduced ? overlayVariantsReduced : overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4"
          style={{ backgroundColor: 'rgba(16,5,2,0.75)' }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu do Restaurante"
            variants={prefersReduced ? modalVariantsReduced : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col overflow-hidden w-full h-[100svh] md:w-[92vw] md:h-[92vh] lg:h-[92vh] md:rounded-[20px] lg:rounded-[24px]"
            style={{
              maxWidth: 920,
              margin: '0 auto',
              background: 'linear-gradient(160deg, #1A0A04 0%, #100502 50%, #0D0301 100%)',
              border: `1px solid ${ACCENT}33`,
              boxShadow: `0 32px 120px rgba(0,0,0,0.8), 0 0 0 1px ${ACCENT}14`,
            }}
          >
            {/* BACKGROUND PARTICLES */}
            {!prefersReduced && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bg-${activeCat.particleType}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 pointer-events-none z-[1]"
                >
                  <ParticleLayer type={activeCat.particleType} />
                </motion.div>
              </AnimatePresence>
            )}

            {/* ═══ ZONA A — HEADER FIXO ═══ */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 flex-shrink-0 px-5 pt-4 pb-0 md:px-8 md:pt-6"
              style={{
                background: 'linear-gradient(to bottom, #1A0A04 85%, transparent)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{
                      background: ACCENT_DIM,
                      border: `1px solid ${ACCENT}33`,
                    }}
                  >
                    <BookOpenText size={14} weight="duotone" style={{ color: ACCENT }} />
                    <span className="font-sans text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                      Carta do Restaurante
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeCat.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-[11px]"
                      style={{
                        background: ACCENT_DIM,
                        border: `1px solid ${ACCENT}33`,
                        color: ACCENT_LIGHT,
                      }}
                    >
                      <CatIcon size={12} weight="duotone" />
                      {activeCat.label}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <motion.button
                  ref={closeBtnRef}
                  onClick={onClose}
                  data-cursor="button"
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: `${ACCENT}33`,
                    borderColor: ACCENT,
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-none flex-shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${ACCENT}33`,
                  }}
                  aria-label="Fechar menu"
                >
                  <X size={16} weight="bold" style={{ color: ACCENT_LIGHT }} />
                </motion.button>
              </div>

              <h2 className="font-display font-bold text-white text-[24px] sm:text-[28px] md:text-[36px] mt-3 leading-[1.1]">
                Quinta do Duque
              </h2>
              <p className="font-sans text-[13px] italic mt-1" style={{ color: `${ACCENT_LIGHT}99` }}>
                Tradição, sabor e elegância à mesa
              </p>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 h-[1px]"
                style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})` }}
              />

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 h-[2px] origin-left"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT}, transparent)`,
                }}
              />
            </motion.div>

            {/* ═══ TABS ═══ */}
            <motion.div
              variants={tabContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 flex-shrink-0 px-5 py-3 md:px-8 md:py-4"
              style={{
                background: 'linear-gradient(to bottom, #1A0A04, rgba(26,10,4,0.95))',
              }}
            >
              <div
                ref={tabScrollRef}
                data-tab-scroll
                className="flex gap-2 md:gap-3 overflow-x-auto pb-1"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <style>{`[data-tab-scroll]::-webkit-scrollbar { display: none; }`}</style>
                {MENU_DATA.map((cat) => {
                  const Icon = ICON_MAP[cat.icon] || ForkKnife
                  const isActive = activeCategory === cat.id
                  return (
                    <motion.button
                      key={cat.id}
                      variants={tabItemVariants}
                      onClick={() => switchCategory(cat.id)}
                      data-cursor="button"
                      className={clsx(
                        'relative flex items-center gap-2 flex-shrink-0 rounded-full cursor-none',
                        'px-3 py-2.5 md:px-5 md:py-3'
                      )}
                      style={{
                        background: 'transparent',
                        border: '1px solid transparent',
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="tabIndicator"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: ACCENT_DIM,
                            border: `1px solid ${ACCENT}59`,
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon
                          size={16}
                          weight="duotone"
                          style={{
                            color: isActive ? ACCENT : `${ACCENT_LIGHT}80`,
                          }}
                        />
                        <span
                          className={clsx(
                            'font-sans text-[13px] font-medium hidden sm:inline',
                            isActive ? 'text-white' : 'text-white/40'
                          )}
                        >
                          {cat.label}
                        </span>
                      </span>
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full z-10"
                          style={{ backgroundColor: ACCENT }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* ═══ ZONA B — CONTEÚDO SCROLLÁVEL ═══ */}
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-5 pt-2 pb-4 md:px-8 md:pt-4 md:pb-6"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'thin',
                scrollbarColor: `${ACCENT} transparent`,
              }}
            >
              <style>{`
                .menu-scroll::-webkit-scrollbar { width: 3px; }
                .menu-scroll::-webkit-scrollbar-track { background: transparent; }
                .menu-scroll::-webkit-scrollbar-thumb { background: ${ACCENT}; border-radius: 4px; }
              `}</style>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCat.id}
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: prefersReduced ? 0.2 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* CATEGORY IMAGE */}
                  <div
                    className="relative w-full overflow-hidden mb-6"
                    style={{
                      height: 'clamp(200px, 30vw, 280px)',
                      borderRadius: 16,
                      border: `1px solid ${ACCENT}33`,
                      boxShadow: `0 0 40px ${ACCENT}14`,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeCat.id}
                        src={activeCat.image}
                        alt={CATEGORY_ALT[activeCat.id] || activeCat.label}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                        initial={prefersReduced ? { opacity: 0 } : { scale: 1.08, opacity: 0 }}
                        animate={prefersReduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                        exit={prefersReduced ? { opacity: 0 } : { scale: 0.96, opacity: 0 }}
                        transition={{
                          duration: prefersReduced ? 0.2 : 0.5,
                          ease: 'easeOut',
                        }}
                      />
                    </AnimatePresence>

                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, #100502 0%, rgba(16,5,2,0.6) 40%, transparent 100%)',
                      }}
                    />

                    {!prefersReduced && (
                      <div className="absolute inset-0 pointer-events-none z-10">
                        <ParticleLayer type={activeCat.particleType} />
                      </div>
                    )}

                    <h3
                      className="absolute bottom-5 left-5 z-20 font-display text-[28px] md:text-[32px] text-white italic"
                      style={{
                        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                      }}
                    >
                      {activeCat.label}
                    </h3>

                    <span
                      className="absolute bottom-3 right-4 z-20 font-display text-[11px] italic"
                      style={{ color: `${ACCENT_LIGHT}80` }}
                    >
                      Est. Guilhabreu
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="font-sans text-[14px] italic mb-5" style={{ color: `${ACCENT_LIGHT}CC` }}>
                    {activeCat.description}
                  </p>

                  {/* ITEMS LIST */}
                  <motion.div
                    variants={contentContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {activeCat.groups ? (
                      activeCat.groups.map((group) => (
                        <div key={group.groupLabel}>
                          <GroupDivider label={group.groupLabel} />
                          {group.items.map((item, idx) => (
                            <MenuItemRow
                              key={item.name}
                              item={item}
                              isLast={idx === group.items.length - 1}
                            />
                          ))}
                        </div>
                      ))
                    ) : (
                      activeCat.items.map((item, idx) => (
                        <MenuItemRow
                          key={item.name}
                          item={item}
                          isLast={idx === activeCat.items.length - 1}
                        />
                      ))
                    )}
                  </motion.div>

                  {/* Bottom divider */}
                  <div
                    className="mt-4 h-[1px] opacity-30"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* SCROLL FADEOUT */}
              {showScrollFade && (
                <div
                  className="sticky bottom-0 left-0 right-0 h-[60px] pointer-events-none z-20"
                  style={{
                    background: 'linear-gradient(transparent, #100502)',
                    marginTop: -60,
                  }}
                />
              )}
            </div>

            {/* ═══ ZONA C — FOOTER FIXO ═══ */}
            <div
              className="relative z-10 flex-shrink-0 px-5 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5"
              style={{
                background: 'linear-gradient(to top, #1A0A04 60%, transparent)',
              }}
            >
              <div className="flex justify-center">
                <motion.button
                  onClick={onClose}
                  data-cursor="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline border-gold-deep text-gold-medium w-full sm:w-auto px-10 py-3 justify-center cursor-none"
                >
                  <X size={16} weight="bold" />
                  Fechar Menu
                </motion.button>
              </div>

              <p className="font-sans text-[11px] text-center mt-2 pointer-events-none" style={{ color: `${ACCENT_LIGHT}4D` }}>
                Preços incluem IVA à taxa legal em vigor
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
