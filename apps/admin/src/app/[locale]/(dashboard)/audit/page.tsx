import { setRequestLocale } from 'next-intl/server';
import { Placeholder } from '@/components/placeholder';

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Placeholder title="Audit logs" />;
}
