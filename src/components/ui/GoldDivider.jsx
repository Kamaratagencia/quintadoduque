import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function GoldDivider({ width = 60, centered = false, className = '' }) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        width: `${width}px`,
        height: '2px',
        background: 'linear-gradient(90deg, #CD982E, #DBBD7E, #CD982E)',
        transformOrigin: centered ? 'center' : 'left',
        margin: centered ? '16px auto' : '16px 0',
      }}
      className={className}
    />
  )
}
