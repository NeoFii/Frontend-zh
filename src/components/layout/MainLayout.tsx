import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * 主布局组件
 * 用于静态页面和动态页面（登录后）
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 pt-20">{children}</main>
      <AppFooter />
    </>
  );
}
