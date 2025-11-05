'use client'

import { useMemo, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CustomerTransactionWithDetails } from '@/features/customer/transactions/api/queries'

const PAGE_SIZE = 10

interface TransactionsTableProps {
  transactions: CustomerTransactionWithDetails[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return transactions.slice(start, start + PAGE_SIZE)
  }, [page, transactions])

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), pageCount))
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Salon</TableHead>
              <TableHead>Staff Member</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((transaction) => {
              const transactionDate = transaction.transaction_at
                ? new Date(transaction.transaction_at)
                : new Date()

              return (
                <TableRow key={transaction['id']}>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">
                        {transactionDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-muted-foreground">
                        {transactionDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {transaction.salon?.name || 'Unknown Salon'}
                  </TableCell>
                  <TableCell>{transaction.staff?.full_name || '-'}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.payment_method || '-'}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {transaction.amount ? `$${Number(transaction.amount).toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.transaction_type || 'Unknown'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                goToPage(page - 1)
              }}
            />
          </PaginationItem>

          {Array.from({ length: pageCount }).map((_, index) => {
            const current = index + 1
            const isActive = current === page

            return (
              <PaginationItem key={current}>
                <PaginationLink
                  href="#"
                  isActive={isActive}
                  onClick={(event) => {
                    event.preventDefault()
                    goToPage(current)
                  }}
                >
                  {current}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                goToPage(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
