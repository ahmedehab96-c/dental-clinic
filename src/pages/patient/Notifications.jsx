import PageHero from '@/components/layout/PageHero'
import PatientTabs from '@/components/patient/PatientTabs'
import NotificationsPanel from '@/components/notifications/NotificationsPanel'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function PatientNotifications() {
  const { t } = useLanguage()
  usePageTitle(t('notifications.title'), { description: t('notifications.subtitle') })

  return (
    <>
      <PageHero eyebrow={t('notifications.heroEyebrow')} title={t('notifications.title')} subtitle={t('notifications.subtitle')} />

      <section className="py-14 sm:py-20">
        <div className="container-app">
          <PatientTabs />
          <div className="mx-auto mt-10 max-w-3xl">
            <NotificationsPanel />
          </div>
        </div>
      </section>
    </>
  )
}
