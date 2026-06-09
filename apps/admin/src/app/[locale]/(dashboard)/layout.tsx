import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getMe } from '@/lib/api';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const me = await getMe();
  if (!me) {
    redirect({ href: '/login', locale });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar email={me?.email ?? ''} locale={locale} />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
