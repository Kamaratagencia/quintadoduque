import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import logo from '../assets/logo.png'

const PARTICLES = [
  { top: '12%', left: '8%', size: 3, delay: 0.2, dur: 4.2 },
  { top: '18%', right: '11%', size: 2, delay: 0.8, dur: 3.6 },
  { top: '72%', left: '14%', size: 2, delay: 1.4, dur: 4.8 },
  { top: '78%', right: '9%', size: 3, delay: 0.5, dur: 3.9 },
  { top: '35%', left: '5%', size: 2, delay: 1.0, dur: 4.5 },
  { top: '60%', right: '6%', size: 2, delay: 1.8, dur: 3.3 },
]

 const EXPO_EASE = [0.32, 0.72, 0, 1]

function Corner({ position, style }) {
  const base = {
    position: 'absolute',
    width: 40,
    height: 40,
    pointerEvents: 'none',
    ...style,
  }

  const hStyle = {
    position: 'absolute',
    height: 1,
    width: 40,
    background: 'rgba(205,152,46,0.25)',
  }

  const vStyle = {
    position: 'absolute',
    width: 1,
    height: 40,
    background: 'rgba(205,152,46,0.25)',
  }

  if (position === 'tl') {
    return (
      <motion.div
        style={{ ...base, top: 32, left: 32 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
      >
        <div style={{ ...hStyle, top: 0, left: 0 }} />
        <div style={{ ...vStyle, top: 0, left: 0 }} />
      </motion.div>
    )
  }
  if (position === 'tr') {
    return (
      <motion.div
        style={{ ...base, top: 32, right: 32 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
      >
        <div style={{ ...hStyle, top: 0, right: 0 }} />
        <div style={{ ...vStyle, top: 0, right: 0 }} />
      </motion.div>
    )
  }
  if (position === 'bl') {
    return (
      <motion.div
        style={{ ...base, bottom: 32, left: 32 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
      >
        <div style={{ ...hStyle, bottom: 0, left: 0 }} />
        <div style={{ ...vStyle, bottom: 0, left: 0 }} />
      </motion.div>
    )
  }
  return (
    <motion.div
      style={{ ...base, bottom: 32, right: 32 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
    >
      <div style={{ ...hStyle, bottom: 0, right: 0 }} />
      <div style={{ ...vStyle, bottom: 0, right: 0 }} />
    </motion.div>
  )
}

function Particle({ top, left, right, size, delay, dur }) {
  const posStyle = { position: 'absolute', top }
  if (left) posStyle.left = left
  if (right) posStyle.right = right

  return (
    <motion.div
      style={{
        ...posStyle,
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#D2A956',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.3, 0, 0.2, 0],
        y: [0, -6, 2, -4, 0],
      }}
      transition={{
        delay,
        duration: dur,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function IntroLoader({ onComplete }) {
  const reducedMotion = useReducedMotion()
  const logoRef = useRef(null)
  const [isOutro, setIsOutro] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [flyY, setFlyY] = useState(0)
  const [flyScale, setFlyScale] = useState(1)
  const hasCalledComplete = useRef(false)

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => {
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true
          onComplete()
        }
      }, 500)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      if (!hasCalledComplete.current) {
        hasCalledComplete.current = true
        onComplete()
      }
    }, 3200)
    return () => clearTimeout(timer)
  }, [onComplete, reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    const t1 = setTimeout(() => setIsOutro(true), 2400)
    const t2 = setTimeout(() => setIsFlying(true), 2700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const mq = window.matchMedia('(max-width: 1023px)')

    const compute = () => {
      const mobile = mq.matches
      const navbarHeight = mobile ? 80 : 96
      const logoFinalHeight = mobile ? 56 : 72
      const logoStartHeight = mobile ? 72 : 100

      const headerEl = document.querySelector('header')
      const navLogoEl = headerEl
        ? headerEl.querySelector('img[alt="Quinta do Duque"]')
        : null

      const navLogoRect = navLogoEl ? navLogoEl.getBoundingClientRect() : null
      const targetCenterY = navLogoRect
        ? navLogoRect.top + navLogoRect.height / 2
        : navbarHeight / 2 + 16

      setFlyY(targetCenterY - window.innerHeight / 2)
      setFlyScale(
        navLogoRect ? navLogoRect.height / logoStartHeight : logoFinalHeight / logoStartHeight
      )
    }

    compute()
    mq.addEventListener('change', compute)
    window.addEventListener('resize', compute)

    return () => {
      mq.removeEventListener('change', compute)
      window.removeEventListener('resize', compute)
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#100502',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      >
        <img
          src={logo}
          alt="Quinta do Duque"
          style={{ height: 72, width: 'auto', objectFit: 'contain' }}
        />
      </motion.div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#100502',
        }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: isFlying ? 0 : 1, scale: isFlying ? 1.04 : 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeIn',
        }}
      />

      <motion.div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        animate={{ opacity: isOutro ? 0 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Corner position="tl" />
        <Corner position="tr" />
        <Corner position="bl" />
        <Corner position="br" />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        animate={{ opacity: isFlying ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      >
        {PARTICLES.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </motion.div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #CD982E, transparent)',
            transformOrigin: 'center',
            marginBottom: 0,
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={[
            { width: typeof window !== 'undefined' && window.innerWidth < 1024 ? 140 : 200, opacity: 1 },
            { width: 0, opacity: 0 },
          ]}
          transition={{
            times: [0, 1],
            delay: 0.3,
            duration: 0.8,
            ease: 'easeOut',
          }}
        />

        <motion.div
          animate={{ y: isFlying ? flyY : [0, -4, 0] }}
          transition={isFlying
            ? { duration: 0.5, ease: EXPO_EASE }
            : { delay: 2.0, duration: 0.5, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        >
          <motion.div
            style={{ position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: isFlying ? flyScale : 1,
            }}
            transition={{
              opacity: { delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              scale: isFlying
                ? { duration: 0.5, ease: EXPO_EASE }
                : { delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <motion.img
              ref={logoRef}
              src={logo}
              alt="Quinta do Duque"
              style={{
                height: typeof window !== 'undefined' && window.innerWidth < 1024 ? 72 : 100,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
              initial={{ filter: 'brightness(0) invert(1)' }}
              animate={{ filter: 'brightness(1) invert(0)' }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            />

            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 80,
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(219,189,126,0.55), transparent)',
                filter: 'blur(6px)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 0.65, ease: 'easeInOut', delay: 1.3 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 20,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: isOutro ? 0 : 1,
            y: isOutro ? -8 : 0,
          }}
          transition={isOutro
            ? { duration: 0.3, ease: 'easeOut' }
            : { delay: 1.5, duration: 0.01 }}
        >
          <motion.span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              color: '#CD982E',
              display: 'block',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5, ease: 'easeOut' }}
          >
            QUINTA DO DUQUE
          </motion.span>

          <motion.span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'rgba(210,175,145,0.6)',
              display: 'block',
              marginTop: 6,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.65, duration: 0.5, ease: 'easeOut' }}
          >
            Guilhabreu · Portugal
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}
