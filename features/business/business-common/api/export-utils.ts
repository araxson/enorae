'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

/**
 * Export data to CSV format
 */
export async function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; label: string }>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Use provided columns or extract from first row
  const headers =
    columns || (data[0] ? Object.keys(data[0]).map((key) => ({ key, label: key })) : [])

  // Create CSV header row
  const headerRow = headers.map((h) => `"${h.label}"`).join(',')

  // Create CSV data rows
  const dataRows = data.map((row) => {
    return headers
      .map((h) => {
        const value = row[h.key]
        // Handle different value types
        if (value === null || value === undefined) return '""'
        if (typeof value === 'object') return `"${JSON.stringify(value)}"`
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // Combine header and data
  const csv = [headerRow, ...dataRows].join('\n')

  return csv
}

/**
 * Export data to Excel format (XLSX)
 * Note: This is a simplified implementation that generates CSV with .xlsx extension
 * For full Excel features, consider using a library like exceljs
 */
export async function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; label: string }>,
  options?: {
    sheetName?: string
    includeHeader?: boolean
    autoWidth?: boolean
  }
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  /**
   * NOTE: Currently exports as CSV format which can be opened in Excel.
   *
   * Future enhancement: Integrate exceljs library for native XLSX format
   * with proper cell formatting, formulas, and styling support.
   */
  const csv = await exportToCSV(data, filename, columns)

  return csv
}

/**
 * Export data to PDF format
 * Note: This generates a simple text-based PDF
 * For advanced formatting, consider using jsPDF or pdfmake
 */
export async function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  options?: {
    title?: string
    orientation?: 'portrait' | 'landscape'
    includeTimestamp?: boolean
    columns?: Array<{ key: keyof T; label: string }>
  }
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const { title = 'Export', includeTimestamp = true, columns } = options || {}

  // Extract headers
  const headers = columns || (data[0] ? Object.keys(data[0]).map((key) => ({ key, label: key })) : [])

  // Build PDF content as plain text (for basic PDF generation)
  const lines: string[] = []

  // Title
  lines.push(title)
  lines.push('='.repeat(title.length))
  lines.push('')

  // Timestamp
  if (includeTimestamp) {
    lines.push(`Generated: ${new Date().toLocaleString()}`)
    lines.push('')
  }

  // Headers
  lines.push(headers.map((h) => h.label).join(' | '))
  lines.push('-'.repeat(headers.map((h) => h.label).length * 10))

  // Data rows
  data.forEach((row) => {
    const rowData = headers.map((h) => {
      const value = row[h.key]
      if (value === null || value === undefined) return '-'
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
    })
    lines.push(rowData.join(' | '))
  })

  /**
   * NOTE: Currently generates plain text content.
   *
   * Future enhancement: Integrate jsPDF or pdfmake library for proper
   * PDF generation with table formatting, headers, and styling.
   */
  const content = lines.join('\n')

  return content
}

/**
 * Generate download response for exported file
 */
export async function generateExportResponse(
  content: string,
  filename: string,
  format: 'csv' | 'xlsx' | 'pdf' | 'txt'
): Promise<{ content: string; filename: string; mimeType: string }> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const mimeTypes = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    txt: 'text/plain',
  }

  const extensions = {
    csv: '.csv',
    xlsx: '.xlsx',
    pdf: '.pdf',
    txt: '.txt',
  }

  return {
    content,
    filename: `${filename}${extensions[format]}`,
    mimeType: mimeTypes[format],
  }
}

/**
 * Export appointments to CSV
 */
export async function exportAppointmentsToCSV(
  appointments: Array<Record<string, unknown>>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'staff_name', label: 'Staff' },
    { key: 'service_name', label: 'Service' },
    { key: 'start_time', label: 'Start Time' },
    { key: 'end_time', label: 'End Time' },
    { key: 'status', label: 'Status' },
    { key: 'total_price', label: 'Price' },
  ]

  return exportToCSV(appointments, 'appointments', columns as never)
}

/**
 * Export products to CSV
 */
export async function exportProductsToCSV(
  products: Array<Record<string, unknown>>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'cost_price', label: 'Cost Price' },
    { key: 'retail_price', label: 'Retail Price' },
    { key: 'quantity', label: 'Stock Quantity' },
    { key: 'is_active', label: 'Active' },
  ]

  return exportToCSV(products, 'products', columns as never)
}

/**
 * Export services to CSV
 */
export async function exportServicesToCSV(
  services: Array<Record<string, unknown>>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const columns = [
    { key: 'name', label: 'Service Name' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'duration_minutes', label: 'Duration (min)' },
    { key: 'base_price', label: 'Base Price' },
    { key: 'is_active', label: 'Active' },
  ]

  return exportToCSV(services, 'services', columns as never)
}

/**
 * Export customers to CSV
 */
export async function exportCustomersToCSV(
  customers: Array<Record<string, unknown>>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const columns = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'total_appointments', label: 'Total Appointments' },
    { key: 'total_spent', label: 'Total Spent' },
    { key: 'last_visit', label: 'Last Visit' },
  ]

  return exportToCSV(customers, 'customers', columns as never)
}

/**
 * Export staff to CSV
 */
export async function exportStaffToCSV(
  staff: Array<Record<string, unknown>>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const columns = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'position', label: 'Position' },
    { key: 'specialties', label: 'Specialties' },
    { key: 'is_active', label: 'Active' },
  ]

  return exportToCSV(staff, 'staff', columns as never)
}

/**
 * Export financial transactions to CSV
 */
export async function exportTransactionsToCSV(
  transactions: Array<Record<string, unknown>>
): Promise<string> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    { key: 'payment_method', label: 'Payment Method' },
    { key: 'status', label: 'Status' },
    { key: 'reference', label: 'Reference' },
  ]

  return exportToCSV(transactions, 'transactions', columns as never)
}
