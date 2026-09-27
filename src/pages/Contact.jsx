import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import MapPlaceholder from '@/components/ui/MapPlaceholder'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const { t } = useLanguage()
  usePageTitle(t('nav.contact'), { description: t('contactPage.heroSubtitle') })
  const [form, setForm] = useState(initialForm)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // No backend yet — swap for services/api once the Laravel contact endpoint exists.
    setIsSubmitted(true)
    setForm(initialForm)
  }

  const infoItems = [
    { key: 'address', icon: HiOutlineMapPin, value: t('contactPage.address') },
    { key: 'phone', icon: HiOutlinePhone, value: '+966 55 000 0000', dir: 'ltr' },
    { key: 'email', icon: HiOutlineEnvelope, value: 'hello@radiantdental.care' },
    { key: 'hours', icon: HiOutlineClock, value: t('footer.hours') },
  ]

  return (
    <>
      <PageHero
        eyebrow={t('contactPage.heroEyebrow')}
        title={t('contactPage.heroTitle')}
        subtitle={t('contactPage.heroSubtitle')}
      />

      <section className="py-16 sm:py-20">
        <div className="container-app grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-[2rem] border border-ink-100 bg-white p-7 shadow-soft sm:p-9"
          >
            <h2 className="font-heading text-xl font-bold text-ink-900">{t('contactPage.formTitle')}</h2>

            {isSubmitted ? (
              <div className="mt-8 flex flex-col items-center rounded-2xl bg-accent-50 px-6 py-10 text-center">
                <HiOutlineCheckCircle className="text-4xl text-accent-600" />
                <p className="mt-3 font-heading text-lg font-bold text-ink-900">{t('contactPage.successTitle')}</p>
                <p className="mt-2 max-w-sm text-sm text-ink-500">{t('contactPage.successMessage')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label={t('contactPage.fields.name')}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('contactPage.placeholders.name')}
                  required
                />
                <FormField
                  label={t('contactPage.fields.email')}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('contactPage.placeholders.email')}
                  required
                />
                <FormField
                  label={t('contactPage.fields.phone')}
                  name="phone"
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t('contactPage.placeholders.phone')}
                  required
                />
                <FormField
                  label={t('contactPage.fields.subject')}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={t('contactPage.placeholders.subject')}
                  required
                />
                <FormField
                  label={t('contactPage.fields.message')}
                  name="message"
                  multiline
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t('contactPage.placeholders.message')}
                  required
                  className="sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                    {t('contactPage.submit')}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="rounded-[2rem] border border-ink-100 bg-white p-7 shadow-soft">
              <h2 className="font-heading text-lg font-bold text-ink-900">{t('contactPage.infoTitle')}</h2>
              <div className="mt-5 flex flex-col gap-4">
                {infoItems.map(({ key, icon: Icon, value, dir }) => (
                  <div key={key} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-lg text-primary-600">
                      <Icon />
                    </span>
                    <p dir={dir} className="pt-2 text-sm font-medium text-ink-700">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/966550000000"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <FaWhatsapp className="text-lg" />
                WhatsApp
              </a>
            </div>

            <MapPlaceholder label={t('contactPage.mapLabel')} />
          </motion.div>
        </div>
      </section>
    </>
  )
}
