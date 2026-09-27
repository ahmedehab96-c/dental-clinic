import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import BlogCard from '@/components/ui/BlogCard'
import AsyncState from '@/components/ui/AsyncState'
import { cn } from '@/utils/cn'
import { fetchPosts } from '@/services/api/posts'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fetchAllPosts = () => fetchPosts({ perPage: 100 })

export default function Blog() {
  const { t, tr } = useLanguage()
  usePageTitle(t('nav.blog'), { description: t('blogPage.heroSubtitle') })
  const [activeCategory, setActiveCategory] = useState('all')
  const { data: blogPosts, loading, error, notFound } = useApiData(fetchAllPosts, [])

  const categories = useMemo(() => {
    const unique = new Set((blogPosts ?? []).map((post) => tr(post.category)))
    return ['all', ...unique]
  }, [blogPosts, tr])

  const posts = blogPosts ?? []
  const filteredPosts =
    activeCategory === 'all' ? posts : posts.filter((post) => tr(post.category) === activeCategory)

  return (
    <>
      <PageHero
        eyebrow={t('blogPage.heroEyebrow')}
        title={t('blogPage.heroTitle')}
        subtitle={t('blogPage.heroSubtitle')}
      />

      <section className="py-16 sm:py-20">
        <div className="container-app">
          {loading && <AsyncState status="loading" />}
          {!loading && error && !notFound && <AsyncState status="error" />}
          {!loading && !error && posts.length === 0 && <AsyncState status="empty" />}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      'rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200',
                      activeCategory === category
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-700',
                    )}
                  >
                    {category === 'all' ? t('blogPage.allCategory') : category}
                  </button>
                ))}
              </div>

              <motion.div
                key={activeCategory}
                variants={container}
                initial="hidden"
                animate="show"
                className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
