import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Badge, Button, Card, CardBody, CardHeader, CardTitle } from '@webshop/ui';
import { getProduct } from '@/lib/api';

export default async function ProductDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('product');
  const product = await getProduct(slug, locale);

  if (!product) notFound();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>{product.deliveryType.replace(/_/g, ' ')}</Badge>
          <h1 className="text-3xl font-semibold tracking-tightish text-ink">{product.name}</h1>
          {product.shortDesc ? (
            <p className="text-base text-ink-muted">{product.shortDesc}</p>
          ) : null}
        </div>
        {product.longDesc ? (
          <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-ink-soft">
            {product.longDesc}
          </div>
        ) : null}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{t('variants')}</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {product.variants.length === 0 ? (
            <div className="text-2xl font-semibold text-ink">${product.priceUsd}</div>
          ) : (
            product.variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between border-b border-line pb-3 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-ink">{v.name}</div>
                  {v.durationDays ? (
                    <div className="text-xs text-neutral-500">{v.durationDays} days</div>
                  ) : null}
                </div>
                <div className="text-sm font-semibold text-ink">${v.priceUsd}</div>
              </div>
            ))
          )}
          <Button className="w-full" disabled>
            {t('buy')}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
