import { motion } from 'framer-motion'
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineClock } from 'react-icons/hi2'
import { FaRegCalendarCheck, FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import MapPlaceholder from '@/components/ui/MapPlaceholder'
import { fetchClinicSettings } from '@/services/api/clinic'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const infoItems = [
  { key: 'address', icon: HiOutlineMapPin },
  { key: 'phone', icon: HiOutlinePhone },
  { key: 'email', icon: HiOutlineEnvelope },
  { key: 'hours', icon: HiOutlineClock },
]

export default function ContactSection() {
  const { t, tr } = useLanguage()
  // Falls back to the existing static copy while the clinic-settings call is
  // in flight (or if it fails) so this section never renders blank contact info.
  const { data: clinic } = useApiData(fetchClinicSettings, [])

  const values = {
    address: clinic ? tr(clinic.address) : t('contactPage.address'),
    phone: clinic?.phone ?? '+966 55 000 0000',
    email: clinic?.email ?? 'hello@radiantdental.care',
    hours: clinic ? tr(clinic.workingHours) : t('footer.hours'),
  }
  const hrefs = {
    address: undefined,
    phone: `tel:${values.phone.replace(/\s+/g, '')}`,
    email: `mailto:${values.email}`,
    hours: undefined,
  }
  const whatsapp = clinic?.whatsapp ?? '966550000000'

  return (
    <section className="bg-[#F7FBFC] py-20 sm:py-28">
      <div className="container-app grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-sm font-semibold text-accent-700">
            {t('contactSection.eyebrow')}
          </span>
          <h2 className="font-heading mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">
            {t('contactSection.title')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{t('contactSection.subtitle')}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {infoItems.map(({ key, icon: Icon }) => {
              const href = hrefs[key]
              const Tag = href ? 'a' : 'div'
              return (
                <Tag
                  key={key}
                  {...(href ? { href } : {})}
                  className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition-colors duration-200 hover:border-primary-200"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-lg text-primary-600">
                    <Icon />
                  </span>
                  <p dir={key === 'phone' ? 'ltr' : undefined} className="pt-1.5 text-sm font-medium text-ink-700">
                    {values[key]}
                  </p>
                </Tag>
              )
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/book-appointment" variant="primary" size="lg" icon={<FaRegCalendarCheck />} iconPosition="start">
              {t('common.bookAppointment')}
            </Button>
            <Button href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} variant="outline" size="lg" icon={<FaWhatsapp />} iconPosition="start">
              WhatsApp
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <MapPlaceholder label={t('contactPage.mapLabel')} />
        </motion.div>
      </div>
    </section>
  )
}
