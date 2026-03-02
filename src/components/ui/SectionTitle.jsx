import GoldDivider from './GoldDivider'

export default function SectionTitle({
  microlabel,
  title,
  highlightWord,
  subtitle,
  centered = false,
  light = false,
}) {
  const renderTitle = () => {
    if (!highlightWord) return title

    const parts = title.split(highlightWord)
    return (
      <>
        {parts[0]}
        <span className="gold-text">{highlightWord}</span>
        {parts[1] || ''}
      </>
    )
  }

  return (
    <div className={centered ? 'text-center' : ''}>
      {microlabel && (
        <span
          className={`font-sans text-[11px] uppercase tracking-[0.2em] font-medium block mb-2 ${
            light ? 'text-gold-light/60' : 'text-gold-deep'
          }`}
        >
          {microlabel}
        </span>
      )}

      <GoldDivider width={40} centered={centered} />

      <h2
        className={`font-display font-bold leading-[1.1] mt-4 text-[32px] md:text-[40px] lg:text-[52px] ${
          light ? 'text-white' : 'text-stone-darkest'
        }`}
      >
        {renderTitle()}
      </h2>

      {subtitle && (
        <p
          className={`font-sans text-[17px] leading-[1.7] mt-5 max-w-[560px] ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-beige' : 'text-caramel'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
