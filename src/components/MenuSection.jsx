import { BookOpenText } from '@phosphor-icons/react'
import AnimatedSection from './ui/AnimatedSection'
import SectionTitle from './ui/SectionTitle'

export default function MenuSection({ onOpenMenu }) {
  return (
    <div className="bg-stone-darkest section-padding relative overflow-hidden">
      <div
        className="absolute -right-[200px] top-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(205,152,46,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container-site relative z-10">
        <AnimatedSection>
          <SectionTitle
            microlabel="O que servimos"
            title="Uma cozinha com alma"
            highlightWord="alma"
            subtitle="Cada prato conta uma historia. Cada ingrediente tem origem conhecida. Cada refeicao e uma celebracao da cozinha portuguesa."
            centered
            light
          />
        </AnimatedSection>

        
        <AnimatedSection delay={0.3} className="flex justify-center mt-14">
          <button
            data-cursor="button"
            onClick={onOpenMenu}
            className="btn-outline border-gold-light text-gold-light hover:bg-gold-deep hover:border-gold-deep hover:text-white px-12 py-4 cursor-none"
          >
            <BookOpenText size={20} weight="bold" />
            Consultar Menu Completo
          </button>
        </AnimatedSection>
      </div>
    </div>
  )
}
