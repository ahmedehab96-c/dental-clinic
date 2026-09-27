import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import BlogCard from '@/components/ui/BlogCard'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import { fetchPosts } from '@/services/api/posts'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fetchLatestPosts = () => fetchPosts({ perPage: 3 })

export default function BlogSection() {
  const { t } = useLanguage()
  const { data: latestPosts, loading, error, notFound } = useApiData(fetchLatestPosts, [])

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('blogSection.eyebrow')}
          title={t('blogSection.title')}
          subtitle={t('blogSection.subtitle')}
        />

        {loading && <AsyncState status="loading" />}
        {!loading && error && !notFound && <AsyncState status="error" />}
        {!loading && !error && latestPosts?.length === 0 && <AsyncState status="empty" />}

        {!loading && !error && latestPosts?.length > 0 && (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </motion.div>

            <div className="mt-12 flex justify-center">
              <Button to="/blog" variant="outline" size="lg">
                {t('common.viewAll')} {t('nav.blog')}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
