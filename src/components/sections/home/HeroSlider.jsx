'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, EffectFade, Keyboard } from 'swiper/modules'
import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import Button from '@/components/ui/Button'
import { site } from '@/config/site'
import HeroAurora from './HeroAurora'
import HeroVisual from './HeroVisual'
import styles from './HeroSlider.module.css'

const DELAY = 7000
const SPEED = 1000

// Words animate individually; screen readers get the plain sentence once.
// Trailing punctuation sits in its own span so it can be tucked against the
// word (Plus Jakarta's heavy full stop has a wide left side bearing).
const SlideTitle = ({ as: Tag, text }) => {
  const words = text.split(' ')
  return (
    <Tag className={styles.title}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => {
          const [, base, punct] = word.match(/^(.*?)([.,!?]*)$/)
          return (
            <span key={`${word}-${index}`}>
              <span className={styles.word} data-word={base} style={{ '--i': index }}>
                {base}
                {punct ? <span className={styles.punct}>{punct}</span> : null}
              </span>
              {index < words.length - 1 ? ' ' : null}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}

const HeroSlider = ({ slides = [] }) => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const swiperRef = useRef(null)
  const fillRef = useRef(null)
  const [active, setActive] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [keyboardFocus, setKeyboardFocus] = useState(false)

  const canAutoplay = !reduceMotion && slides.length > 1
  // Mouse hover doesn't pause; keyboard focus inside the hero does (accessibility)
  const shouldPlay = canAutoplay && !userPaused && inView && pageVisible && !keyboardFocus
  // Looping effects (title shine, floating cards) stop when nobody can see them
  const loopsRunning = !reduceMotion && !userPaused && inView && pageVisible

  // Pause everything while the hero is scrolled out of view or the tab is hidden
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(node)
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay
    if (!autoplay || !canAutoplay) return
    if (shouldPlay) {
      if (autoplay.paused) autoplay.resume()
      else if (!autoplay.running) autoplay.start()
    } else if (autoplay.running && !autoplay.paused) {
      autoplay.pause()
    }
  }, [shouldPlay, canAutoplay])

  const onTimeLeft = useCallback((_swiper, _timeLeft, progress) => {
    // Written straight to the element: no React render per animation frame
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${1 - progress})`
  }, [])

  const goTo = (index) => swiperRef.current?.slideTo(index)

  const onFocusIn = (event) => {
    if (event.target.matches?.(':focus-visible')) setKeyboardFocus(true)
  }
  const onFocusOut = (event) => {
    if (!sectionRef.current?.contains(event.relatedTarget)) setKeyboardFocus(false)
  }

  if (!slides.length) return null

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Teecoms highlights"
      data-loops={loopsRunning ? 'running' : 'paused'}
      data-accent={slides[active]?.accent || 'brand'}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <HeroAurora visual={slides[active]?.visual} />

      <Swiper
        className={styles.swiper}
        modules={[Autoplay, EffectFade, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reduceMotion ? 300 : SPEED}
        rewind
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={canAutoplay ? { delay: DELAY, disableOnInteraction: false } : false}
        a11y={{
          enabled: true,
          slideRole: 'group',
          slideLabelMessage: '{{index}} of {{slidesLength}}',
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => setActive(swiper.activeIndex)}
        onAutoplayTimeLeft={onTimeLeft}
      >
        {slides.map((slide, index) => {
          const isActive = index === active
          return (
            <SwiperSlide key={slide.id} className={styles.slide}>
              <div
                className={styles.frame}
                data-active={isActive}
                data-visual={slide.visual}
                data-accent={slide.accent || 'brand'}
              >
                <div className={`container ${styles.inner}`} inert={!isActive}>
                  <div className={styles.copy}>
                    <p className={styles.eyebrow}>{slide.eyebrow}</p>
                    <SlideTitle as={index === 0 ? 'h1' : 'h2'} text={slide.title} />
                    <p className={styles.description}>{slide.description}</p>
                    <div className={styles.actions}>
                      <Button
                        href={slide.primary.href}
                        variant={slide.accent === 'di' ? 'di' : 'primary'}
                        shine
                      >
                        {slide.primary.label}
                      </Button>
                      <Button
                        href={slide.id === 'digitalinvoice' ? (site.digitalInvoiceDemoUrl || slide.secondary.href) : slide.secondary.href}
                        variant="glass"
                        {...(slide.id === 'digitalinvoice' && site.digitalInvoiceDemoUrl
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {slide.secondary.label}
                      </Button>
                    </div>
                  </div>

                  <div className={styles.visual} aria-hidden="true" data-parallax>
                    <HeroVisual type={slide.visual} active={isActive} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      <div className={`container ${styles.controls}`}>
        <div className={styles.tabs}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={styles.tab}
              data-active={index === active}
              aria-current={index === active ? 'true' : undefined}
              aria-label={`Show slide ${index + 1}: ${slide.tab}`}
              onClick={() => goTo(index)}
            >
              <span className={styles.tabLabel}>{slide.tab}</span>
              <span className={styles.track}>
                <span
                  ref={index === active ? fillRef : undefined}
                  className={styles.fill}
                  data-static={!canAutoplay}
                />
              </span>
            </button>
          ))}
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.iconButton} onClick={() => swiperRef.current?.slidePrev()}>
            <ChevronLeft size={18} aria-hidden="true" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button type="button" className={styles.iconButton} onClick={() => swiperRef.current?.slideNext()}>
            <ChevronRight size={18} aria-hidden="true" />
            <span className="sr-only">Next slide</span>
          </button>
          {canAutoplay ? (
            <button
              type="button"
              className={styles.iconButton}
              aria-pressed={userPaused}
              onClick={() => setUserPaused((value) => !value)}
            >
              {userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              <span className="sr-only">{userPaused ? 'Play slideshow' : 'Pause slideshow'}</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
