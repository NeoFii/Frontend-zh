import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

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
