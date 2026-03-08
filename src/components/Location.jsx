import { useState, useEffect } from 'react'
import { MapPin, Clock, Phone, Envelope, ArrowSquareOut, WhatsappLogo } from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import SectionTitle from './ui/SectionTitle'

const schedule = [
  { day: 'Segunda e Terça', hours: 'Encerrado', closed: true },
  { day: 'Quarta a Domingo', hours: '12h00 - 15h00 (almoço) | 19h00 - 23h00 (jantar)' },
]

function getPTTime() {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  })
  const parts = formatter.formatToParts(now)
  const get = (type) => parts.find(p => p.type === type)?.value ?? '0'
  return {
    weekday: get('weekday'),
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10),
    second: parseInt(get('second'), 10),
  }
}

// Devolve { isOpen, secsUntilChange }
function computeStatus() {
  const { weekday, hour, minute, second } = getPTTime()
  const time = hour * 60 + minute

  // Seg e Ter: encerrado. Calcular segundos até próxima abertura (qua 12h00)
  const isClosed = weekday === 'seg' || weekday === 'ter'

  // Intervalos abertos (em minutos desde meia-noite)
  const LUNCH_OPEN  = 12 * 60
  const LUNCH_CLOSE = 15 * 60
  const DIN_OPEN    = 19 * 60
  const DIN_CLOSE   = 23 * 60

  if (isClosed) {
    // Calcular quantos dias faltam para quarta + tempo até 12h00
    const dayMap = { 'seg': 0, 'ter': 1 }
    const dayIdx = dayMap[weekday] ?? 0
    const daysUntilWed = 2 - dayIdx // seg→2 dias, ter→1 dia
    const secsToMidnight = (24 * 60 - time) * 60 - second
    const secsFromMidnightToOpen = LUNCH_OPEN * 60
    const secsUntilChange = secsToMidnight + (daysUntilWed - 1) * 24 * 3600 + secsFromMidnightToOpen
    return { isOpen: false, secsUntilChange }
  }

  // Está em período de almoço aberto
  if (time >= LUNCH_OPEN && time < LUNCH_CLOSE) {
    const secsUntilChange = (LUNCH_CLOSE - time) * 60 - second
    return { isOpen: true, secsUntilChange }
  }

  // Entre almoço e jantar (encerrado temporariamente)
  if (time >= LUNCH_CLOSE && time < DIN_OPEN) {
    const secsUntilChange = (DIN_OPEN - time) * 60 - second
    return { isOpen: false, secsUntilChange }
  }

  // Período de jantar aberto
  if (time >= DIN_OPEN && time < DIN_CLOSE) {
    const secsUntilChange = (DIN_CLOSE - time) * 60 - second
    return { isOpen: true, secsUntilChange }
  }

  // Após jantar (encerrado até almoço de amanhã / depois de amanhã)
  const secsToMidnight = (24 * 60 - time) * 60 - second
  const secsFromMidnightToOpen = LUNCH_OPEN * 60
  // Se for sáb ou dom, amanhã ainda abre. Se for sex, amanhã é sáb, abre. Só seg/ter já tratados acima.
  return { isOpen: false, secsUntilChange: secsToMidnight + secsFromMidnightToOpen }
}

function formatCountdown(totalSecs) {
  const s = Math.max(0, totalSecs)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  if (h > 0) return `${h}h ${pad(m)}m ${pad(sec)}s`
  if (m > 0) return `${pad(m)}m ${pad(sec)}s`
  return `${pad(sec)}s`
}

function OpenBadge() {
  const [status, setStatus] = useState(() => computeStatus())
  const [countdown, setCountdown] = useState(status.secsUntilChange)

  useEffect(() => {
    const tick = () => {
      const s = computeStatus()
      setStatus(s)
      setCountdown(s.secsUntilChange)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const { isOpen } = status

  const color = isOpen ? '#22c55e' : '#ef4444'
  const bg    = isOpen ? 'rgba(34,197,94,0.08)'  : 'rgba(239,68,68,0.08)'
  const border = isOpen ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'

  return (
    <>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 14px 5px 8px',
        borderRadius: 100,
        background: bg,
        border: `1px solid ${border}`,
        width: 'fit-content',
      }}>
        {/* Dot pulsante */}
        <span style={{ position: 'relative', width: 8, height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{
            position: 'absolute',
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: color,
            animation: isOpen ? 'badge-ping 1.8s ease-out infinite' : 'none',
            opacity: 0.4,
          }} />
          <span style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
        </span>

        {/* Label estado */}
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', color }}>
          {isOpen ? 'Aberto agora' : 'Encerrado'}
        </span>

        {/* Divisor vertical */}
        <span style={{ width: 1, height: 12, background: isOpen ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)', flexShrink: 0 }} />

        {/* Ícone relógio */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.55 }}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
          <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Rótulo + countdown */}
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color, opacity: 0.75, fontWeight: 400, whiteSpace: 'nowrap' }}>
          {isOpen ? 'Fecha em' : 'Abre em'}
        </span>
        <span style={{
          fontFamily: '"JetBrains Mono", "Fira Mono", "Courier New", monospace',
          fontSize: 11,
          fontWeight: 700,
          color,
          letterSpacing: '0.04em',
          minWidth: 64,
        }}>
          {formatCountdown(countdown)}
        </span>
      </div>

      <style>{`
        @keyframes badge-ping {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </>
  )
}

export default function Location() {
  return (
    <div className="bg-white section-padding">
      <div className="container-site">
        <AnimatedSection>
          <SectionTitle
            microlabel="Onde estamos"
            title="Localização"
            centered
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 mt-14">
          <AnimatedSection direction="none">
            <div
              className="rounded-2xl overflow-hidden shadow-card"
              style={{ border: '1px solid rgba(205,152,46,0.15)' }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Guilhabreu,+Vila+do+Conde,+Portugal&output=embed"
                width="100%"
                height="480"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Quinta do Duque"
                className="h-[300px] md:h-[480px]"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2}>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={28} weight="duotone" className="text-gold-deep" />
                  <h3 className="font-display text-[22px] font-semibold text-stone-darkest">
                    Como Chegar
                  </h3>
                </div>
                <p className="font-sans text-[15px] text-stone-warm leading-[1.8] ml-[40px]">
                  Largo da Igreja, Guilhabreu
                  <br />
                  4480 Vila do Conde, Portugal
                </p>
                <a
                  href="https://www.google.com/maps/search/Largo+da+Igreja,+Guilhabreu,+Vila+do+Conde,+Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="button"
                  className="inline-flex items-center gap-1.5 ml-[40px] mt-2 font-sans text-[13px] font-semibold text-gold-deep cursor-none hover:text-gold-medium transition-colors"
                >
                  Abrir no Google Maps
                  <ArrowSquareOut size={14} weight="bold" />
                </a>
              </div>

              <div className="divider-gold" />

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={28} weight="duotone" className="text-gold-deep" />
                  <h3 className="font-display text-[22px] font-semibold text-stone-darkest">
                    Horário de Funcionamento
                  </h3>
                </div>

                <div className="ml-[40px] mb-3">
                  <OpenBadge />
                </div>

                <div className="ml-[40px] space-y-2">
                  {schedule.map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[140px_1fr] gap-2 font-sans text-[14px]"
                    >
                      <span
                        className={`font-semibold ${
                          item.closed
                            ? 'text-stone-mid/60'
                            : 'text-stone-darkest'
                        }`}
                      >
                        {item.day}
                      </span>
                      <span
                        className={
                          item.closed ? 'text-stone-mid/60' : 'text-stone-warm'
                        }
                      >
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider-gold" />

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Phone size={28} weight="duotone" className="text-gold-deep" />
                  <h3 className="font-display text-[22px] font-semibold text-stone-darkest">
                    Contactos
                  </h3>
                </div>

                <div className="ml-[40px] space-y-3">
                  <a
                    href="tel:+351961617183"
                    data-cursor="button"
                    className="block font-sans text-[15px] text-stone-warm cursor-none hover:text-gold-deep transition-colors"
                  >
                    +351 961 617 183
                  </a>

                  <a
                    href="mailto:reservas@quintaduduque.pt"
                    data-cursor="button"
                    className="block font-sans text-[15px] text-stone-warm cursor-none hover:text-gold-deep transition-colors"
                  >
                    reservas@quintaduduque.pt
                  </a>

                  <a
                    href="https://wa.me/351961617183"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-sans text-[14px] font-semibold cursor-none transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <WhatsappLogo size={20} weight="duotone" />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
