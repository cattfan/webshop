import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function SiteFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          &copy; {year} WEBSHOP. {t('rights')}
        </span>
        <div className="flex gap-4">
          <Link href="/legal/terms" className="hover:text-ink">
            {t('terms')}
          </Link>
          <Link href="/legal/refund" className="hover:text-ink">
            {t('refund')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
