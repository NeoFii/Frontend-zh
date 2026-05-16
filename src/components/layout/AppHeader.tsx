'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { useAuthStore } from '@/stores/auth'
import { useUser } from '@/hooks/useUser'

interface NavItem { name: string; path: string; children?: NavItem[]; external?: boolean }

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TierFlow'

export default function AppHeader() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useUser({ enabled: true })
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const isLoggedIn = sessionStatus === 'authenticated'

  // 动态导航项
  const navItems: NavItem[] = [
    { name: '模型', path: '/model' },
    { name: '价格', path: '/price' },
    {
      name: '文档中心',
      path: 'https://neofii.github.io/TierFlow-Doc/',
      external: true,
    },
    { name: '生态合作', path: '/ecosystem' },
    { name: '关于我们', path: '/about' },
  ]

  // 处理登录按钮点击
  const handleAuthClick = () => {
    router.push(isLoggedIn ? '/console' : '/login')
  }

  // 滚动处理
  useEffect(() => {
    let lastScrollY = 0
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // 滚动状态
          setIsScrolled(currentScrollY > 20)

          // 隐藏/显示逻辑
          if (currentScrollY < 10) {
            setIsHidden(false)
          } else if (currentScrollY > lastScrollY) {
            // 向下滚动 - 隐藏
            if (currentScrollY > 100) {
              setIsHidden(true)
            }
          } else {
            // 向上滚动 - 显示
            setIsHidden(false)
          }

          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 关闭移动端菜单
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const isActive = (path: string) => pathname === path
  const isChildActive = (children?: NavItem[]) =>
    children?.some((child) => pathname === child.path)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50'
          : 'bg-white/80 backdrop-blur-md'
      } border-b ${
        isScrolled ? 'border-gray-100/80' : 'border-transparent'
      }`}
      style={{ fontFamily: 'MiSans, sans-serif' }}
    >
      <div className="container-custom">
        <nav className="flex items-center h-20">
          {/* Logo + Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <BrandLogo
                label={companyName}
                labelClassName="text-gray-900 font-sans group-hover:text-primary-600 transition-colors duration-300"
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center ml-12">
              {navItems.map((item) =>
                item.children && item.children.length > 0 ? (
                  <div key={item.name} className="relative group">
                    <button
                      className={`flex items-center px-4 py-2 text-[15px] font-medium tracking-wide transition-all duration-200 rounded-lg hover:bg-gray-50/80 ${
                        isChildActive(item.children)
                          ? 'text-gray-900 bg-gray-50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.name}
                      <svg
                        className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* 下拉菜单 */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-250 transform origin-top -translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 py-2 min-w-[140px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`block px-4 py-2.5 text-[14px] font-medium transition-all duration-150 ${
                              isActive(child.path)
                                ? 'text-primary-600 bg-primary-50/80'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : item.external ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-[15px] font-medium tracking-wide transition-all duration-200 rounded-lg hover:bg-gray-50/80 text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 text-[15px] font-medium tracking-wide transition-all duration-200 rounded-lg hover:bg-gray-50/80 ${
                      isActive(item.path)
                        ? 'text-gray-900 bg-gray-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleAuthClick}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-transparent bg-gradient-to-r from-[#3b56ff] to-[#4a3dff] px-8 py-[14px] text-base font-semibold text-white shadow-[0_10px_24px_rgba(60,80,255,0.28)] transition hover:-translate-y-px hover:shadow-[0_14px_32px_rgba(60,80,255,0.36)]"
            >
              {isLoggedIn ? '控制台' : '登录'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
          >
            {!isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-1 pt-2 border-t border-gray-100/50">
            {navItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <div key={item.name}>
                  <div className="px-4 py-3 text-gray-700 text-[15px] font-medium tracking-wide">
                    {item.name}
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        href={child.path}
                        className={`block px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
                          isActive(child.path)
                            ? 'text-primary-600 bg-primary-50/80'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 text-[15px] font-medium tracking-wide hover:bg-gray-50 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-3 text-[15px] font-medium tracking-wide hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-3 mt-2 border-t border-gray-100/50">
              <button
                onClick={handleAuthClick}
                className="block w-full text-center rounded-[12px] bg-gradient-to-r from-[#3b56ff] to-[#4a3dff] px-8 py-[14px] text-base font-semibold text-white shadow-[0_10px_24px_rgba(60,80,255,0.28)] transition hover:-translate-y-px hover:shadow-[0_14px_32px_rgba(60,80,255,0.36)]"
              >
                {isLoggedIn ? '控制台' : '登录'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
