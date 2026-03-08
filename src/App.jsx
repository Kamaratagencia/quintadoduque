import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import CustomCursor from './components/CustomCursor'
import IntroLoader from './components/IntroLoader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Signature from './components/Signature'
import MenuSection from './components/MenuSection'
import Gallery from './components/Gallery'
import RealDishes from './components/RealDishes'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Footer from './components/Footer'
import MenuModal from './components/ui/MenuModal'
import ReservationModal from './components/ReservationModal'

export default function App() {
  const [isMenuModalOpen, setMenuModalOpen] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {!introComplete && (
          <IntroLoader key="intro" onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#100502',
            color: '#FFFFFF',
            border: '1px solid rgba(205,152,46,0.3)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
        }}
      />

      <Navbar onOpenReservation={() => setReservationOpen(true)} />

      <main className="w-full" style={{ overflowX: 'clip' }}>
        <section id="inicio">
          <Hero onOpenMenu={() => setMenuModalOpen(true)} onOpenReservation={() => setReservationOpen(true)} />
        </section>

        <section id="a-casa">
          <Signature />
        </section>

        <section id="menu">
          <MenuSection onOpenMenu={() => setMenuModalOpen(true)} />
        </section>

        <section id="galeria">
          <Gallery />
        </section>

        <section id="pratos-reais">
          <RealDishes />
        </section>

        <section id="avaliacoes">
          <Reviews />
        </section>

        <section id="localizacao">
          <Location />
        </section>

      </main>

      <Footer />

      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setMenuModalOpen(false)}
      />

      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </>
  )
}
