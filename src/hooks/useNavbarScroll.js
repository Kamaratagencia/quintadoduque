import { useState, useEffect, useRef, useCallback } from 'react'

const THRESHOLD = 60
const DIR_THRESHOLD = 8

export default function useNavbarScroll() {
  const [navState, setNavState] = useState('top')
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('up')
  const [scrollY, setScrollY] = useState(0)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const update = useCallback(() => {
    const current = window.scrollY

    setScrollY(current)
    setIsScrolled(current > THRESHOLD)

    if (current < THRESHOLD) {
      setNavState('top')
      setScrollDirection('up')
    } else {
      setNavState('visible')
      setScrollDirection('up')
    }

    lastScrollY.current = current
    ticking.current = false
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(update)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [update])

  return { navState, isScrolled, scrollDirection, scrollY }
}
