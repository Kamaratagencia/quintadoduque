import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  WhatsappLogo,
  Phone,
  CalendarCheck,
  CircleNotch,
  CheckCircle,
} from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import SectionTitle from './ui/SectionTitle'

const hoursOptions = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
]

const today = new Date().toISOString().split('T')[0]

const reservationSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatorio (min. 2 caracteres)').max(60),
  email: z.string().email('Email invalido'),
  telefone: z
    .string()
    .min(9, 'Telefone invalido (min. 9 digitos)')
    .max(15, 'Telefone invalido (max. 15 digitos)'),
  data: z.string().min(1, 'Selecione uma data').refine(
    (val) => val >= today,
    'A data nao pode ser no passado'
  ),
  hora: z.string().min(1, 'Selecione uma hora'),
  pessoas: z.coerce
    .number()
    .min(1, 'Minimo 1 pessoa')
    .max(20, 'Maximo 20 pessoas'),
  mensagem: z.string().max(500).optional(),
})

const inputBaseClass =
  'w-full font-sans text-[15px] text-white placeholder:text-beige/40 px-4 py-3.5 rounded-lg border outline-none transition-all duration-200 cursor-none'
const inputNormalClass =
  'bg-white/[0.06] border-gold-light/20 focus:border-gold-deep focus:shadow-[0_0_0_3px_rgba(205,152,46,0.15)]'
const inputErrorClass =
  'bg-red-500/[0.05] border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'

export default function Reservations() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      data: '',
      hora: '',
      pessoas: '',
      mensagem: '',
    },
  })

  const onSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)

    toast.success('Reserva solicitada! Entraremos em contacto brevemente.', {
      duration: 5000,
      style: {
        background: '#100502',
        color: '#FFFFFF',
        border: '1px solid rgba(205,152,46,0.3)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#CD982E',
        secondary: '#FFFFFF',
      },
    })

    setTimeout(() => {
      setIsSuccess(false)
      reset()
    }, 3000)
  }

  function FieldError({ error }) {
    return (
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block font-sans text-[12px] text-red-500 mt-1 overflow-hidden"
          >
            {error.message}
          </motion.span>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div className="bg-dark-gradient section-padding relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[45%] h-full hidden lg:block">
        <img
          src="https://placehold.co/1920x1080/100502/D2A956?text=Quinta+do+Duque"
          alt=""
          className="w-full h-full object-cover opacity-[0.15]"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #100502 0%, transparent 100%)',
          }}
        />
      </div>

      <div className="container-site relative z-10">
        <div className="max-w-[600px]">
          <AnimatedSection>
            <SectionTitle
              microlabel="Reserve a sua mesa"
              title="Uma experiencia que comeca aqui"
              light
            />
            <p className="font-sans text-[16px] text-beige mt-4 leading-[1.7]">
              Faca a sua reserva online ou entre em contacto diretamente connosco.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-12">
              <a
                href="https://wa.me/351961617183"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="button"
                className="flex items-center gap-3 px-7 py-4 rounded-xl text-white font-sans cursor-none transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                style={{ backgroundColor: '#25D366' }}
              >
                <WhatsappLogo size={24} weight="duotone" />
                <div>
                  <span className="block font-semibold text-[15px]">WhatsApp</span>
                  <span className="block text-[12px] text-white/70">
                    Resposta imediata
                  </span>
                </div>
              </a>

              <a
                href="tel:+351961617183"
                data-cursor="button"
                className="flex items-center gap-3 px-7 py-4 rounded-xl cursor-none transition-all duration-300 glass-card hover:border-gold-deep/40"
              >
                <Phone size={24} weight="duotone" className="text-gold-medium" />
                <div>
                  <span className="block font-sans font-semibold text-[15px] text-white">
                    +351 961 617 183
                  </span>
                  <span className="block font-sans text-[12px] text-beige/60">
                    Ligue diretamente
                  </span>
                </div>
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="O seu nome"
                    {...register('nome')}
                    className={`${inputBaseClass} ${
                      errors.nome ? inputErrorClass : inputNormalClass
                    }`}
                  />
                  <FieldError error={errors.nome} />
                </div>

                <div>
                  <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@exemplo.pt"
                    {...register('email')}
                    className={`${inputBaseClass} ${
                      errors.email ? inputErrorClass : inputNormalClass
                    }`}
                  />
                  <FieldError error={errors.email} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="+351 000 000 000"
                    {...register('telefone')}
                    className={`${inputBaseClass} ${
                      errors.telefone ? inputErrorClass : inputNormalClass
                    }`}
                  />
                  <FieldError error={errors.telefone} />
                </div>

                <div>
                  <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    min={today}
                    {...register('data')}
                    className={`${inputBaseClass} ${
                      errors.data ? inputErrorClass : inputNormalClass
                    }`}
                  />
                  <FieldError error={errors.data} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                    Hora
                  </label>
                  <select
                    {...register('hora')}
                    className={`${inputBaseClass} ${
                      errors.hora ? inputErrorClass : inputNormalClass
                    }`}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {hoursOptions.map((h) => (
                      <option key={h} value={h} className="bg-stone-darkest text-white">
                        {h}
                      </option>
                    ))}
                  </select>
                  <FieldError error={errors.hora} />
                </div>

                <div>
                  <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                    Pessoas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    placeholder="2"
                    {...register('pessoas')}
                    className={`${inputBaseClass} ${
                      errors.pessoas ? inputErrorClass : inputNormalClass
                    }`}
                  />
                  <FieldError error={errors.pessoas} />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-gold-light/80 mb-2">
                  Mensagem (opcional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Pedidos especiais, alergias, celebracoes..."
                  {...register('mensagem')}
                  className={`${inputBaseClass} ${
                    errors.mensagem ? inputErrorClass : inputNormalClass
                  } resize-none`}
                />
                <FieldError error={errors.mensagem} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                data-cursor="button"
                className="btn-primary w-full justify-center py-[18px] cursor-none disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <CircleNotch
                      size={20}
                      weight="bold"
                      className="animate-spin"
                    />
                    A enviar...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle
                      size={20}
                      weight="duotone"
                      className="text-green-400"
                    />
                    Reserva Enviada
                  </>
                ) : (
                  <>
                    <CalendarCheck size={20} weight="bold" />
                    Confirmar Reserva
                  </>
                )}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
