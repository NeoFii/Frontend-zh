import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://eucal.ai'),
  title: {
    template: "%s - Eucal AI",
    default: "Eucal AI",
  },
  description: "智能分层推理引擎，为企业降低 AI 推理成本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
