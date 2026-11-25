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
import HeroVisual, { HeroFlow } from './HeroVisual'
import styles from './HeroSlider.module.css'

const DELAY = 9500
const SPEED = 900

// Text is deliberately taken verbatim from src/content/home.content.js.
const SlideTitle = ({ as: Tag, text }) => (
  <Tag className={styles.title}>{text}</Tag>
)

export default function HeroSlider({ slides = [] }) {
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
  const shouldPlay = canAutoplay && !userPaused && inView && pageVisible && !keyboardFocus
  const loopsRunning = shouldPlay && !reduceMotion

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.12 })
      : null
    observer?.observe(node)
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay
    if (!autoplay || !canAutoplay) return
    if (shouldPlay) {
      if (autoplay.paused) autoplay.resume()
      else if (!autoplay.running) autoplay.start()
    } else if (autoplay.running && !autoplay.paused) autoplay.pause()
  }, [shouldPlay, canAutoplay])

  const onTimeLeft = useCallback((_swiper, _timeLeft, progress) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${1 - progress})`
  }, [])
  const goTo = (index) => swiperRef.current?.slideTo(index)

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
      onFocus={(event) => { if (event.target.matches?.(':focus-visible')) setKeyboardFocus(true) }}
      onBlur={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget)) setKeyboardFocus(false)
      }}
    >
      <div className={styles.ambient} aria-hidden="true" />
      <Swiper
        className={styles.swiper}
        modules={[Autoplay, EffectFade, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reduceMotion ? 0 : SPEED}
        rewind
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={canAutoplay ? { delay: DELAY, disableOnInteraction: false } : false}
        a11y={{ enabled: true, slideRole: 'group', slideLabelMessage: '{{index}} of {{slidesLength}}' }}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={(swiper) => setActive(swiper.activeIndex)}
        onAutoplayTimeLeft={onTimeLeft}
      >
        {slides.map((slide, index) => {
          const isActive = index === active
          const demoLink = slide.id === 'digitalinvoice' && site.digitalInvoiceDemoUrl
          return (
            <SwiperSlide key={slide.id} className={styles.slide}>
              <div className={styles.frame} data-active={isActive} data-accent={slide.accent || 'brand'}>
                <div className={styles.inner} inert={!isActive}>
                  <div className={styles.copy}>
                    <p className={styles.eyebrow}>{slide.eyebrow}</p>
                    <SlideTitle as={index === 0 ? 'h1' : 'h2'} text={slide.title} />
                    <p className={styles.description}>{slide.description}</p>
                    <HeroFlow type={slide.visual} />
                    <div className={styles.actions}>
                      <Button href={slide.primary.href} variant={slide.accent === 'di' ? 'di' : 'primary'} shine>
                        {slide.primary.label}
                      </Button>
                      <Button
                        href={demoLink ? site.digitalInvoiceDemoUrl : slide.secondary.href}
                        variant="glass"
                        {...(demoLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {slide.secondary.label}
                      </Button>
                    </div>
                  </div>
                  <div className={styles.visual} aria-hidden="true">
                    <HeroVisual type={slide.visual} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className={styles.controls}>
        <div className={styles.tabs} aria-label="Explore Teecoms highlights">
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
              <span>{slide.tab}</span>
              <span className={styles.track}>
                <span
                  ref={index === active ? fillRef : undefined}
                  className={styles.fill}
                  data-static={!shouldPlay}
                />
              </span>
            </button>
          ))}
        </div>
        <div className={styles.buttons}>
          <button type="button" className={styles.iconButton} onClick={() => swiperRef.current?.slidePrev()}>
            <ChevronLeft size={18} aria-hidden="true" /><span className="sr-only">Previous slide</span>
          </button>
          <button type="button" className={styles.iconButton} onClick={() => swiperRef.current?.slideNext()}>
            <ChevronRight size={18} aria-hidden="true" /><span className="sr-only">Next slide</span>
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
