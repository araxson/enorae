export type {
  Salon,
  Appointment,
  AppointmentService,
  Service,
  Staff,
  StaffProfile,
  Profile,
  UserRole,
} from './app/core'

export type {
  AppointmentWithDetails,
  BlockedTime,
  StaffSchedule,
  StaffService,
  OperatingHour,
} from './app/scheduling'

export type {
  MessageThread,
  Message,
  WebhookQueue,
  NotificationQueueEntry,
} from './app/communication'

export type {
  CustomerFavorite,
  CustomerFavoriteView,
} from './app/engagement'

export type {
  DailyMetric,
  OperationalMetric,
  ManualTransaction,
} from './app/analytics'

export type {
  Product,
  ProductCategory,
  ProductUsage,
  PurchaseOrder,
  PurchaseOrderItem,
  StockAlert,
  StockLevel,
  StockLocation,
  StockMovement,
  Supplier,
} from './app/inventory'

export type {
  Salon as OrganizationSalon,
  SalonView,
  AdminSalon,
  SalonLocation,
  LocationAddress,
  SalonChain,
  SalonMetric,
  SalonMedia,
  Staff as OrganizationStaff,
  StaffView,
} from './app/organization'

export type {
  ServiceCategory,
  ServicePricing,
  ServiceProductUsage,
  BookingRule,
  SalonSettings,
  SalonContactDetails,
  SalonDescription,
} from './app/catalog'

export type {
  ProfileMetadata,
  ProfilePreference,
} from './app/identity'

export type {
  AppointmentInsert,
  AppointmentUpdate,
  AppointmentServiceInsert,
} from './app/mutations'

export type { WithClassName, WithChildren, WithOptionalChildren } from './app/components'
export type { PageProps, LayoutProps } from './app/page'
export type { ApiResponse, ApiError, PaginatedResponse } from './app/api'
export type { FormState } from './app/forms'
export type {
  ButtonClickHandler,
  DivClickHandler,
  FormSubmitHandler,
  InputChangeHandler,
  TextAreaChangeHandler,
  SelectChangeHandler,
  KeyboardHandler,
  FocusHandler,
} from './app/events'
export type { Nullable, Optional, MaybeNull, PickExact, PartialBy, RequiredBy } from './app/utility'
