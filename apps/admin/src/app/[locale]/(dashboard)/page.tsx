import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardBody } from '@webshop/ui';
import { getAdminOrders, getAdminProducts } from '@/lib/api';

export default async function OverviewPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('overview');
  const [orders, products] = await Promise.all([
    getAdminOrders(),
    getAdminProducts(locale),
  ]);

  const pending = (orders ?? []).filter((o) =>
    ['PENDING_PAYMENT', 'AWAITING_OPERATOR', 'PROCESSING'].includes(o.status),
  ).length;

  const stats = [
    { label: t('orders'), value: orders?.length ?? 0 },
    { label: t('products'), value: products?.length ?? 0 },
    { label: t('pending'), value: pending },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tightish">{t('title')}</h1>
        <p className="text-sm text-neutral-500">{t('subtitle')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <div className="text-xs uppercase tracking-wide text-neutral-500">{s.label}</div>
              <div className="mt-2 text-3xl font-semibold tracking-tightish">{s.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
