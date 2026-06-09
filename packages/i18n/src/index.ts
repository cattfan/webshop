/** Locale configuration shared across apps. */

export const storefrontLocales = ['en', 'cn'] as const;
export type StorefrontLocale = (typeof storefrontLocales)[number];
export const storefrontDefaultLocale: StorefrontLocale = 'en';

export const adminLocales = ['vi', 'en', 'cn'] as const;
export type AdminLocale = (typeof adminLocales)[number];
export const adminDefaultLocale: AdminLocale = 'vi';

export const localeNames: Record<string, string> = {
  en: 'English',
  cn: '中文',
  vi: 'Tiếng Việt',
};
