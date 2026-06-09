'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@webshop/ui';
import { API_URL } from '@/lib/client';
import { adminLocales, localeNames } from '@webshop/i18n';
import { usePathname } from '@/i18n/navigation';

export function Topbar({ email, locale }: { email: string; locale: string }) {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-paper px-8">
      <div className="text-sm text-neutral-500">{email}</div>
      <div className="flex items-center gap-3">
        <select
          aria-label="Language"
          value={locale}
          onChange={(e) => router.replace(pathname, { locale: e.target.value })}
          className="h-8 rounded-sm border border-line-strong bg-paper px-2 text-xs"
        >
          {adminLocales.map((loc) => (
            <option key={loc} value={loc}>
              {localeNames[loc] ?? loc}
            </option>
          ))}
        </select>
        <Button variant="secondary" size="sm" onClick={logout}>
          {t('logout')}
        </Button>
      </div>
    </header>
  );
}
