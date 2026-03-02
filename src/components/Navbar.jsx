import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarBlank,
  X,
  ArrowRight,
  Phone,
  WhatsappLogo,
} from '@phosphor-icons/react'
import useNavbarScroll from '../hooks/useNavbarScroll'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'A Casa', href: '#a-casa' },
  { label: 'Menu', href: '#menu' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Avaliacoes', href: '#avaliacoes' },
  { label: 'Localizacao', href: '#localizacao' },
  { label: 'Reservas', href: '#reservas' },
]

const EXPO_EASE = [0.32, 0.72, 0, 1]

const drawerLinkVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.15 + i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
  exit: { x: -20, opacity: 0, transition: { duration: 0.2 } },
}

function HamburgerButton({ isOpen, onToggle, isTop }) {
  const lineColor = '#DBBD7E'
  const rippleKey = useRef(0)
  const [showRipple, setShowRipple] = useState(false)

  useEffect(() => {
    if (isOpen) {
      rippleKey.current += 1
      setShowRipple(true)
      const t = setTimeout(() => setShowRipple(false), 600)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  return (
    <motion.button
      onClick={onToggle}
      data-cursor="button"
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      whileTap={{ scale: 0.92 }}
      animate={{
        borderRadius: isOpen ? 12 : 26,
        backgroundColor: isOpen ? 'rgba(205,152,46,0.10)' : 'rgba(255,255,255,0.0)',
        borderColor: isOpen ? 'rgba(205,152,46,0.30)' : 'rgba(205,152,46,0.0)',
      }}
      transition={{ duration: 0.3 }}
      style={{
        width: 52,
        height: 52,
        border: '1px solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
      className="md:w-[52px] md:h-[52px] w-[44px] h-[44px]"
    >
      <div style={{
        width: 24,
        height: 18,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8.5 : 0,
            width: isOpen ? 22 : 24,
            backgroundColor: isOpen ? '#CD982E' : lineColor,
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            height: 1.5,
            borderRadius: 2,
            display: 'block',
            transformOrigin: 'center center',
          }}
        />
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 8 : 0,
            scale: isOpen ? 0.5 : 1,
            backgroundColor: isOpen ? '#CD982E' : lineColor,
          }}
          transition={{ duration: 0.25 }}
          style={{
            width: 16,
            height: 1.5,
            borderRadius: 2,
            display: 'block',
            marginLeft: 'auto',
          }}
        />
        <motion.span
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8.5 : 0,
            width: isOpen ? 22 : 20,
            backgroundColor: isOpen ? '#CD982E' : lineColor,
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            height: 1.5,
            borderRadius: 2,
            display: 'block',
            transformOrigin: 'center center',
          }}
        />
      </div>

      <AnimatePresence>
        {showRipple && (
          <motion.div
            key={rippleKey.current}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid rgba(205,152,46,0.4)',
              pointerEvents: 'none',
              x: '-50%',
              y: '-50%',
            }}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function DrawerLink({ link, index, isActive, onNavigate }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.a
      href={link.href}
      custom={index}
      variants={drawerLinkVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={(e) => {
        e.preventDefault()
        onNavigate(link.href)
      }}
      data-cursor="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 0',
        borderBottom: '1px solid rgba(205,152,46,0.08)',
        textDecoration: 'none',
        cursor: 'none',
        position: 'relative',
      }}
      whileHover="hovered"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 28 }}>
        {isActive && (
          <motion.div
            layoutId="drawerActiveDot"
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#CD982E',
              flexShrink: 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          color: isActive ? 'rgba(205,152,46,1)' : 'rgba(205,152,46,0.4)',
        }}>
          {num}
        </span>
      </div>

      <motion.span
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 30,
          fontWeight: 400,
          color: isActive ? '#FFFFFF' : 'rgba(238,227,201,0.8)',
          flex: 1,
        }}
        variants={{
          hovered: { color: '#FFFFFF', x: 6 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {link.label}
      </motion.span>

      <motion.div
        style={{ flexShrink: 0 }}
        variants={{
          hovered: { opacity: 1, x: 0 },
        }}
        initial={{ opacity: 0, x: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <ArrowRight size={16} weight="bold" color="#CD982E" />
      </motion.div>
    </motion.a>
  )
}

function MenuDrawer({ isOpen, onClose, activeSection, isMobile }) {
  const scrollToSection = (href) => {
    onClose()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 150,
              background: 'rgba(16,5,2,0.75)',
              backdropFilter: 'blur(4px)',
              cursor: 'none',
            }}
          />

          <motion.div
            initial={isMobile ? { y: '100%' } : { x: -460 }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: -460 }}
            transition={{ duration: 0.5, ease: EXPO_EASE }}
            style={isMobile ? {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '92vh',
              borderRadius: '24px 24px 0 0',
              background: '#100502',
              zIndex: 160,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            } : {
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 460,
              background: '#100502',
              zIndex: 160,
              borderRight: '1px solid rgba(205,152,46,0.15)',
              boxShadow: '8px 0 40px rgba(16,5,2,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {isMobile && (
              <div style={{
                width: 48,
                height: 4,
                borderRadius: 2,
                background: 'rgba(219,189,126,0.25)',
                margin: '16px auto 0 auto',
                flexShrink: 0,
              }} />
            )}

            <div style={{
              padding: '32px 40px 0 40px',
              position: 'relative',
              flexShrink: 0,
            }}>
              <img
                src={logo}
                alt="Quinta do Duque"
                style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }}
              />
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'rgba(219,189,126,0.5)',
                display: 'block',
                marginTop: 8,
              }}>
                Guilhabreu · Vila do Conde · Portugal
              </span>

              <button
                onClick={onClose}
                data-cursor="button"
                style={{
                  position: 'absolute',
                  top: 28,
                  right: 32,
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  padding: 4,
                }}
              >
                <motion.div
                  whileHover={{ rotate: 90, color: '#CD982E' }}
                  transition={{ duration: 0.3 }}
                  style={{ color: 'rgba(219,189,126,0.6)' }}
                >
                  <X size={20} weight="bold" />
                </motion.div>
              </button>
            </div>

            <div style={{
              margin: '28px 40px',
              height: 1,
              background: 'linear-gradient(90deg, #CD982E, #DBBD7E, transparent)',
              flexShrink: 0,
            }} />

            <nav style={{
              padding: '0 40px',
              flex: 1,
              overflowY: 'auto',
            }}>
              {NAV_LINKS.map((link, i) => (
                <DrawerLink
                  key={link.href}
                  link={link}
                  index={i}
                  isActive={activeSection === link.href.replace('#', '')}
                  onNavigate={scrollToSection}
                />
              ))}
            </nav>

            <div style={{
              position: 'relative',
              padding: '28px 40px 40px 40px',
              borderTop: '1px solid rgba(205,152,46,0.10)',
              background: 'linear-gradient(to top, rgba(16,5,2,1), rgba(16,5,2,0))',
              flexShrink: 0,
            }}>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
                onClick={() => scrollToSection('#reservas')}
                data-cursor="button"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  cursor: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <CalendarBlank size={18} weight="bold" />
                Reservar Mesa
              </motion.button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 12,
                justifyContent: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <Phone size={14} weight="duotone" color="rgba(219,189,126,0.5)" />
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    color: 'rgba(219,189,126,0.5)',
                  }}>+351 252 000 000</span>
                </div>
                <WhatsappLogo size={16} weight="duotone" color="#25D366" />
              </div>
            </div>

            <div style={{
              position: 'absolute',
              left: 0,
              top: 80,
              bottom: 80,
              width: 1,
              background: 'linear-gradient(transparent, #CD982E 30%, #CD982E 70%, transparent)',
              opacity: 0.15,
              pointerEvents: 'none',
            }} />

            <span style={{
              position: 'absolute',
              bottom: -20,
              right: -10,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 200,
              fontWeight: 900,
              color: 'rgba(205,152,46,0.04)',
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1,
            }}>
              1751
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const { scrollY } = useNavbarScroll()
  const [navMode, setNavMode] = useState('top')
  const lastScrollY = useRef(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const current = scrollY

    if (current < 60) {
      setNavMode('top')
    } else {
      setNavMode('sticky')
    }

    lastScrollY.current = current
  }, [scrollY])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollToSection = (href) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isTop = navMode === 'top'

  return (
    <>
      <motion.header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
        }}
      >
        <motion.div
          animate={{
            backdropFilter: isTop
              ? 'blur(0px)'
              : 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: isTop
              ? 'blur(0px)'
              : 'blur(24px) saturate(180%)',
            borderBottomColor: isTop
              ? 'rgba(205,152,46,0)'
              : 'rgba(205,152,46,0.12)',
            boxShadow: isTop
              ? '0 0 0 rgba(17,6,2,0)'
              : '0 8px 32px rgba(17,6,2,0.8), inset 0 1px 0 rgba(219,189,126,0.08)',
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{ 
            borderBottom: '1px solid transparent',
            backgroundColor: isTop ? 'rgba(255,255,255,0)' : 'rgba(17,6,2,0.95)',
          }}
        >
          <motion.div
            animate={{ opacity: isTop ? 0 : 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(255,255,255,0)',
              zIndex: 1
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            animate={{ height: isTop ? (isMobile ? 80 : 96) : (isMobile ? 60 : 68) }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="container-site"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <HamburgerButton
                isOpen={menuOpen}
                onToggle={() => setMenuOpen(!menuOpen)}
                isTop={isTop}
              />
            </div>

            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}>
              <a
                href="#inicio"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('#inicio')
                }}
                data-cursor="button"
                style={{ cursor: 'none', display: 'block' }}
              >
                <motion.img
                  src={logo}
                  alt="Quinta do Duque"
                  animate={{
                    height: isTop ? (isMobile ? 56 : 72) : (isMobile ? 40 : 48),
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 28 }}
                  style={{
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </a>
            </div>

            <div style={{ marginLeft: 'auto', position: 'relative', zIndex: 2 }}>
              {isMobile ? (
                <motion.button
                  onClick={() => scrollToSection('#reservas')}
                  data-cursor="button"
                  whileTap={{ scale: 0.92 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'none',
                    padding: 8,
                  }}
                >
                  <CalendarBlank
                    size={22}
                    weight="bold"
                    color={isTop ? '#DBBD7E' : '#CD982E'}
                  />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => scrollToSection('#reservas')}
                  data-cursor="button"
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    backgroundColor: isTop ? 'rgba(255,255,255,0)' : '#CD982E',
                    color: isTop ? '#FFFFFF' : '#FFFFFF',
                    borderColor: isTop ? 'rgba(255,255,255,0.7)' : '#CD982E',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 24px',
                    borderRadius: 8,
                    border: '1px solid',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'none',
                    textTransform: 'uppercase',
                  }}
                  whileHover={{
                    backgroundColor: isTop ? 'rgba(255,255,255,1)' : '#B8871F',
                    color: isTop ? '#100502' : '#FFFFFF',
                  }}
                >
                  <CalendarBlank size={16} weight="bold" />
                  Reservar Mesa
                </motion.button>
              )}
            </div>
          </motion.div>
          </div>
        </motion.div>
      </motion.header>

      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
        isMobile={isMobile}
      />
    </>
  )
}
