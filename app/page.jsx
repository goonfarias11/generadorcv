'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/home/Header'
import HeroSection from '@/components/home/HeroSection'
import BenefitsSection from '@/components/home/BenefitsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'

// Dynamic imports para componentes grandes (code splitting)
const TemplatesGallery = dynamic(() => import('@/components/home/TemplatesGallery'), {
  loading: () => <div className="py-16 text-center text-neutral-600">Cargando plantillas...</div>
})
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <div className="py-16 text-center text-neutral-600">Cargando testimonios...</div>
})
const CTASection = dynamic(() => import('@/components/home/CTASection'))
const Footer = dynamic(() => import('@/components/home/Footer'))

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TemplatesGallery />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
