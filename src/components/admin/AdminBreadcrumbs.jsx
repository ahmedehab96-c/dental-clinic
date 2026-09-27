import { Link, useLocation } from 'react-router-dom'
import { adminNavLinks } from '@/data/adminNavLinks'
import { useLanguage } from '@/context/LanguageContext'

export default function AdminBreadcrumbs({ links = adminNavLinks, panelLabelKey = 'admin.sidebar.panelLabel', basePath = '/admin' }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  const segment = pathname.slice(basePath.length).replace(/^\//, '').split('/')[0]
  const current = (segment ? links.find((link) => link.path === `${basePath}/${segment}`) : null) ?? links[0]

  const isDashboard = current.key === 'dashboard'

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
      {isDashboard ? (
        <span className="font-semibold text-ink-800">{t(panelLabelKey)}</span>
      ) : (
        <>
          <Link to={basePath} className="font-medium text-ink-400 transition-colors hover:text-primary-700">
            {t(panelLabelKey)}
          </Link>
          <span className="text-ink-300">/</span>
          <span className="font-semibold text-ink-800">{t(current.labelKey)}</span>
        </>
      )}
    </nav>
  )
}
