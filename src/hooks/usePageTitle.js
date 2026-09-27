import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const DEFAULT_OG_IMAGE =
  'https://images.pexels.com/photos/19879741/pexels-photo-19879741.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1200&h=630&fit=crop'

function setMetaTag(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Keeps document.title plus the meta description/Open Graph/Twitter tags and
// canonical link in sync per route — this is a single-page app with no
// server-rendered <head>, so this is the only place those tags get set.
export function usePageTitle(title, { description, image, noIndex = false } = {}) {
  const { t } = useLanguage()

  useEffect(() => {
    const fullTitle = title ? `${title} — ${t('common.brand')}` : t('common.brand')
    const metaDescription = description || t('seo.defaultDescription')

    document.title = fullTitle
    setMetaTag('name', 'description', metaDescription)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:site_name', t('common.brand'))
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', metaDescription)
    setMetaTag('property', 'og:image', image || DEFAULT_OG_IMAGE)
    setMetaTag('property', 'og:url', window.location.href)
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', metaDescription)
    setCanonical(window.location.href)
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, image, noIndex, t])
}
