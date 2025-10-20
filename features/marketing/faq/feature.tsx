import { StructuredData, generateFAQSchema } from '@/lib/seo/structured-data'
import { FAQPage } from './components/faq-page'
import { questionsData } from './components/sections/questions/questions.data'

export function FAQFeature() {
  const faqEntries = questionsData.categories.flatMap((category) =>
    category.questions.map((question) => ({
      question: question.q,
      answer: question.a,
    })),
  )

  return (
    <>
      <StructuredData data={generateFAQSchema(faqEntries)} />
      <FAQPage />
    </>
  )
}
