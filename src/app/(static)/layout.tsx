import { getTranslation } from '@/lib/translations'
import type { Metadata } from 'next'
import SiteLayout from "@/components/layout/SiteLayout";

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
  return <SiteLayout>{children}</SiteLayout>;
}
