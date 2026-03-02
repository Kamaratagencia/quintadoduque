import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ArrowRight, ArrowLeft, CalendarBlank, Clock, Users,
  User, EnvelopeSimple, Phone, ChatText, WhatsappLogo,
  CheckCircle, Star, MapPin, SealCheck, WarningCircle,
  Minus, Plus, CaretDown,
} from '@phosphor-icons/react'
import hero1 from '../assets/hero1.png'

const WHATSAPP_NUMBER = '351252000000'

const INITIAL_FORM = {
  nome: '', email: '', telefone: '',
  data: '', hora: '', pessoas: '2', mensagem: '',
}

const LUNCH = ['12:00','12:30','13:00','13:30','14:00']
const DINNER = ['19:00','19:30','20:00','20:30','21:00','21:30','22:00']
const SLIDE_EASE = [0.32, 0.72, 0, 1]

const inputBase = {
  width: '100%',
  padding: '14px 16px 14px 44px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(205,152,46,0.18)',
  borderRadius: 10,
  fontFamily: 'Inter, sans-serif',
  fontSize: 15,
  color: '#FFFFFF',
  outline: 'none',
  transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
}
const focusS = {
  border: '1px solid rgba(205,152,46,0.65)',
  boxShadow: '0 0 0 3px rgba(205,152,46,0.12)',
  background: 'rgba(255,255,255,0.07)',
}
const errS = {
  border: '1px solid rgba(239,68,68,0.55)',
  boxShadow: '0 0 0 3px rgba(239,68,68,0.10)',
}

function Field({ label, icon: Icon, error, shake, children }) {
  return (
    <motion.div
      animate={shake ? { x: [0,-8,8,-6,6,-4,4,0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <label style={{
          fontFamily: 'Inter, sans-serif', fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'rgba(219,189,126,0.70)', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {Icon && <Icon size={13} weight="duotone" style={{ color: 'rgba(205,152,46,0.60)' }} />}
          {label}
        </label>
      )}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 11,
              color: 'rgba(239,68,68,0.80)', marginTop: 4, paddingLeft: 4,
              display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden',
            }}
          >
            <WarningCircle size={11} weight="fill" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function InputIcon({ icon: Icon }) {
  return (
    <Icon size={16} weight="duotone" style={{
      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
      color: 'rgba(205,152,46,0.60)', zIndex: 1,
    }} />
  )
}

function useFocusHandlers(errorKey, errors) {
  return {
    onFocus: (e) => Object.assign(e.target.style, focusS),
    onBlur: (e) => Object.assign(e.target.style, {
      border: errors[errorKey] ? errS.border : inputBase.border,
      boxShadow: errors[errorKey] ? errS.boxShadow : 'none',
      background: inputBase.background,
    }),
  }
}

/* ═══════════════════════════════════════════════════
   PLACEHOLDER — rest of file continues below
   ═══════════════════════════════════════════════════ */

export default function ReservationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [shakeFields, setShakeFields] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [slideDir, setSlideDir] = useState(1)
  const modalRef = useRef(null)
  const firstInputRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const h = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    if (isOpen) { setStep(1); setForm(INITIAL_FORM); setErrors({}); setSubmitted(false); setSlideDir(1) }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const sw = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = sw + 'px'
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => { document.body.style.overflow = ''; document.body.style.paddingRight = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 400)
  }, [isOpen, step])

  const updateField = (n, v) => {
    setForm((p) => ({ ...p, [n]: v }))
    if (errors[n]) setErrors((p) => { const c = { ...p }; delete c[n]; return c })
  }

  const triggerShake = (e) => { setShakeFields(e); setTimeout(() => setShakeFields({}), 500) }

  const validateStep1 = () => {
    const e = {}
    if (!form.nome || form.nome.trim().length < 2) e.nome = 'Nome obrigatório (mín. 2 caracteres)'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.telefone || form.telefone.replace(/[\s\-()]/g, '').length < 9) e.telefone = 'Telefone inválido (mín. 9 dígitos)'
    if (Object.keys(e).length) { setErrors(e); triggerShake(e); return false }
    setErrors({}); return true
  }

  const validateStep2 = () => {
    const e = {}
    const today = new Date().toISOString().split('T')[0]
    if (!form.data || form.data < today) e.data = 'Data inválida'
    if (!form.hora) e.hora = 'Hora obrigatória'
    const p = parseInt(form.pessoas)
    if (!form.pessoas || isNaN(p) || p < 1 || p > 20) e.pessoas = '1–20 pessoas'
    if (Object.keys(e).length) { setErrors(e); triggerShake(e); return false }
    setErrors({}); return true
  }

  const handleNext = () => { if (validateStep1()) { setSlideDir(1); setStep(2) } }
  const handleBack = () => { setSlideDir(-1); setStep(1) }

  const handleSubmit = () => {
    if (!validateStep2()) return
    const df = new Date(form.data).toLocaleDateString('pt-PT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    const msg = `🍽️ *Nova Reserva — Quinta do Duque*\n\n👤 *Nome:* ${form.nome}\n📧 *Email:* ${form.email}\n📱 *Telefone:* ${form.telefone}\n\n📅 *Data:* ${df}\n🕐 *Hora:* ${form.hora}\n👥 *Pessoas:* ${form.pessoas}${form.mensagem ? `\n\n💬 *Mensagem:* ${form.mensagem}` : ''}\n\n_Reserva efetuada pelo site da Quinta do Duque_`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    setSubmitted(true)
    setTimeout(() => { window.open(url, '_blank', 'noopener,noreferrer'); onClose() }, 1500)
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const adjustPeople = (d) => {
    const c = parseInt(form.pessoas) || 2
    updateField('pessoas', String(Math.max(1, Math.min(20, c + d))))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="res-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(10,3,1,0.88)',
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            }}
          />

          <motion.div
            key="res-modal"
            role="dialog" aria-modal="true" aria-label="Reservar Mesa"
            initial={isMobile ? { opacity: 1, y: '100%' } : { opacity: 0, scale: 0.93, y: 40 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { opacity: 1, y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={isMobile
              ? { duration: 0.4, ease: SLIDE_EASE }
              : { type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2001,
              display: 'flex',
              alignItems: isMobile ? 'flex-end' : 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
            className="p-0 sm:p-6 lg:p-8"
          >
            <div
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                pointerEvents: 'auto', width: '100%',
                maxWidth: isMobile ? '100%' : 960,
                maxHeight: '95svh',
                border: '1px solid rgba(205,152,46,0.15)',
                borderRadius: isMobile ? '24px 24px 0 0' : 24,
                overflow: 'hidden',
                boxShadow: '0 32px 96px rgba(10,3,1,0.8)',
                display: 'flex', position: 'relative',
              }}
            >
              {/* ── COLUNA ESQUERDA — IMAGEM (desktop) ── */}
              <div className="hidden lg:block" style={{
                width: '42%', flexShrink: 0, position: 'relative', overflow: 'hidden',
              }}>
                <motion.img
                  src={hero1} alt="Quinta do Duque"
                  initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', willChange: 'transform' }}
                />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(135deg, rgba(10,3,1,0) 0%, rgba(10,3,1,0.3) 60%, rgba(10,3,1,0.80) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, transparent 60%, rgba(10,3,1,0.95) 100%)' }} />

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 28px' }}>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(205,152,46,0.12)', border: '1px solid rgba(205,152,46,0.28)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
                    <Star size={12} weight="duotone" style={{ color: '#CD982E' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#DBBD7E' }}>Reservas</span>
                  </motion.div>
                  <motion.h3 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }}
                    style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 22, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, maxWidth: 220 }}>
                    Uma mesa para uma noite inesquecível
                  </motion.h3>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65, duration: 0.5 }}
                    style={{ width: 40, height: 1, marginTop: 12, marginBottom: 12, background: 'linear-gradient(to right, #CD982E, transparent)' }} />
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={13} weight="duotone" style={{ color: '#CD982E' }} />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(219,189,126,0.70)' }}>Guilhabreu · Vila do Conde</span>
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} weight="fill" style={{ color: '#CD982E' }} />)}
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(219,189,126,0.50)' }}>9.1/10 · TheFork</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ── COLUNA DIREITA — FORMULÁRIO ── */}
              <div className="w-full lg:w-[58%] reservation-form-scroll" style={{
                background: 'rgba(16,5,2,0.98)', overflowY: 'auto', maxHeight: '95svh', position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(205,152,46,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1, background: 'linear-gradient(to right, rgba(205,152,46,0.4) 0%, transparent 60%)' }} />

                <div className="p-5 sm:p-7 lg:px-9 lg:py-10" style={{ position: 'relative', zIndex: 1 }}>
                  {/* HEADER */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 24 : 32 }}>
                    <div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(219,189,126,0.50)', marginBottom: 8, display: 'block' }}>Reserve a sua mesa</span>
                      <h2 id="modal-title" className="text-[22px] lg:text-[28px]" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>
                        Uma experiência<br />que começa <span className="gold-text">aqui</span>
                      </h2>
                    </div>
                    <motion.button onClick={onClose} aria-label="Fechar modal de reserva" data-cursor="button"
                      whileHover={{ background: 'rgba(205,152,46,0.15)', borderColor: 'rgba(205,152,46,0.35)' }}
                      whileTap={{ scale: 0.9 }} className="cursor-none"
                      style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <X size={16} weight="bold" style={{ color: 'rgba(255,255,255,0.70)' }} />
                    </motion.button>
                  </div>

                  {/* PROGRESS */}
                  {!submitted && (
                    <div style={{ marginBottom: isMobile ? 24 : 32, display: 'flex', gap: 8 }}>
                      {[1, 2].map((s) => (
                        <div key={s} style={{ flex: 1 }}>
                          <div style={{ height: 2, borderRadius: 2, overflow: 'hidden', background: 'rgba(205,152,46,0.15)' }}>
                            {step > s && <div style={{ width: '100%', height: '100%', background: '#CD982E' }} />}
                            {step === s && (
                              <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, #CD982E, #DBBD7E)' }} />
                            )}
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: step >= s ? '#DBBD7E' : 'rgba(219,189,126,0.30)', marginTop: 8, display: 'block' }}>
                            {s === 1 ? 'Identificação' : 'Detalhes da Reserva'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CONTENT */}
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px' }}>
                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 0.1, duration: 0.6 }}>
                            <CheckCircle size={64} weight="duotone" style={{ color: '#CD982E' }} />
                          </motion.div>
                          <motion.div animate={{ scale: [1, 1.4], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(rgba(37,211,102,0.2), transparent)' }} />
                        </div>
                        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, color: '#FFFFFF', marginTop: 20 }}>A abrir WhatsApp...</h3>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(219,189,126,0.70)', marginTop: 8 }}>A sua reserva será confirmada em instantes</p>
                        <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
                          {[0, 1, 2].map((i) => (
                            <motion.div key={i} animate={{ scale: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                              style={{ width: 8, height: 8, borderRadius: '50%', background: '#CD982E' }} />
                          ))}
                        </div>
                      </motion.div>
                    ) : step === 1 ? (
                      <motion.div key="step1"
                        initial={{ x: slideDir * 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: slideDir * -60, opacity: 0 }}
                        transition={{ duration: 0.3, ease: SLIDE_EASE }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          <Field label="Nome" icon={User} error={errors.nome} shake={!!shakeFields.nome}>
                            <div style={{ position: 'relative' }}>
                              <InputIcon icon={User} />
                              <input ref={step === 1 ? firstInputRef : undefined}
                                type="text" name="nome" autoComplete="name" placeholder="O seu nome completo"
                                value={form.nome} onChange={(e) => updateField('nome', e.target.value)}
                                data-cursor="button" className="cursor-none"
                                style={{ ...inputBase, ...(errors.nome ? errS : {}) }}
                                {...useFocusHandlers('nome', errors)} />
                            </div>
                          </Field>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Email" icon={EnvelopeSimple} error={errors.email} shake={!!shakeFields.email}>
                              <div style={{ position: 'relative' }}>
                                <InputIcon icon={EnvelopeSimple} />
                                <input type="email" name="email" autoComplete="email" inputMode="email"
                                  placeholder="email@exemplo.pt" value={form.email}
                                  onChange={(e) => updateField('email', e.target.value)}
                                  data-cursor="button" className="cursor-none"
                                  style={{ ...inputBase, ...(errors.email ? errS : {}) }}
                                  {...useFocusHandlers('email', errors)} />
                              </div>
                            </Field>
                            <Field label="Telefone" icon={Phone} error={errors.telefone} shake={!!shakeFields.telefone}>
                              <div style={{ position: 'relative' }}>
                                <InputIcon icon={Phone} />
                                <input type="tel" name="telefone" autoComplete="tel" inputMode="tel"
                                  placeholder="+351 000 000 000" value={form.telefone}
                                  onChange={(e) => updateField('telefone', e.target.value)}
                                  data-cursor="button" className="cursor-none"
                                  style={{ ...inputBase, ...(errors.telefone ? errS : {}) }}
                                  {...useFocusHandlers('telefone', errors)} />
                              </div>
                            </Field>
                          </div>
                        </div>
                        <motion.button onClick={handleNext} data-cursor="button"
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          className="btn-primary cursor-none"
                          style={{ width: '100%', marginTop: 28, padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                          Próximo Passo
                          <ArrowRight size={18} weight="bold" />
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div key="step2"
                        initial={{ x: slideDir * 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: slideDir * -60, opacity: 0 }}
                        transition={{ duration: 0.3, ease: SLIDE_EASE }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Data" icon={CalendarBlank} error={errors.data} shake={!!shakeFields.data}>
                              <div style={{ position: 'relative' }}>
                                <InputIcon icon={CalendarBlank} />
                                <input ref={step === 2 ? firstInputRef : undefined}
                                  type="date" name="data" min={todayStr} value={form.data}
                                  onChange={(e) => updateField('data', e.target.value)}
                                  data-cursor="button" className="cursor-none"
                                  style={{ ...inputBase, colorScheme: 'dark', ...(errors.data ? errS : {}) }}
                                  onFocus={(e) => Object.assign(e.target.style, { ...focusS, colorScheme: 'dark' })}
                                  onBlur={(e) => Object.assign(e.target.style, {
                                    border: errors.data ? errS.border : inputBase.border,
                                    boxShadow: errors.data ? errS.boxShadow : 'none',
                                    background: inputBase.background, colorScheme: 'dark',
                                  })} />
                              </div>
                            </Field>
                            <Field label="Hora" icon={Clock} error={errors.hora} shake={!!shakeFields.hora}>
                              <div style={{ position: 'relative' }}>
                                <InputIcon icon={Clock} />
                                <CaretDown size={14} weight="bold" style={{
                                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                  color: 'rgba(205,152,46,0.50)', pointerEvents: 'none', zIndex: 1,
                                }} />
                                <select name="hora" value={form.hora}
                                  onChange={(e) => updateField('hora', e.target.value)}
                                  data-cursor="button" className="cursor-none"
                                  style={{
                                    ...inputBase, paddingRight: 40,
                                    appearance: 'none', WebkitAppearance: 'none',
                                    ...(errors.hora ? errS : {}),
                                    ...(!form.hora ? { color: 'rgba(210,175,145,0.35)' } : {}),
                                  }}>
                                  <option value="" disabled className="bg-[#100502] text-white">Selecionar hora</option>
                                  <optgroup label="Almoço">
                                    {LUNCH.map((h) => <option key={h} value={h} className="bg-[#100502] text-white">{h}</option>)}
                                  </optgroup>
                                  <optgroup label="Jantar">
                                    {DINNER.map((h) => <option key={h} value={h} className="bg-[#100502] text-white">{h}</option>)}
                                  </optgroup>
                                </select>
                              </div>
                            </Field>
                          </div>

                          <Field label="Número de Pessoas" icon={Users} error={errors.pessoas} shake={!!shakeFields.pessoas}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                              <motion.button onClick={() => adjustPeople(-1)}
                                disabled={parseInt(form.pessoas) <= 1} whileTap={{ scale: 0.9 }}
                                data-cursor="button" className="cursor-none"
                                style={{
                                  width: 36, height: 36, borderRadius: '50%',
                                  background: 'rgba(205,152,46,0.10)', border: '1px solid rgba(205,152,46,0.25)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  opacity: parseInt(form.pessoas) <= 1 ? 0.3 : 1,
                                  pointerEvents: parseInt(form.pessoas) <= 1 ? 'none' : 'auto',
                                }}>
                                <Minus size={14} weight="bold" style={{ color: '#CD982E' }} />
                              </motion.button>
                              <div style={{ minWidth: 32, textAlign: 'center' }}>
                                <AnimatePresence mode="wait">
                                  <motion.span key={form.pessoas}
                                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.15 }}
                                    style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 22, fontWeight: 700, color: '#FFFFFF', display: 'block' }}>
                                    {form.pessoas || '2'}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                              <motion.button onClick={() => adjustPeople(1)}
                                disabled={parseInt(form.pessoas) >= 20} whileTap={{ scale: 0.9 }}
                                data-cursor="button" className="cursor-none"
                                style={{
                                  width: 36, height: 36, borderRadius: '50%',
                                  background: 'rgba(205,152,46,0.10)', border: '1px solid rgba(205,152,46,0.25)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  opacity: parseInt(form.pessoas) >= 20 ? 0.3 : 1,
                                  pointerEvents: parseInt(form.pessoas) >= 20 ? 'none' : 'auto',
                                }}>
                                <Plus size={14} weight="bold" style={{ color: '#CD982E' }} />
                              </motion.button>
                            </div>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(219,189,126,0.40)', marginTop: 8, display: 'block' }}>
                              Para grupos acima de 20, contacte-nos
                            </span>
                          </Field>

                          <Field label="Mensagem (opcional)" icon={ChatText} error={null} shake={false}>
                            <div style={{ position: 'relative' }}>
                              <textarea name="mensagem" rows={3}
                                placeholder="Aniversário, alergias, pedidos especiais..."
                                value={form.mensagem}
                                onChange={(e) => { if (e.target.value.length <= 300) updateField('mensagem', e.target.value) }}
                                data-cursor="button" className="cursor-none"
                                style={{ ...inputBase, paddingLeft: 14, resize: 'none' }}
                                onFocus={(e) => Object.assign(e.target.style, focusS)}
                                onBlur={(e) => Object.assign(e.target.style, { border: inputBase.border, boxShadow: 'none', background: inputBase.background })} />
                              <span style={{
                                position: 'absolute', bottom: 8, right: 12,
                                fontFamily: 'Inter, sans-serif', fontSize: 10,
                                color: form.mensagem.length >= 280 ? 'rgba(205,152,46,0.60)' : 'rgba(219,189,126,0.30)',
                              }}>{form.mensagem.length} / 300</span>
                            </div>
                          </Field>
                        </div>

                        <div style={{ marginTop: 28 }}>
                          <motion.button onClick={handleBack} data-cursor="button" whileHover={{ x: -2 }} className="cursor-none"
                            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(219,189,126,0.50)', padding: '10px 0', marginBottom: 12 }}>
                            <ArrowLeft size={14} weight="bold" /> Voltar
                          </motion.button>

                          <motion.button onClick={handleSubmit} data-cursor="button"
                            whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
                            className="cursor-none"
                            style={{
                              width: '100%', padding: 16,
                              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                              boxShadow: '0 8px 24px rgba(37,211,102,0.25)',
                              borderRadius: 10, border: 'none',
                              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                              fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
                              color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em',
                            }}>
                            <WhatsappLogo size={20} weight="fill" /> Reservar via WhatsApp
                          </motion.button>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                            <SealCheck size={13} weight="duotone" style={{ color: 'rgba(205,152,46,0.50)' }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(219,189,126,0.40)' }}>Confirmação imediata · Sem cartão necessário</span>
                          </div>
                        </div>

                        <AnimatePresence>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="hidden lg:flex"
                            style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(205,152,46,0.08)', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                            {[
                              { icon: SealCheck, text: '100% Seguro' },
                              { icon: Clock, text: 'Resposta em minutos' },
                              { icon: Star, text: '9.1/10 TheFork' },
                            ].map((b, i) => (
                              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                {i > 0 && <span style={{ color: 'rgba(219,189,126,0.20)', marginRight: 7 }}>·</span>}
                                <b.icon size={11} weight="duotone" style={{ color: 'rgba(205,152,46,0.50)' }} />
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(219,189,126,0.40)' }}>{b.text}</span>
                              </span>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <style>{`
                  .reservation-form-scroll::-webkit-scrollbar{width:3px}
                  .reservation-form-scroll::-webkit-scrollbar-track{background:transparent}
                  .reservation-form-scroll::-webkit-scrollbar-thumb{background:rgba(205,152,46,0.2);border-radius:2px}
                `}</style>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
