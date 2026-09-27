import NotificationsPanel from '@/components/notifications/NotificationsPanel'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

// Mounted inside both the admin and doctor dashboard shells.
export default function PanelNotifications() {
  const { t } = useLanguage()
  usePageTitle(t('notifications.title'))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">{t('notifications.title')}</h1>
        <p className="mt-1 text-sm text-ink-500">{t('notifications.subtitle')}</p>
      </div>
      <div className="max-w-4xl">
        <NotificationsPanel />
      </div>
    </div>
  )
}
