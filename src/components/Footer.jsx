import { motion } from 'framer-motion'
import {
  InstagramLogo,
  FacebookLogo,
  WhatsappLogo,
  MapPin,
  Phone,
  Envelope,
  Clock,
  Star,
} from '@phosphor-icons/react'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'A Casa', href: '#a-casa' },
  { label: 'Menu', href: '#menu' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Avaliacoes', href: '#avaliacoes' },
  { label: 'Localizacao', href: '#localizacao' },
  { label: 'Reservas', href: '#reservas' },
]

const socials = [
  { icon: InstagramLogo, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FacebookLogo, href: 'https://facebook.com', label: 'Facebook' },
  { icon: WhatsappLogo, href: 'https://wa.me/351252000000', label: 'WhatsApp' },
]

const contacts = [
  {
    icon: MapPin,
    text: 'Largo da Igreja, Guilhabreu, 4480 Vila do Conde',
    href: 'https://www.google.com/maps/search/Largo+da+Igreja,+Guilhabreu,+Vila+do+Conde,+Portugal',
  },
  { icon: Phone, text: '+351 252 000 000', href: 'tel:+351252000000' },
  {
    icon: Envelope,
    text: 'reservas@quintaduduque.pt',
    href: 'mailto:reservas@quintaduduque.pt',
  },
  { icon: Clock, text: 'Seg-Dom: 12h00-23h00', href: null },
]

function scrollToSection(href) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{
        backgroundColor: '#0A0200',
        borderTop: '1px solid rgba(205,152,46,0.15)',
      }}
    >
      <div className="container-site pt-20 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] gap-12">
          <div>
            <img
              src="/src/assets/logo.png"
              alt="Quinta do Duque"
              style={{ height: '68px', width: 'auto', objectFit: 'contain' }}
              className="brightness-90"
            />

            <p className="font-display italic text-[16px] text-gold-light/70 mt-4">
              Tradicao portuguesa. Momentos unicos.
            </p>

            <p className="font-sans text-[14px] text-beige/50 leading-[1.7] mt-3 max-w-[260px]">
              Uma quinta com historia, uma cozinha com alma,
              um espaco que ficara para sempre na sua memoria.
            </p>

            <div className="flex items-center gap-3 mt-6">
              {socials.map((social, i) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="button"
                    aria-label={social.label}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: 'rgba(205,152,46,0.2)',
                      borderColor: '#CD982E',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(205,152,46,0.15)',
                    }}
                  >
                    <Icon size={20} weight="duotone" className="text-gold-light" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.15em] text-gold-deep font-medium mb-6">
              Navegacao
            </h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  data-cursor="button"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  whileHover={{ x: 4, color: '#D2A956' }}
                  transition={{ duration: 0.2 }}
                  className="font-sans text-[14px] text-beige/70 cursor-none"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.15em] text-gold-deep font-medium mb-6">
              Contactos
            </h4>
            <div className="space-y-4">
              {contacts.map((item, i) => {
                const Icon = item.icon
                const content = (
                  <div className="flex items-start gap-2.5">
                    <Icon
                      size={16}
                      weight="duotone"
                      className="text-gold-deep flex-shrink-0 mt-0.5"
                    />
                    <span className="font-sans text-[14px] text-beige/70 leading-[1.6]">
                      {item.text}
                    </span>
                  </div>
                )

                if (item.href) {
                  return (
                    <a
                      key={i}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={
                        item.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      data-cursor="button"
                      className="block cursor-none hover:text-gold-medium transition-colors"
                    >
                      {content}
                    </a>
                  )
                }

                return <div key={i}>{content}</div>
              })}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.15em] text-gold-deep font-medium mb-6">
              Reserve ja
            </h4>

            <p className="font-sans text-[14px] text-beige/60 leading-[1.7] mb-5">
              Reserve a sua mesa de forma rapida e simples,
              diretamente no nosso WhatsApp ou formulario.
            </p>

            <a
              href="https://wa.me/351252000000"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="button"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg text-white font-sans text-[14px] font-semibold cursor-none transition-all duration-300 hover:brightness-110"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsappLogo size={18} weight="bold" />
              WhatsApp
            </a>

            <button
              data-cursor="button"
              onClick={() => scrollToSection('#reservas')}
              className="btn-outline w-full justify-center mt-2 py-3 text-[13px] cursor-none"
            >
              Formulario Online
            </button>

            <div
              className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-full"
              style={{
                background: 'rgba(205,152,46,0.1)',
                border: '1px solid rgba(205,152,46,0.2)',
              }}
            >
              <Star size={12} weight="fill" className="text-gold-deep" />
              <span className="font-sans text-[13px] text-gold-medium">
                9.1 &middot; TheFork
              </span>
            </div>
          </div>
        </div>

        <div
          className="mt-16 pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(205,152,46,0.1)' }}
        >
          <span className="font-sans text-[13px] text-beige/40">
            &copy; 2025 Quinta do Duque. Todos os direitos reservados.
          </span>

          <span className="font-sans text-[13px] text-beige/30 hidden md:block">
            Guilhabreu &middot; Vila do Conde &middot; Portugal
          </span>

          <div className="flex items-center gap-3">
            <a
              href="#"
              data-cursor="button"
              className="font-sans text-[13px] text-beige/40 cursor-none hover:text-gold-medium transition-colors"
            >
              Politica de Privacidade
            </a>
            <span className="text-gold-deep/30">|</span>
            <a
              href="#"
              data-cursor="button"
              className="font-sans text-[13px] text-beige/40 cursor-none hover:text-gold-medium transition-colors"
            >
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
