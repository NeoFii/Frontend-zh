import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

export default function DynamicLayout({
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
