import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://eucal.ai'),
  title: {
    template: "%s - Eucal AI",
    default: "Eucal AI - 智能分层推理引擎",
  },
  description: "Eucal AI（Eucal AI）是一款面向大模型应用的高性能推理优化平台，通过智能分层缓存、动态模型路由和高可用架构，帮助企业降低70%的AI推理成本。",
  keywords: ["AI推理优化", "大模型", "TierFlow", "智能缓存", "模型路由", "LLM", "人工智能", "API优化"],
  authors: [{ name: "Eucal AI" }],
  creator: "Eucal AI",
  publisher: "Eucal AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://eucal.ai",
    siteName: "Eucal AI",
    title: "Eucal AI - 智能分层推理引擎",
    description: "面向大模型应用的高性能推理优化平台，帮助企业降低70%的AI推理成本。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eucal AI - 智能分层推理引擎",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eucal AI - 智能分层推理引擎",
    description: "面向大模型应用的高性能推理优化平台，帮助企业降低70%的AI推理成本。",
    images: ["/og-image.png"],
    creator: "@eucalai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://eucal.ai",
    languages: {
      "zh-CN": "https://eucal.ai",
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预连接外部资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* 预加载关键资源 */}
        <link rel="preload" href="/fonts/misans.css" as="style" />

        {/* favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Eucal AI",
              "url": "https://eucal.ai",
              "logo": "https://eucal.ai/logo.png",
              "description": "智能分层推理引擎，为企业降低 AI 推理成本",
              "sameAs": [
                "https://twitter.com/eucalai",
                "https://github.com/NeoFii"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-white text-gray-800">
        {children}
      </body>
    </html>
  );
}
