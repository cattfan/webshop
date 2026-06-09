import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge, Table, THead, TH, TR, TD } from '@webshop/ui';
import { getAdminProducts } from '@/lib/api';

export default async function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const products = await getAdminProducts(locale);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tightish">{t('title')}</h1>

      {!products || products.length === 0 ? (
        <p className="text-sm text-neutral-500">{t('empty')}</p>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>{t('name')}</TH>
              <TH>{t('type')}</TH>
              <TH>{t('price')}</TH>
            </TR>
          </THead>
          <tbody>
            {products.map((p) => (
              <TR key={p.id}>
                <TD>{p.name}</TD>
                <TD>
                  <Badge>{p.deliveryType.replace(/_/g, ' ')}</Badge>
                </TD>
                <TD>${p.priceUsd}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
