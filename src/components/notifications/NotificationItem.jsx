import { HiOutlineCalendarDays, HiOutlineCheck } from 'react-icons/hi2'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'
import { describeNotification, formatRelativeTime } from '@/utils/notifications'

/**
 * One notification row, shared by the bell dropdown and the full page.
 * Unread rows get a tinted background and a dot; clicking the row opens it
 * (marks read + follows its link), the check button only marks it read.
 */
export default function NotificationItem({ notification, onOpen, onMarkRead, compact = false }) {
  const { t, tr, language } = useLanguage()
  const { user } = useAuth()
  const { title, body } = describeNotification(notification, user, { t, tr })
  const isUnread = !notification.readAt

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-xl px-3 transition-colors',
        compact ? 'py-2.5' : 'py-3.5',
        isUnread ? 'bg-primary-50/60 hover:bg-primary-50' : 'hover:bg-ink-50',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base',
          isUnread ? 'bg-primary-100 text-primary-700' : 'bg-ink-100 text-ink-500',
        )}
      >
        <HiOutlineCalendarDays />
      </span>

      <button type="button" onClick={() => onOpen(notification)} className="min-w-0 flex-1 text-start">
        <p className={cn('text-sm', isUnread ? 'font-semibold text-ink-900' : 'font-medium text-ink-700')}>
          {isUnread && <span className="me-1.5 inline-block h-2 w-2 rounded-full bg-primary-600 align-middle" aria-hidden="true" />}
          {title}
        </p>
        {body && <p className={cn('mt-0.5 text-xs text-ink-500', compact && 'line-clamp-2')}>{body}</p>}
        <p className="mt-1 text-[11px] text-ink-400">
          <time dateTime={notification.createdAt}>{formatRelativeTime(notification.createdAt, language)}</time>
          <span className="sr-only"> — {isUnread ? t('notifications.unread') : t('notifications.read')}</span>
        </p>
      </button>

      {isUnread && onMarkRead && (
        <button
          type="button"
          onClick={() => onMarkRead(notification)}
          aria-label={t('notifications.markRead')}
          title={t('notifications.markRead')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-white hover:text-primary-700"
        >
          <HiOutlineCheck className="text-sm" />
        </button>
      )}
    </div>
  )
}
