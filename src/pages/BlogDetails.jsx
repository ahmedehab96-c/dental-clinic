import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight, HiOutlineCalendarDays, HiOutlineClock, HiOutlineUser } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import BlogCard from '@/components/ui/BlogCard'
import RevealImage from '@/components/ui/RevealImage'
import AsyncState from '@/components/ui/AsyncState'
import { fetchPostBySlug, fetchPosts } from '@/services/api/posts'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { formatDate } from '@/utils/formatDate'
import { usePageTitle } from '@/hooks/usePageTitle'

const fetchAllPosts = () => fetchPosts({ perPage: 100 })

export default function BlogDetails() {
  const { slug } = useParams()
  const { t, tr, isRtl, language } = useLanguage()
  const { data: post, loading: postLoading, error: postError, notFound } = useApiData(
    () => fetchPostBySlug(slug),
    [slug],
  )
  const { data: allPosts, loading: postsLoading } = useApiData(fetchAllPosts, [])

  usePageTitle(post ? tr(post.title) : t('nav.blog'), {
    description: post ? tr(post.excerpt) : undefined,
    image: post?.image,
  })

  if (notFound) return <Navigate to="/blog" replace />

  if (postLoading) {
    return (
      <section className="pt-28 pb-12 sm:pt-32">
        <div className="container-app">
          <AsyncState status="loading" />
        </div>
      </section>
    )
  }

  if (postError || !post) {
    return (
      <section className="pt-28 pb-12 sm:pt-32">
        <div className="container-app">
          <AsyncState status="error" />
        </div>
      </section>
    )
  }

  const BackArrow = isRtl ? HiOutlineArrowLongRight : HiOutlineArrowLongLeft
  const relatedPosts = postsLoading
    ? []
    : (allPosts ?? []).filter((entry) => entry.slug !== post.slug).slice(0, 3)
  const paragraphs = tr(post.content)

  return (
    <>
      <section className="bg-medical-gradient pt-28 pb-12 sm:pt-32">
        <div className="container-app">
          <Button to="/blog" variant="glass" size="md" icon={<BackArrow />} iconPosition="start" className="mb-8">
            {t('articlePage.back')}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700">
              {tr(post.category)}
            </span>
            <h1 className="font-heading mt-5 text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">
              {tr(post.title)}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                <HiOutlineUser className="text-base" />
                {tr(post.author)}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineCalendarDays className="text-base" />
                {formatDate(post.date, language)}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineClock className="text-base" />
                {post.readMinutes} {t('articlePage.minRead')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-app">
          <RevealImage
            src={post.image}
            alt={tr(post.title)}
            loading="lazy"
            trigger="mount"
            delay={0.1}
            className="mx-auto max-w-4xl rounded-[2rem] shadow-medium"
            imgClassName="aspect-[16/9] w-full"
          />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-ink-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-ink-50/60 py-16 sm:py-20">
          <div className="container-app">
            <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
              {t('articlePage.relatedTitle')}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
