import { motion } from 'framer-motion'
import { HiOutlineSparkles, HiOutlineFaceFrown } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function ComingSoon({ titleKey, variant = 'comingSoon' }) {
  const { t } = useLanguage()
  const isNotFound = variant === 'notFound'

  const heading = isNotFound ? t('notFoundPage.title') : t(`comingSoonPage.${titleKey}`)
  const message = isNotFound ? t('notFoundPage.message') : t('comingSoonPage.message')
  const Icon = isNotFound ? HiOutlineFaceFrown : HiOutlineSparkles

  usePageTitle(heading, { noIndex: true })

  return (
    <section className="bg-medical-gradient flex min-h-[70vh] items-center justify-center pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container-app text-center"
      >
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-2xl text-primary-700">
          <Icon />
        </span>
        {isNotFound && (
          <p className="font-heading text-sm font-bold tracking-widest text-primary-600">{t('notFoundPage.eyebrow')}</p>
        )}
        <h1 className="font-heading mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">{heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-500">{message}</p>
        <div className="mt-8">
          <Button to="/" variant="primary">{t('comingSoonPage.backHome')}</Button>
        </div>
      </motion.div>
    </section>
  )
}
