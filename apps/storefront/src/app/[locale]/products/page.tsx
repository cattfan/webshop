import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge, Card, CardBody, CardTitle } from '@webshop/ui';
import { getProducts } from '@/lib/api';

export default async function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const products = await getProducts(locale);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tightish text-ink">{t('title')}</h1>

      {!products || products.length === 0 ? (
        <p className="text-sm text-ink-muted">{t('empty')}</p>
      ) : (
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`}>
              <Card className="h-full rounded-none border-0 shadow-none transition-colors hover:bg-paper-soft">
                <CardBody className="flex h-full flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{p.name}</CardTitle>
                    <Badge>{p.deliveryType.replace(/_/g, ' ')}</Badge>
                  </div>
                  {p.shortDesc ? (
                    <p className="text-sm text-ink-muted">{p.shortDesc}</p>
                  ) : null}
                  <div className="mt-auto pt-2 text-sm font-medium text-ink">
                    {t('from')} ${p.priceUsd}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
