import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineBell } from 'react-icons/hi2'
import NotificationItem from '@/components/notifications/NotificationItem'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { fetchNotifications, fetchUnreadCount, markAllNotificationsRead, markNotificationRead } from '@/services/api/notifications'
import {
  emitNotificationsChanged,
  notificationLinkFor,
  notificationsPathFor,
  onNotificationsChanged,
} from '@/utils/notifications'
import { cn } from '@/utils/cn'

// Plain polling for now — no real-time provider in this phase. Swapping in
// broadcasting later only means calling refreshCount() from that listener.
const POLL_MS = 60_000
const RECENT_COUNT = 6

export default function NotificationBell({ className }) {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)

  useEffect(() => {
    openRef.current = open
  }, [open])
  const [recent, setRecent] = useState(null)
  const [loadError, setLoadError] = useState(false)

  const refreshCount = useCallback(() => {
    fetchUnreadCount()
      .then(setCount)
      .catch(() => {})
  }, [])

  const loadRecent = useCallback(() => {
    setLoadError(false)
    fetchNotifications({ perPage: RECENT_COUNT })
      .then((result) => setRecent(result.notifications))
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return undefined
    refreshCount()

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') refreshCount()
    }, POLL_MS)
    const stopListening = onNotificationsChanged(() => {
      refreshCount()
      if (openRef.current) loadRecent()
    })

    return () => {
      clearInterval(interval)
      stopListening()
    }
  }, [isAuthenticated, refreshCount, loadRecent])

  if (!isAuthenticated) return null

  const toggle = () => {
    if (!open) loadRecent()
    setOpen((prev) => !prev)
  }

  const handleOpen = async (notification) => {
    setOpen(false)
    if (!notification.readAt) {
      await markNotificationRead(notification.id).catch(() => {})
      emitNotificationsChanged()
    }
    const link = notificationLinkFor(notification, user)
    if (link) navigate(link)
  }

  const handleMarkRead = async (notification) => {
    await markNotificationRead(notification.id).catch(() => {})
    emitNotificationsChanged()
  }

  const handleMarkAll = async () => {
    await markAllNotificationsRead().catch(() => {})
    emitNotificationsChanged()
  }

  const badge = count > 99 ? '99+' : count

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={count > 0 ? t('notifications.bellLabelUnread').replace('{count}', count) : t('notifications.bellLabel')}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl text-ink-600 transition-colors hover:bg-ink-50 hover:text-primary-700"
      >
        <HiOutlineBell />
        {count > 0 && (
          <span className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {badge}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-label={t('notifications.title')}
              className="absolute end-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-ink-100 bg-white p-2 shadow-medium"
            >
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <p className="text-sm font-bold text-ink-900">{t('notifications.title')}</p>
                {count > 0 && (
                  <button type="button" onClick={handleMarkAll} className="text-xs font-semibold text-primary-700 hover:text-primary-800">
                    {t('notifications.markAllRead')}
                  </button>
                )}
              </div>

              <div className="max-h-[22rem] overflow-y-auto">
                {recent === null && !loadError && (
                  <div className="flex justify-center py-8" role="status">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                  </div>
                )}
                {loadError && <p className="px-3 py-6 text-center text-sm text-red-600">{t('notifications.loadError')}</p>}
                {recent?.length === 0 && <p className="px-3 py-8 text-center text-sm text-ink-400">{t('notifications.empty')}</p>}
                {recent?.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onOpen={handleOpen}
                    onMarkRead={handleMarkRead}
                    compact
                  />
                ))}
              </div>

              <Link
                to={notificationsPathFor(user)}
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                {t('notifications.viewAll')}
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
