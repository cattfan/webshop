import { setRequestLocale } from 'next-intl/server';

export default function AccountPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tightish text-ink">Account</h1>
      <p className="text-sm text-ink-muted">
        Customer dashboard and order history arrive in a later milestone.
      </p>
    </div>
  );
}
