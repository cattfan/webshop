import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './locale-switcher';

export function SiteHeader({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-ink">
          {t('brand')}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/products" className="text-ink hover:text-ink-muted">
            {t('products')}
          </Link>
          <Link href="/account" className="text-ink hover:text-ink-muted">
            {t('account')}
          </Link>
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
