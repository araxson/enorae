import { StructuredData, generateFAQSchema } from '@/lib/seo'
import { FAQPage } from './faq-page'
import { questionsData } from './sections/questions/questions.data'

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

export default FAQFeature
