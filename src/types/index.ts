export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export type {
  LoginParams,
  RegisterParams,
  User,
  UserInfo,
  AuthSessionData,
  LoginResponse,
  RegisterResponse,
  SendCodeResponse,
  LogoutResponse,
  UserInfoResponse,
} from '@/lib/api/auth'

export type {
  RouterApiKey,
  RouterBillingLedgerItem,
  RouterUsageEvent,
  RouterUsageSummary,
} from '@/lib/api/router'

export type {
  ModelVendor,
  ModelVendorBrief,
  ModelCategory,
  ModelCategoryBrief,
  Provider,
  OfferingMetrics,
  ModelOffering,
  ModelListItem,
  ModelDetail,
  PagedResponse,
} from '@/types/model'
