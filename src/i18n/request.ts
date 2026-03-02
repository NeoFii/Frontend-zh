import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // 优先从 URL 获取 locale
  let locale = await requestLocale;

  // 如果 URL 没有 locale，从 cookie 读取用户偏好
  if (!locale) {
    const cookieStore = await cookies();
    const preferredLocale = cookieStore.get('preferred-locale')?.value;
    if (preferredLocale && routing.locales.includes(preferredLocale as any)) {
      locale = preferredLocale;
    }
  }

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
