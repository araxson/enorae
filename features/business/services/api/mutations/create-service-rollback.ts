import 'server-only'
import type { SupabaseServerClient } from './shared'

/**
 * Rollback service creation by deleting service and optionally pricing
 *
 * Error scenarios:
 * - Pricing deletion fails (constraint violations, permissions)
 * - Service deletion fails (referenced by other tables)
 * - Partial rollback (pricing deleted but service deletion fails)
 *
 * Recovery: Logs full context for debugging, throws to halt transaction
 *
 * @param supabase - Supabase client instance
 * @param serviceId - ID of service to rollback
 * @param includePricing - Whether to also delete pricing data
 */
export async function rollbackService(
  supabase: SupabaseServerClient,
  serviceId: string,
  includePricing: boolean = false,
) {
  const { logInfo, logError: logErrorUtil } = await import('@/lib/observability')

  logInfo('Starting service rollback', {
    operationName: 'rollbackService',
    serviceId,
    includePricing,
  })

  try {
    // Step 1: Delete pricing if requested
    if (includePricing) {
      logInfo('Attempting to delete service pricing during rollback', {
        operationName: 'rollbackService',
        serviceId,
      })

      const { error: pricingError } = await supabase
        .schema('catalog')
        .from('service_pricing')
        .delete()
        .eq('service_id', serviceId)

      if (pricingError) {
        logErrorUtil('Failed to rollback service pricing', {
          operationName: 'rollbackService',
          serviceId,
          error: pricingError,
          errorCategory: 'database',
        })
        throw new Error(`Pricing rollback failed for service ${serviceId}: ${pricingError.message}`)
      }

      logInfo('Successfully deleted service pricing during rollback', {
        operationName: 'rollbackService',
        serviceId,
      })
    }

    // Step 2: Delete service
    logInfo('Attempting to delete service during rollback', {
      operationName: 'rollbackService',
      serviceId,
    })

    const { error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (serviceError) {
      logErrorUtil('Failed to rollback service', {
        operationName: 'rollbackService',
        serviceId,
        includePricing,
        pricingWasDeleted: includePricing, // Critical: pricing may be orphaned
        error: serviceError,
        errorCategory: 'database',
      })
      throw new Error(`Service rollback failed for service ${serviceId}: ${serviceError.message}`)
    }

    logInfo('Successfully completed service rollback', {
      operationName: 'rollbackService',
      serviceId,
      includePricing,
    })
  } catch (error) {
    // Log complete context for debugging partial rollback scenarios
    logErrorUtil('Rollback operation failed', {
      operationName: 'rollbackService',
      serviceId,
      includePricing,
      error: error instanceof Error ? error : String(error),
      errorCategory: 'system',
    })
    throw error
  }
}
