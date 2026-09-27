import { Link } from 'react-router-dom'
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa'
import { navLinks } from '@/data/navLinks'
import { fetchClinicSettings } from '@/services/api/clinic'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const socials = [
  { key: 'facebook', href: '#', icon: FaFacebookF },
  { key: 'instagram', href: '#', icon: FaInstagram },
  { key: 'whatsapp', href: '#', icon: FaWhatsapp },
  { key: 'tiktok', href: '#', icon: FaTiktok },
]

export default function Footer() {
  const { t, tr } = useLanguage()
  const year = new Date().getFullYear()
  // Falls back to the existing static copy while the clinic-settings call is
  // in flight (or if it fails) so the footer never renders blank contact info.
  const { data: clinic } = useApiData(fetchClinicSettings, [])
  const address = clinic ? tr(clinic.address) : 'Riyadh, Saudi Arabia — King Fahd Rd.'
  const phone = clinic?.phone ?? '+966 55 000 0000'
  const email = clinic?.email ?? 'hello@radiantdental.care'

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-300">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />

      <div className="container-app grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 font-heading text-lg font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white">
              <ToothMark />
            </span>
            {t('common.brand')}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">{t('footer.tagline')}</p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ key, href, icon: Icon }) => (
              <a
                key={key}
                href={href}
                onClick={(event) => {
                  // Social pages aren't live yet — swap in the real profile
                  // URLs above and this guard becomes a no-op.
                  if (href === '#') event.preventDefault()
                }}
                aria-label={key}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-400 hover:text-accent-400"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            {t('footer.quickLinks')}
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link to={link.path} className="transition-colors duration-200 hover:text-accent-400">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            {t('footer.workingHours')}
          </h4>
          <p className="mt-5 text-sm leading-relaxed">{clinic ? tr(clinic.workingHours) : t('footer.hours')}</p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            {t('footer.contactUs')}
          </h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <HiOutlineMapPin className="mt-0.5 shrink-0 text-accent-400" />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-3">
              <HiOutlinePhone className="mt-0.5 shrink-0 text-accent-400" />
              <span dir="ltr">{phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <HiOutlineEnvelope className="mt-0.5 shrink-0 text-accent-400" />
              <span>{email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-500 sm:flex-row">
          <p>
            © {year} {t('common.brand')} — {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}

function ToothMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3c-1.7 0-2.6.8-3.6.8-1.35 0-2.4 1.1-2.4 3.2 0 2.25.9 4.65 1.6 6.25.5 1.1.9 2.05 1.65 2.05.95 0 .97-2.3 1.35-3.95.23-1 .45-1.65 1.4-1.65s1.17.65 1.4 1.65c.38 1.65.4 3.95 1.35 3.95.75 0 1.15-.95 1.65-2.05.7-1.6 1.6-4 1.6-6.25 0-2.1-1.05-3.2-2.4-3.2-1 0-1.9-.8-3.6-.8z"
        fill="currentColor"
      />
    </svg>
  )
}
