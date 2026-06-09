import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button, Card, CardBody, CardTitle } from '@webshop/ui';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('home');

  const features = [
    { title: t('feature1Title'), body: t('feature1Body') },
    { title: t('feature2Title'), body: t('feature2Body') },
    { title: t('feature3Title'), body: t('feature3Body') },
  ];

  return (
    <div className="space-y-20">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-semibold leading-tight tracking-tightish text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-5 max-w-xl text-base text-ink-muted">{t('subtitle')}</p>
        <div className="mt-8">
          <Link href="/products">
            <Button size="lg">{t('cta')}</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="rounded-none border-0 shadow-none">
            <CardBody className="space-y-2">
              <CardTitle>{f.title}</CardTitle>
              <p className="text-sm text-ink-muted">{f.body}</p>
            </CardBody>
          </Card>
        ))}
      </section>
    </div>
  );
}
