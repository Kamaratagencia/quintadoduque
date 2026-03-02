import { useState, useEffect } from 'react'
import { MapPin, Clock, Phone, Envelope, ArrowSquareOut, WhatsappLogo } from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import SectionTitle from './ui/SectionTitle'

const schedule = [
  { day: 'Segunda a Sexta', hours: '12h00 - 15h00 | 19h00 - 22h30' },
  { day: 'Sabado', hours: '12h00 - 15h30 | 19h00 - 23h00' },
  { day: 'Domingo', hours: '12h00 - 16h00 | Encerrado ao jantar' },
  { day: 'Encerrado', hours: 'Terca-feira', closed: true },
]

function OpenBadge() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date()
      const day = now.getDay()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const time = hours * 60 + minutes

      if (day === 2) {
        setIsOpen(false)
        return
      }

      const lunchStart = 12 * 60
      const lunchEndWeekday = 15 * 60
      const lunchEndSat = 15 * 60 + 30
      const lunchEndSun = 16 * 60

      const dinnerStart = 19 * 60
      const dinnerEndWeekday = 22 * 60 + 30
      const dinnerEndSat = 23 * 60

      let open = false

      if (day === 0) {
        open = time >= lunchStart && time <= lunchEndSun
      } else if (day === 6) {
        open =
          (time >= lunchStart && time <= lunchEndSat) ||
          (time >= dinnerStart && time <= dinnerEndSat)
      } else if (day >= 1 && day <= 5) {
        open =
          (time >= lunchStart && time <= lunchEndWeekday) ||
          (time >= dinnerStart && time <= dinnerEndWeekday)
      }

      setIsOpen(open)
    }

    checkOpen()
    const interval = setInterval(checkOpen, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-sans font-semibold ${
        isOpen
          ? 'bg-green-500/15 text-green-500'
          : 'bg-red-500/15 text-red-500'
      }`}
    >
      <span
        className={`w-[6px] h-[6px] rounded-full ${
          isOpen ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      {isOpen ? 'Aberto Agora' : 'Encerrado'}
    </span>
  )
}

export default function Location() {
  return (
    <div className="bg-white section-padding">
      <div className="container-site">
        <AnimatedSection>
          <SectionTitle
            microlabel="Onde estamos"
            title="Localizacao"
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
                    Horario de Funcionamento
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
                    href="tel:+351252000000"
                    data-cursor="button"
                    className="block font-sans text-[15px] text-stone-warm cursor-none hover:text-gold-deep transition-colors"
                  >
                    +351 252 000 000
                  </a>

                  <a
                    href="mailto:reservas@quintaduduque.pt"
                    data-cursor="button"
                    className="block font-sans text-[15px] text-stone-warm cursor-none hover:text-gold-deep transition-colors"
                  >
                    reservas@quintaduduque.pt
                  </a>

                  <a
                    href="https://wa.me/351252000000"
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
