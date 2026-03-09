import SiteLayout from "@/components/layout/SiteLayout";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}
