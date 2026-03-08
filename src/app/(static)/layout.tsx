import { getTranslation } from '@/lib/translations'
import type { Metadata } from 'next'
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = getTranslation('home')

  return {
    title: `${t('hero.title')} ${t('hero.titleHighlight')} - Eucal AI`,
    description: t('hero.subtitle'),
  }
}

export default function StaticLayout({
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
