import { HiOutlineUserCircle } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'

// Shown when a doctor-role account isn't linked to a Doctor record yet
// (the API answers 404) — only an admin can create that link.
export default function DoctorProfileMissing() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
        <HiOutlineUserCircle />
      </span>
      <h1 className="font-heading mt-4 text-xl font-bold text-ink-900">{t('doctorPanel.noProfile.title')}</h1>
      <p className="mt-2 text-sm text-ink-500">{t('doctorPanel.noProfile.subtitle')}</p>
    </div>
  )
}
