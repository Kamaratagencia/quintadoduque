# Documentação Completa da Galeria de Fotos — "Uma Cozinha com Alma"

## Visão Geral

A seção "Uma Cozinha com Alma" (id: `galeria`) é uma galeria de fotos interativa implementada com React, Framer Motion e Embla Carousel. Ela combina navegação horizontal por toque/arrasto, autoplay inteligente com animações de "respiração", transições suaves e uma interface responsiva que funciona perfeitamente em mobile e desktop.

---

## Estrutura de Dados

### SLIDES Array

```javascript
const SLIDES = [
  {
    id: 'jardim',
    image: fotojardim,
    icon: <Flower weight="duotone" />,
    label: 'Jardim',
    title: 'Um jardim que recebe com calma',
    description: 'Natureza, silêncio e luz suave — o começo perfeito para uma noite especial.',
  },
  // ... outros slides
]
```

Cada slide contém:
- `id`: Identificador único para navegação programática
- `image`: Import estático da imagem (otimizado pelo bundler)
- `icon`: Componente React do Phosphor Icons
- `label`: Texto curto para badge
- `title`: Título principal do slide
- `description`: Texto descritivo detalhado

---

## Sistema de Navegação — Embla Carousel

### Configuração Inicial

```javascript
const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,           // Navegação infinita
  align: 'start',       // Alinhamento dos slides à esquerda
  dragFree: false,      // Snap obrigatório aos slides
  skipSnaps: false,     // Não pular posições de snap
  duration: 30,         // Duração da animação de scroll (ms)
})
```

### Estados Gerenciados

- `selectedIndex`: Índice do slide atualmente visível/ativo
- `isUserInteracting`: Booleano que indica se o usuário está interagindo (drag/touch)
- `breatheIndex`: Índice do slide atualmente em animação de "respiração"
- `timerRef`: Referência ao timer do autoplay

---

## Sistema de Autoplay com Animação "Respiração"

### Fluxo do Autoplay

1. **Timer Principal (5 segundos)**: `AUTOPLAY_INTERVAL = 5000`
2. **Início da Respiração**: Após 5s, `setBreatheIndex(selectedIndex)`
3. **Animação de Respiração**: `BREATHE_DURATION = 0.25s` (250ms)
4. **Transição para Próximo**: `emblaApi.scrollNext()`

### Lógica de Interrupção

```javascript
emblaApi.on('pointerDown', () => {
  setIsUserInteracting(true)
  clearTimeout(timerRef.current)  // Pausa autoplay imediatamente
})
emblaApi.on('settle', () => {
  setIsUserInteracting(false)     // Retoma autoplay quando settle
})
```

O autoplay é **pausado** durante:
- Interação por toque/drag
- Navegação por botões/setas
- Clique nos dots de navegação

É **retomado** automaticamente quando o carousel para (`settle`).

---

## Animações Detalhadas

### 1. Animação de "Respiração" (Breathe Effect)

**Propósito**: Indicar visualmente que o slide está prestes a mudar.

```javascript
const getAnimateProps = () => {
  if (isBreathe) return { scale: 1.03, opacity: 0.7 }
  if (isActive) return { scale: 1, opacity: 1 }
  return { scale: 1, opacity: 1 }
}
```

- **Scale**: `1 → 1.03` (aumento sutil de 3%)
- **Opacity**: `1 → 0.7` (redução para criar efeito de "preparação")
- **Duração**: 250ms com `ease: 'easeIn'`

### 2. Animação de "Emergência" (Emerge Effect)

**Propósito**: Animação suave quando um slide se torna ativo.

```javascript
const EMERGE_EASE = [0.16, 1, 0.3, 1]  // Custom cubic-bezier

if (isActive) return { 
  scale: { duration: 0.5, ease: EMERGE_EASE, from: 0.97 }, 
  opacity: { duration: 0.4, from: 0.8 } 
}
```

- **Scale**: `0.97 → 1` (leve zoom-in)
- **Opacity**: `0.8 → 1` (fade-in suave)
- **Easing**: Curva customizada para movimento natural

### 3. Animação dos Dots de Navegação

```javascript
animate={{
  width: i === selectedIndex ? 20 : 6,  // Active: 20px, Inactive: 6px
}}
transition={{ type: 'spring', stiffness: 400, damping: 30 }}
```

- **Spring Animation**: Movimento orgânico e responsivo
- **Layout Animation**: Transição suave entre estados

---

## Componentes da Interface

### 1. Cabeçalho da Seção

```javascript
<AnimatedSection direction="none" threshold={0.2}>
  <span>Espaço & Ambiente</span>
  <GoldDivider width={48} centered />
  <h2>Viva a experiência</h2>
  <p>Conheça cada canto da nossa quinta.</p>
</AnimatedSection>
```

- **AnimatedSection**: Wrapper com animação de entrada por scroll
- **GoldDivider**: Linha decorativa dourada animada
- **Threshold 0.2**: Animação inicia quando 20% do elemento está visível

### 2. Container do Carousel

```javascript
<div ref={emblaRef} style={{ overflow: 'hidden' }}>
  <div style={{ display: 'flex' }}>
    {SLIDES.map((slide, i) => (
      <SlideCard key={slide.id} slide={slide} index={i} 
        isActive={i === selectedIndex} isBreathe={i === breatheIndex} />
    ))}
  </div>
</div>
```

- **overflow: 'hidden'**: Essencial para o funcionamento do carousel
- **display: 'flex'**: Layout horizontal dos slides

### 3. SlideCard Component

Estrutura de cada slide individual:

```javascript
<div style={{ flexShrink: 0, width: responsivo }}>
  <motion.div animate={getAnimateProps()} transition={getTransition()}>
    {/* Zona Imagem */}
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <img src={slide.image} alt={slide.label} loading={index === 0 ? 'eager' : 'lazy'} />
      <div style={{ background: 'gradient' }} />  {/* Overlay */}
    </div>
    {/* Zona Conteúdo */}
    <div style={{ backgroundColor: 'rgba(16,5,2,0.97)' }}>
      {/* Badge + Título + Separador + Descrição */}
    </div>
  </motion.div>
</div>
```

#### Responsividade dos Cards

- **Mobile**: `w-[78vw] mr-4` (78% da viewport width)
- **Tablet**: `w-[60vw] sm:mr-5` (60% da viewport width)
- **Desktop**: `lg:w-[420px] lg:mr-6 xl:w-[480px]` (fixo em pixels)

#### Otimização de Imagens

```javascript
loading={index === 0 ? 'eager' : 'lazy'}
```

- **Primeiro slide**: `eager` (carrega imediatamente)
- **Demais slides**: `lazy` (carrega quando aproximam da viewport)

---

## Sistema de Navegação

### 1. Dots Indicadores

```javascript
{SLIDES.map((_, i) => (
  <button onClick={() => emblaApi?.scrollTo(i)}>
    <motion.div
      layout
      animate={{ width: i === selectedIndex ? 20 : 6 }}
      style={{
        height: 6,
        backgroundColor: i === selectedIndex ? '#CD982E' : 'rgba(210,175,145,0.30)',
      }}
    />
  </button>
))}
```

- **Layout Animation**: Transição automática de tamanho
- **Click Navigation**: Salto direto para qualquer slide
- **Visual Feedback**: Cor e tamanho diferentes para slide ativo

### 2. Setas de Navegação (Desktop Only)

```javascript
<motion.button
  onClick={() => emblaApi?.scrollPrev()}
  whileHover={{ backgroundColor: 'rgba(205,152,46,0.15)', scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="hidden md:flex"
>
  <ArrowLeft size={18} weight="bold" color="#DBBD7E" />
</motion.button>
```

- **Hidden on Mobile**: `hidden md:flex`
- **Hover Effects**: Mudança de cor e escala
- **Tap Animation**: Feedback tátil ao clicar

### 3. Barra de Progresso do Timer

```javascript
<motion.div
  key={selectedIndex}
  initial={{ width: '0%' }}
  animate={{ width: '100%' }}
  transition={{ duration: 5, ease: 'linear' }}
  style={{
    background: 'linear-gradient(90deg, #CD982E, #DBBD7E)',
  }}
/>
```

- **Key Prop**: Reinicia animação a cada mudança de slide
- **Linear Progress**: Progresso constante e previsível
- **Visual Timer**: Indica quanto tempo falta para próxima transição

---

## Estados e Eventos

### Event Listeners do Embla

```javascript
emblaApi.on('select', onSelect)        // Mudança de slide
emblaApi.on('pointerDown', handleDown) // Início de interação
emblaApi.on('settle', handleSettle)    // Fim da animação
```

### Gerenciamento de Estados

```javascript
const onSelect = useCallback(() => {
  if (!emblaApi) return
  setSelectedIndex(emblaApi.selectedScrollSnap())
  setBreatheIndex(null)  // Reset respiração ao mudar manualmente
}, [emblaApi])
```

---

## Performance e Otimizações

### 1. useCallback para Funções

```javascript
const onSelect = useCallback(() => { ... }, [emblaApi])
```

Evita recriação de funções a cada render.

### 2. Timer Management

```javascript
return () => clearTimeout(timerRef.current)
```

Cleanup adequado para evitar memory leaks.

### 3. Lazy Loading de Imagens

```javascript
loading={index === 0 ? 'eager' : 'lazy'}
```

Carrega apenas o necessário, melhorando performance inicial.

### 4. willChange Optimization

```javascript
style={{ willChange: 'transform' }}
```

Otimização para animações de transform.

---

## Design System

### Cores

- **Background Principal**: `#100502` (stone-darkest)
- **Dourado Principal**: `#CD982E`
- **Dourado Claro**: `#DBBD7E`
- **Beige Texto**: `rgba(219,189,126,0.70)`
- **Overlay Gradiente**: `linear-gradient(to bottom, rgba(16,5,2,0) 50%, rgba(16,5,2,0.75) 100%)`

### Tipografia

- **Títulos**: `"Playfair Display", Georgia, serif`
- **Textos**: `"Inter", sans-serif`
- **Micro-labels**: `fontSize: 11`, `letterSpacing: '0.2em'`, `textTransform: 'uppercase'`

### Espaçamentos

- **Cards**: `mr-4 sm:mr-5 lg:mr-6 xl:mr-7`
- **Padding Interno**: `p-5 lg:p-6`
- **Margens da Seção**: `pt-56 lg:pt-[80px]`, `pb-8 lg:pb-12`

---

## Comportamento Responsivo

### Mobile (< 768px)

- Cards: 78vw de largura
- Navegação: Touch/swipe + dots
- Setas: Ocultas
- Textos: Tamanhos reduzidos

### Tablet (768px - 1024px)

- Cards: 60vw de largura
- Navegação: Touch + dots
- Setas: Ocultas
- Layout intermediário

### Desktop (> 1024px)

- Cards: 420px (lg) / 480px (xl) fixos
- Navegação: Mouse + setas + dots
- Layout centralizado com max-width
- Hover states ativos

---

## Acessibilidade

### Atributos

```javascript
<img src={slide.image} alt={slide.label} loading={index === 0 ? 'eager' : 'lazy'} />
<button data-cursor="button" aria-label={`Navegar para ${slide.label}`}>
```

### Navegação por Teclado

- Embla Carousel suporta navegação por setas do teclado nativamente
- Botões são focusáveis e operáveis por teclado

### Cursor Customizado

```javascript
data-cursor="image"  // Para cards clicáveis
data-cursor="button" // Para botões de navegação
```

---

## Debugging e Troubleshooting

### Problemas Comuns

1. **Autoplay não funciona**: Verificar se `isUserInteracting` está `false`
2. **Animações travadas**: Confirmar `willChange: 'transform'` nas imagens
3. **Layout quebrado**: Verificar `overflow: 'hidden'` no container do carousel
4. **Performance**: Monitorar re-renders com React DevTools

### Logs Úteis

```javascript
console.log('selectedIndex:', selectedIndex)
console.log('isUserInteracting:', isUserInteracting)
console.log('breatheIndex:', breatheIndex)
console.log('emblaApi:', emblaApi)
```

---

## Extensões Futuras

### Possíveis Melhorias

1. **Lightbox Modal**: Abrir imagem em tela cheia ao clicar
2. **Gestos Avançados**: Pinch-to-zoom em mobile
3. **Thumbnails**: Miniaturas para navegação rápida
4. **Autoplay Control**: Play/pause button
5. **Keyboard Shortcuts**: Setas para navegação global

### Implementação Sugerida - Lightbox

```javascript
const [lightboxOpen, setLightboxOpen] = useState(false)
const [lightboxImage, setLightboxImage] = useState(null)

const openLightbox = (image) => {
  setLightboxImage(image)
  setLightboxOpen(true)
}

// No SlideCard
onClick={() => openLightbox(slide.image)}
```

---

## Conclusão

A galeria "Uma Cozinha com Alma" é um componente sofisticado que combina:

- **Navegação Intuitiva**: Touch, mouse, e automática
- **Animações Fluidas**: Respiração, emergência, e transições
- **Performance Otimizada**: Lazy loading, callbacks, e cleanup
- **Design Responsivo**: Experiência consistente em todos dispositivos
- **Acessibilidade**: Suporte a teclado e leitores de tela

O sistema foi projetado para ser manutenível, extensível e proporcionar uma experiência visual premium que reflete a qualidade do restaurante Quinta do Duque.
