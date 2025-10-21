import { FinanceDashboard } from './finance-dashboard'

interface FinancePageContentProps {
  startDate?: string
  endDate?: string
}

export function FinancePageContent({ startDate, endDate }: FinancePageContentProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Finance & Revenue</h1>
            <p className="leading-7 text-muted-foreground">
              Monitor platform revenue, transactions, and financial metrics
            </p>
          </div>

          <FinanceDashboard startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </section>
  )
}
