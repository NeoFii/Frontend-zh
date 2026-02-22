'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from '@/types'

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Eucal AI'

const navItems: NavItem[] = [
  {
    name: '产品服务',
    path: '',
    children: [
      { name: 'TierFlow', path: '/products/tierflow' },
    ],
  },
  { name: '开放平台', path: '/platform' },
  { name: '新闻动态', path: '/news' },
  { name: '关于我们', path: '/about' },
]

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 在页面顶部时显示导航栏
      if (currentScrollY < 10) {
        setIsHidden(false)
      } else if (currentScrollY > lastScrollY) {
        // 向下滚动 - 隐藏导航栏
        setIsHidden(true)
      } else {
        // 向上滚动 - 显示导航栏
        setIsHidden(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const isActive = (path: string) => pathname === path
  const isChildActive = (children?: NavItem[]) =>
    children?.some((child) => pathname === child.path)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-transform duration-300 ${
        isHidden ? '-translate-y-full' : ''
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center h-20">
          {/* Logo + Navigation 左侧组 */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight font-sans">
                {companyName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-10">
              {navItems.map((item) =>
                item.children && item.children.length > 0 ? (
                  <div key={item.name} className="relative group">
                    <button
                      className={`flex items-center px-3 py-2 text-[15.5px] font-medium tracking-wide transition-colors duration-200 rounded-lg hover:bg-gray-50/50 ${
                        isChildActive(item.children)
                          ? 'text-gray-900'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {item.name}
                      <svg
                        className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {/* 下拉菜单 */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[100px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`block px-3 py-1.5 text-center text-[14px] font-medium transition-colors duration-150 ${
                              isActive(child.path)
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 text-[15.5px] font-medium tracking-wide transition-colors duration-200 rounded-lg hover:bg-gray-50/50 ${
                      isActive(item.path)
                        ? 'text-gray-900'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Spacer 占据剩余空间 */}
          <div className="flex-1"></div>

          {/* CTA Button 右侧 */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="px-5 py-2.5 bg-gray-900 text-white text-[15px] font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              登录
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {!isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-1">
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
                          onClick={closeMenu}
                          className={`block px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
                            isActive(child.path)
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
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
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block w-full text-center px-4 py-3 bg-gray-900 text-white rounded-lg text-[15px] font-semibold"
                >
                  登录
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
