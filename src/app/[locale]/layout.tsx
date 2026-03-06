import type { Metadata, Viewport } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "@/app/globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    metadataBase: new URL('https://eucal.ai'),
    title: {
      template: "%s - Eucal AI",
      default: isZh ? "Eucal AI - 智能分层推理引擎" : "Eucal AI - Intelligent Tiered Inference Engine",
    },
    description: isZh
      ? "Eucal AI 是一款面向大模型应用的高性能推理优化平台，通过智能分层缓存、动态模型路由和高可用架构，帮助企业降低70%的AI推理成本。"
      : "Eucal AI is a high-performance inference optimization platform for LLM applications, helping enterprises reduce AI inference costs by 70% through smart tiered caching, dynamic model routing, and high-availability architecture.",
    keywords: isZh
      ? ["AI推理优化", "大模型", "TierFlow", "智能缓存", "模型路由", "LLM", "人工智能", "API优化"]
      : ["AI inference optimization", "LLM", "TierFlow", "smart caching", "model routing", "AI", "API optimization"],
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
      locale: isZh ? "zh_CN" : "en_US",
      url: "https://eucal.ai",
      siteName: "Eucal AI",
      title: isZh ? "Eucal AI - 智能分层推理引擎" : "Eucal AI - Intelligent Tiered Inference Engine",
      description: isZh
        ? "面向大模型应用的高性能推理优化平台，帮助企业降低70%的AI推理成本。"
        : "High-performance inference optimization platform for LLM applications, helping enterprises reduce AI inference costs by 70%.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isZh ? "Eucal AI - 智能分层推理引擎" : "Eucal AI - Intelligent Tiered Inference Engine",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isZh ? "Eucal AI - 智能分层推理引擎" : "Eucal AI - Intelligent Tiered Inference Engine",
      description: isZh
        ? "面向大模型应用的高性能推理优化平台，帮助企业降低70%的AI推理成本。"
        : "High-performance inference optimization platform for LLM applications, helping enterprises reduce AI inference costs by 70%.",
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
        "zh": "https://eucal.ai/zh",
        "en": "https://eucal.ai/en",
      },
    },
    category: "technology",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale}>
        <head>
          {/* 预连接外部资源 */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
    </NextIntlClientProvider>
  );
}
