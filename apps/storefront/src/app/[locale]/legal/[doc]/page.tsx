import { setRequestLocale } from 'next-intl/server';

export default function LegalPage({
  params: { locale, doc },
}: {
  params: { locale: string; doc: string };
}) {
  setRequestLocale(locale);
  const title = doc === 'refund' ? 'Refund Policy' : 'Terms of Service';
  return (
    <div className="max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold tracking-tightish text-ink">{title}</h1>
      <p className="text-sm text-ink-muted">Policy content will be managed in settings.</p>
    </div>
  );
}
