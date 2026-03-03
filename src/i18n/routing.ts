import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // 所有支持的语言
  locales: ['en', 'zh'],
  // 默认语言
  defaultLocale: 'en',
  // 路由前缀模式：默认语言不显示前缀，非默认语言显示前缀
  localePrefix: 'as-needed'
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
