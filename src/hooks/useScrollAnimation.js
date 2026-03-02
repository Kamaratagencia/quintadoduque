import { useInView } from 'react-intersection-observer'

export default function useScrollAnimation(threshold = 0.15) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  })

  return { ref, inView }
}
