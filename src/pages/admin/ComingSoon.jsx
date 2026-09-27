import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

// Placeholder for every admin section whose CRUD page hasn't been built yet
// (this phase is layout + dashboard overview only) — keeps sidebar
// navigation inside the admin shell instead of falling through to the
// public site's 404 page.
export default function AdminComingSoon() {
  const { t } = useLanguage()
  usePageTitle(t('admin.comingSoon.title'))

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl text-primary-600">
        <HiOutlineWrenchScrewdriver />
      </span>
      <h1 className="font-heading mt-5 text-xl font-bold text-ink-900">{t('admin.comingSoon.title')}</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">{t('admin.comingSoon.subtitle')}</p>
    </div>
  )
}
