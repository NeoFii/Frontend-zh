import type { Metadata } from 'next'
import SiteLayout from "@/components/layout/SiteLayout";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '一个接口 主流大模型 - Eucal AI',
    description: '只需替换 BASE URL，即可通过统一接口访问所有主流大模型',
  }
}

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}
