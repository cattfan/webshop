const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface ProductListItem {
  id: string;
  slug: string;
  deliveryType: string;
  priceUsd: string;
  name: string;
  shortDesc: string | null;
  category: { slug: string; name: string } | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  priceUsd: string;
  durationDays: number | null;
  name: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  deliveryType: string;
  priceUsd: string;
  name: string;
  shortDesc: string | null;
  longDesc: string | null;
  variants: ProductVariant[];
}

async function safeFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getProducts(locale: string): Promise<ProductListItem[] | null> {
  return safeFetch<ProductListItem[]>(`/products?locale=${encodeURIComponent(locale)}`);
}

export function getProduct(slug: string, locale: string): Promise<ProductDetail | null> {
  return safeFetch<ProductDetail>(
    `/products/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
  );
}
