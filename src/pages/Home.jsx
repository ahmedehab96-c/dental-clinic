import HeroSection from '@/sections/home/HeroSection'
import ServicesSection from '@/sections/home/ServicesSection'
import AboutSection from '@/sections/home/AboutSection'
import DoctorsSection from '@/sections/home/DoctorsSection'
import GallerySection from '@/sections/home/GallerySection'
import WhyChooseUsSection from '@/sections/home/WhyChooseUsSection'
import AppointmentCtaSection from '@/sections/home/AppointmentCtaSection'
import TestimonialsSection from '@/sections/home/TestimonialsSection'
import FaqSection from '@/sections/home/FaqSection'
import BlogSection from '@/sections/home/BlogSection'
import ContactSection from '@/sections/home/ContactSection'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Home() {
  usePageTitle()

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <DoctorsSection />
      <GallerySection />
      <WhyChooseUsSection />
      <AppointmentCtaSection />
      <TestimonialsSection />
      <FaqSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
