import { Link, NavLink } from 'react-router-dom'
import { HiOutlineArrowLeftStartOnRectangle } from 'react-icons/hi2'
import { adminNavLinks } from '@/data/adminNavLinks'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'

// `links`/`panelLabelKey` default to the admin panel; the doctor panel
// passes its own so both share one sidebar implementation.
export default function AdminSidebar({ onNavigate, links = adminNavLinks, panelLabelKey = 'admin.sidebar.panelLabel' }) {
  const { t } = useLanguage()

  return (
    <nav className="flex h-full flex-col bg-ink-950 text-ink-300">
      <div className="flex h-20 shrink-0 items-center gap-2.5 border-b border-white/10 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
          R
        </span>
        <div className="min-w-0">
          <p className="font-heading truncate text-sm font-bold text-white">{t('common.brand')}</p>
          <p className="text-[11px] text-ink-500">{t(panelLabelKey)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.key}>
                <NavLink
                  to={link.path}
                  end={link.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200',
                      isActive ? 'bg-primary-600 text-white' : 'text-ink-300 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  <Icon className="shrink-0 text-lg" />
                  {t(link.labelKey)}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="shrink-0 border-t border-white/10 p-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-500 transition-colors duration-200 hover:bg-white/5 hover:text-white"
        >
          <HiOutlineArrowLeftStartOnRectangle className="text-lg" />
          {t('admin.sidebar.backToSite')}
        </Link>
      </div>
    </nav>
  )
}
