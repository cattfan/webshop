import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge, Table, THead, TH, TR, TD } from '@webshop/ui';
import { getAdminOrders } from '@/lib/api';

export default async function OrdersPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('orders');
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tightish">{t('title')}</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-sm text-neutral-500">{t('empty')}</p>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>{t('orderNo')}</TH>
              <TH>{t('customer')}</TH>
              <TH>{t('status')}</TH>
              <TH>{t('total')}</TH>
              <TH>{t('date')}</TH>
            </TR>
          </THead>
          <tbody>
            {orders.map((o) => (
              <TR key={o.id}>
                <TD className="font-mono text-xs">{o.orderNo}</TD>
                <TD>{o.customer.email}</TD>
                <TD>
                  <Badge>{o.status.replace(/_/g, ' ')}</Badge>
                </TD>
                <TD>${o.totalUsd}</TD>
                <TD className="text-neutral-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
