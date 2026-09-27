import SectionHeading from '@/components/ui/SectionHeading'
import FaqAccordion from '@/components/ui/FaqAccordion'
import AsyncState from '@/components/ui/AsyncState'
import { fetchFaqs } from '@/services/api/faqs'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

export default function FaqSection() {
  const { t, tr } = useLanguage()
  const { data: faqs, loading, error, notFound } = useApiData(fetchFaqs, [])
  // FaqAccordion renders plain strings — resolve the bilingual API fields
  // to the active language here, right before handing them off.
  const items = (faqs ?? []).map((faq) => ({ question: tr(faq.question), answer: tr(faq.answer) }))

  return (
    <section className="bg-[#F7FBFC] py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('faqSection.eyebrow')}
          title={t('faqSection.title')}
          subtitle={t('faqSection.subtitle')}
        />

        <div className="mt-14">
          {loading && <AsyncState status="loading" />}
          {!loading && error && !notFound && <AsyncState status="error" />}
          {!loading && !error && items.length === 0 && <AsyncState status="empty" />}
          {!loading && !error && items.length > 0 && <FaqAccordion items={items} />}
        </div>
      </div>
    </section>
  )
}
