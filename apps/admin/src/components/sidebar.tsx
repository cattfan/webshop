'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@webshop/ui';

const items = [
  { href: '/', key: 'overview' },
  { href: '/orders', key: 'orders' },
  { href: '/fulfillment', key: 'fulfillment' },
  { href: '/products', key: 'products' },
  { href: '/inventory', key: 'inventory' },
  { href: '/payments', key: 'payments' },
  { href: '/customers', key: 'customers' },
  { href: '/operators', key: 'operators' },
  { href: '/audit', key: 'audit' },
  { href: '/settings', key: 'settings' },
] as const;

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-paper md:block">
      <div className="flex h-16 items-center border-b border-line px-6">
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">Webshop</span>
      </div>
      <nav className="flex flex-col p-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-sm px-3 py-2 text-sm transition-colors',
                active ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-soft',
              )}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
