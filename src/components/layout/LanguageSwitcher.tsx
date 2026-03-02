'use client';
import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    localStorage.setItem('preferred-locale', newLocale);
    document.cookie = `preferred-locale=${newLocale};path=/;max-age=31536000`;
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <button
      onClick={toggleLocale}
      className="text-gray-600 hover:text-gray-900 text-sm font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
      aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {locale === 'zh' ? 'EN' : '中文'}
    </button>
  );
}
