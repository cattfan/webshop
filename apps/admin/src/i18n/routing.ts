import { defineRouting } from 'next-intl/routing';
import { adminLocales, adminDefaultLocale } from '@webshop/i18n';

export const routing = defineRouting({
  locales: [...adminLocales],
  defaultLocale: adminDefaultLocale,
});
