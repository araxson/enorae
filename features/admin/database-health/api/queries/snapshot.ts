import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getQueryPerformance } from './query-performance'
import { getDatabaseHealth } from './database-health'
import { getSchemaValidation } from './schema-validation'
import { getOptimizationRecommendations } from './optimization'
import { getNotificationQueue } from './notification-queue'
import { createOperationLogger } from '@/lib/observability/logger'

export interface DatabaseHealthFullSnapshot {
  queryPerformance: Awaited<ReturnType<typeof getQueryPerformance>>
  databaseHealth: Awaited<ReturnType<typeof getDatabaseHealth>>
  schemaValidation: Awaited<ReturnType<typeof getSchemaValidation>>
  optimization: Awaited<ReturnType<typeof getOptimizationRecommendations>>
  notificationQueue: Awaited<ReturnType<typeof getNotificationQueue>>
  overallStatus: {
    healthScore: number
    criticalIssues: number
    warnings: number
    recommendations: number
  }
}

export async function getDatabaseHealthSnapshot(
  options: {
    queryLimit?: number
    includeNotificationQueue?: boolean
  } = {}
): Promise<DatabaseHealthFullSnapshot> {
  const logger = createOperationLogger('getDatabaseHealthSnapshot', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const { queryLimit = 50, includeNotificationQueue = true } = options

  const [
    queryPerformance,
    databaseHealth,
    schemaValidation,
    optimization,
    notificationQueue,
  ] = await Promise.all([
    getQueryPerformance(queryLimit),
    getDatabaseHealth(queryLimit),
    getSchemaValidation(),
    getOptimizationRecommendations(100),
    includeNotificationQueue ? getNotificationQueue(100) : null,
  ])

  // Calculate overall health score (0-100)
  let healthScore = 100

  // Deduct points for issues
  const criticalIssues =
    schemaValidation.summary.criticalSecurityIssues +
    optimization.summary.criticalRecommendations +
    (queryPerformance.summary.totalSlowQueries > 10 ? 1 : 0)

  const warnings =
    databaseHealth.summary.totalBloatedTables +
    databaseHealth.summary.lowCacheHitTables +
    queryPerformance.summary.totalHighCallQueries

  healthScore -= criticalIssues * 10
  healthScore -= warnings * 2
  healthScore = Math.max(0, Math.min(100, healthScore))

  return {
    queryPerformance,
    databaseHealth,
    schemaValidation,
    optimization,
    notificationQueue: notificationQueue ?? {
      queueItems: [],
      summary: {
        totalPending: 0,
        oldestPending: null,
        notificationsByType: {},
        channelDistribution: {},
      },
    },
    overallStatus: {
      healthScore,
      criticalIssues,
      warnings,
      recommendations: optimization.summary.totalRecommendations,
    },
  }
}
