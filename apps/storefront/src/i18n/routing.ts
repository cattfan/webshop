import { defineRouting } from 'next-intl/routing';
import { storefrontLocales, storefrontDefaultLocale } from '@webshop/i18n';

export const routing = defineRouting({
  locales: [...storefrontLocales],
  defaultLocale: storefrontDefaultLocale,
});
