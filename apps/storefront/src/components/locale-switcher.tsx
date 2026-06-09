'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { storefrontLocales, localeNames } from '@webshop/i18n';

export function LocaleSwitcher({ current }: { current: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      aria-label="Language"
      value={current}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="h-8 rounded-sm border border-line-strong bg-paper px-2 text-xs text-ink"
    >
      {storefrontLocales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc] ?? loc}
        </option>
      ))}
    </select>
  );
}
