/**
 * 站点通用页面布局
 * 供 (static) 和 (dynamic) 路由组共享使用
 */

import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <AppHeader />
      <main className="flex-1 pt-20">{children}</main>
      <AppFooter />
    </div>
  );
}
