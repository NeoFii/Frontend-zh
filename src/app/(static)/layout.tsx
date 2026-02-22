import MainLayout from "@/components/layout/MainLayout";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
