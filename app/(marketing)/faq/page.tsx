import { FAQPage, faqSEO, questionsData } from '@/features/marketing/faq'
import { StructuredData, generateFAQSchema } from '@/lib/seo/structured-data'

const faqEntries = questionsData.categories.flatMap((category) =>
  category.questions.map((question) => ({
    question: question.q,
    answer: question.a,
  })),
)

const faqStructuredData = generateFAQSchema(faqEntries)

export const metadata = faqSEO

export default function Page() {
  return (
    <>
      <StructuredData data={faqStructuredData} />
      <FAQPage />
    </>
  )
}
