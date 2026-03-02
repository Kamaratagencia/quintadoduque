import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false)
  const [hoverType, setHoverType] = useState(null)
  const [isClicking, setIsClicking] = useState(false)

  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)

  const dotX = useSpring(cursorX, { stiffness: 800, damping: 28 })
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 28 })

  const ringX = useSpring(cursorX, { stiffness: 120, damping: 18 })
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 18 })

  const onMouseMove = useCallback(
    (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    },
    [cursorX, cursorY]
  )

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    setIsTouch(isTouchDevice)
    if (isTouchDevice) return

    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  useEffect(() => {
    if (isTouch) return

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isTouch])

  useEffect(() => {
    if (isTouch) return

    const buttons = document.querySelectorAll('[data-cursor="button"], a, button')
    const images = document.querySelectorAll('[data-cursor="image"]')

    const enterButton = () => setHoverType('button')
    const enterImage = () => setHoverType('image')
    const leave = () => setHoverType(null)

    buttons.forEach((el) => {
      el.addEventListener('mouseenter', enterButton)
      el.addEventListener('mouseleave', leave)
    })

    images.forEach((el) => {
      el.addEventListener('mouseenter', enterImage)
      el.addEventListener('mouseleave', leave)
    })

    const observer = new MutationObserver(() => {
      const newButtons = document.querySelectorAll('[data-cursor="button"], a, button')
      const newImages = document.querySelectorAll('[data-cursor="image"]')

      newButtons.forEach((el) => {
        el.addEventListener('mouseenter', enterButton)
        el.addEventListener('mouseleave', leave)
      })
      newImages.forEach((el) => {
        el.addEventListener('mouseenter', enterImage)
        el.addEventListener('mouseleave', leave)
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      buttons.forEach((el) => {
        el.removeEventListener('mouseenter', enterButton)
        el.removeEventListener('mouseleave', leave)
      })
      images.forEach((el) => {
        el.removeEventListener('mouseenter', enterImage)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [isTouch])

  if (isTouch) return null

  const isButton = hoverType === 'button'
  const isImage = hoverType === 'image'

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isButton || isImage ? 0 : 1,
            opacity: isButton || isImage ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="w-[6px] h-[6px] rounded-full bg-gold-deep"
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isButton ? 2.5 : isImage ? 3 : 1,
            borderColor: isButton
              ? 'rgba(205,152,46,0.3)'
              : 'rgba(205,152,46,0.5)',
            backgroundColor: isImage
              ? 'rgba(205,152,46,0.15)'
              : 'transparent',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="w-[32px] h-[32px] rounded-full border-[1.5px] border-gold-deep/50 flex items-center justify-center"
        >
          {isImage && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[9px] font-display italic text-gold-deep whitespace-nowrap"
            >
              Ver
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
