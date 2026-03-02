import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const directionVariants = {
  up: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

export default function AnimatedSection({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.15,
}) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  })

  const variants = directionVariants[direction] || directionVariants.up

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration: 0.84,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
