import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // 所有支持的语言
  locales: ['en', 'zh'],
  // 默认语言
  defaultLocale: 'en'
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
