import MainLayout from "@/components/layout/MainLayout";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
