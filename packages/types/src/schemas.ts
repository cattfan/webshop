import { z } from 'zod';
import { DeliveryType } from './enums.js';

/** Auth */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(80),
});
export type RegisterInput = z.infer<typeof registerSchema>;

/** Orders */
export const createOrderItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1),
  locale: z.string().min(2).max(5).optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/** Fulfillment info submitted by customer (values only; encrypted server-side). */
export const submitInfoSchema = z.object({
  fields: z.record(z.string(), z.string().max(2000)),
});
export type SubmitInfoInput = z.infer<typeof submitInfoSchema>;

/** Money is always represented as a decimal string to avoid float errors. */
export const moneySchema = z
  .string()
  .regex(/^\d+(\.\d{1,6})?$/, 'Invalid money amount');

export const deliveryTypeSchema = z.nativeEnum(DeliveryType);
