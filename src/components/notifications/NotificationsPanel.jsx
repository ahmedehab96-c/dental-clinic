import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AsyncState from '@/components/ui/AsyncState'
import Pagination from '@/components/admin/Pagination'
import NotificationItem from '@/components/notifications/NotificationItem'
import { useApiData } from '@/hooks/useApiData'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '@/services/api/notifications'
import { emitNotificationsChanged, notificationLinkFor, onNotificationsChanged } from '@/utils/notifications'
import { cn } from '@/utils/cn'

const PER_PAGE = 15

/**
 * The full notification list — mounted by /notifications (patient area),
 * /admin/notifications and /doctor/notifications, so every role gets it
 * inside its own layout.
 */
export default function NotificationsPanel() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [banner, setBanner] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => setPage(1), [unreadOnly])
  // The bell marking something read elsewhere keeps this list in step.
  useEffect(() => onNotificationsChanged(() => setRefreshKey((key) => key + 1)), [])

  const { data: result, loading, error } = useApiData(
    () => fetchNotifications({ page, perPage: PER_PAGE, unreadOnly }),
    [page, unreadOnly, refreshKey],
  )
  const notifications = result?.notifications ?? []
  const hasUnread = notifications.some((notification) => !notification.readAt)

  const handleMarkRead = async (notification) => {
    try {
      await markNotificationRead(notification.id)
      emitNotificationsChanged()
    } catch {
      setBanner({ type: 'error', message: t('notifications.actionError') })
    }
  }

  const handleOpen = async (notification) => {
    if (!notification.readAt) await handleMarkRead(notification)
    const link = notificationLinkFor(notification, user)
    if (link) navigate(link)
  }

  const handleMarkAll = async () => {
    setBusy(true)
    setBanner(null)
    try {
      await markAllNotificationsRead()
      emitNotificationsChanged()
      setBanner({ type: 'success', message: t('notifications.markAllSuccess') })
    } catch {
      setBanner({ type: 'error', message: t('notifications.actionError') })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label={t('notifications.title')} className="flex flex-wrap gap-2">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              role="tab"
              aria-selected={unreadOnly === value}
              onClick={() => setUnreadOnly(value)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                unreadOnly === value
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-700',
              )}
            >
              {t(value ? 'notifications.filters.unread' : 'notifications.filters.all')}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          disabled={busy || !hasUnread}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('notifications.markAllRead')}
        </button>
      </div>

      {banner && (
        <div
          role="alert"
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            banner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && !result && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!error && result && notifications.length === 0 && (
          <AsyncState status="empty" message={t(unreadOnly ? 'notifications.emptyUnread' : 'notifications.empty')} />
        )}
        {!error && notifications.length > 0 && (
          <>
            <div className="flex flex-col gap-1 p-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onOpen={handleOpen}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
            <Pagination
              currentPage={result.meta.currentPage}
              lastPage={result.meta.lastPage}
              totalLabel={t('notifications.totalCount').replace('{count}', result.meta.total)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
