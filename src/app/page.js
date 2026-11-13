import Header from '@/components/layout/Header'
import BackToTop from '@/components/layout/BackToTop'
import Footer from '@/components/layout/Footer'
import AboutSection from '@/components/sections/home/AboutSection'
import CommitmentsSection from '@/components/sections/home/CommitmentsSection'
import ContactSection from '@/components/sections/home/ContactSection'
import CtaSection from '@/components/sections/home/CtaSection'
import DigitalInvoiceSection from '@/components/sections/home/DigitalInvoiceSection'
import HeroSlider from '@/components/sections/home/HeroSlider'
import ServicesSection from '@/components/sections/home/ServicesSection'
import TeamSection from '@/components/sections/home/TeamSection'
import WhySection from '@/components/sections/home/WhySection'
import {
  aboutContent,
  commitmentsContent,
  contactContent,
  ctaContent,
  digitalInvoiceContent,
  heroSlides,
  servicesContent,
  teamContent,
  whyContent,
} from '@/content/home.content'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSlider slides={heroSlides} />
        <AboutSection content={aboutContent} />
        <ServicesSection content={servicesContent} />
        <DigitalInvoiceSection content={digitalInvoiceContent} />
        <WhySection content={whyContent} />
        <TeamSection content={teamContent} />
        <CommitmentsSection content={commitmentsContent} />
        <CtaSection content={ctaContent} />
        <ContactSection content={contactContent} />
      </main>
      <Footer isHome />
      <BackToTop />
    </>
  )
}
