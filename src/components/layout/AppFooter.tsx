import Link from 'next/link'
import { BrandLogo } from '@/components/brand/BrandLogo'

interface NavItem { name: string; path: string }

export default function AppFooter() {

  // 使用相对路径
  const quickLinks: NavItem[] = [
    { name: '关于我们', path: '/about' },
    { name: '登录', path: '/login' },
  ]

  return (
    <footer className="bg-gray-900" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <BrandLogo size="md" markTone="inverse" className="mb-4" labelClassName="text-white" />
            <p className="text-gray-400 mb-4 max-w-sm">
              致力于为企业提供高性能 AI 推理优化方案，推动智能化转型。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">快速链接</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">联系方式</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>北京市朝阳区科技园区88号</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@eucal.ai</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>400-888-8888</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 Eucal AI. 保留所有权利。
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
            <Link href="/agreement" className="hover:text-white transition-colors">服务条款</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
