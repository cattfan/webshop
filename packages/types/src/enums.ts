/**
 * Canonical enum values shared across API and frontends.
 * These are the single source of truth and must match the Prisma schema.
 */

export const Role = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  CUSTOMER: 'CUSTOMER',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const DeliveryType = {
  INSTANT_ACCOUNT: 'INSTANT_ACCOUNT',
  INSTANT_KEY: 'INSTANT_KEY',
  MANUAL_SERVICE: 'MANUAL_SERVICE',
  INVITE_SLOT: 'INVITE_SLOT',
  CUSTOM_ORDER: 'CUSTOM_ORDER',
} as const;
export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType];

export const OrderStatus = {
  DRAFT: 'DRAFT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_EXPIRED: 'PAYMENT_EXPIRED',
  PAID: 'PAID',
  AWAITING_CUSTOMER_INFO: 'AWAITING_CUSTOMER_INFO',
  AWAITING_OPERATOR: 'AWAITING_OPERATOR',
  PROCESSING: 'PROCESSING',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  WARRANTY_REQUESTED: 'WARRANTY_REQUESTED',
  REFUND_PENDING: 'REFUND_PENDING',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  CREATED: 'CREATED',
  WAITING: 'WAITING',
  CONFIRMED: 'CONFIRMED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  MANUALLY_REVIEWED: 'MANUALLY_REVIEWED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const InventoryStatus = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  DISABLED: 'DISABLED',
  REPLACED: 'REPLACED',
} as const;
export type InventoryStatus = (typeof InventoryStatus)[keyof typeof InventoryStatus];

export const AdminLocale = {
  VI: 'vi',
  EN: 'en',
  CN: 'cn',
} as const;
export type AdminLocale = (typeof AdminLocale)[keyof typeof AdminLocale];

export const StorefrontLocale = {
  EN: 'en',
  CN: 'cn',
} as const;
export type StorefrontLocale = (typeof StorefrontLocale)[keyof typeof StorefrontLocale];
