import 'server-only';
export { getProducts, getProduct, getLowStockProducts } from './queries/products'
export { getProductCategories } from './queries/categories'
export { getStockLevels, getStockAlerts } from './queries/stock'
export { getSuppliers } from './queries/suppliers'
export { getPurchaseOrders } from './queries/purchase-orders'
export { getInventoryStats, getInventorySalon } from './queries/stats'
export type {
  ProductWithRelations,
  StockLevelWithProduct,
  StockAlertWithProduct,
  PurchaseOrderWithSupplier,
} from './queries/types'
