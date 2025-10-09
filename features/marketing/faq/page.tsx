import { StructuredData, generateFAQSchema } from '@/lib/seo/structured-data'
import { FAQPage } from './faq-page'
import { faqSEO } from './faq.seo'
import { questionsData } from './sections/questions/questions.data'

const faqEntries = questionsData.categories.flatMap((category) =>
  category.questions.map((question) => ({
    question: question.q,
    answer: question.a,
  })),
)

const faqStructuredData = generateFAQSchema(faqEntries)

export const faqPageMetadata = faqSEO

export function FAQPageScreen() {
  return (
    <>
      <StructuredData data={faqStructuredData} />
      <FAQPage />
    </>
  )
}
