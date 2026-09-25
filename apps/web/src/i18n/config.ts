export const locales = [\n  "en",\n  "es",\n  "fr",\n  "de",\n  "ja",\n  "ko",\n  "pt-BR",\n  "fa",\n] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Strip the locale prefix from a raw pathname (e.g. from window.location.pathname).
 * Useful in non-React contexts where the usePathname hook is unavailable.
 */
export function stripLocalePrefix(pathname: string): string {
  for (const locale of locales) {
    const prefix = `/${locale}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}
