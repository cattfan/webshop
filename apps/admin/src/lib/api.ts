import { cookies } from 'next/headers';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const cookieHeader = cookies().toString();
    const res = await fetch(`${API_URL}${path}`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
}

export interface AdminOrder {
  id: string;
  orderNo: string;
  status: string;
  totalUsd: string;
  itemCount: number;
  customer: { email: string; displayName: string };
  assignedOperatorId: string | null;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  slug: string;
  deliveryType: string;
  priceUsd: string;
  name: string;
}

export function getMe(): Promise<AdminUser | null> {
  return apiGet<AdminUser>('/auth/me');
}

export function getAdminOrders(): Promise<AdminOrder[] | null> {
  return apiGet<AdminOrder[]>('/admin/orders');
}

export function getAdminProducts(locale: string): Promise<AdminProduct[] | null> {
  return apiGet<AdminProduct[]>(`/products?locale=${encodeURIComponent(locale)}`);
}
