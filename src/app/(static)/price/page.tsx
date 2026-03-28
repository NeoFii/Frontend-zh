'use client'

import { useTranslation } from '@/hooks/useTranslation'
import messages from '@/messages/zh.json'
import { useEffect, useState } from 'react'

// 定义进入动画的 Tailwind 类组合
const animationClasses = {
  container: 'transition-all duration-1000 ease-out',
  hidden: 'opacity-0 translate-y-12',
  visible: 'opacity-100 translate-y-0',
}

export default function PricePage() {
  const { t } = useTranslation('price')
  const freeFeatures = messages.price.free.features
  const proFeatures = messages.price.pro.features
  const enterpriseFeatures = messages.price.enterprise.features

  // 用于触发页面进入动画的状态
  const [isLoaded, setIsLoaded] = useState(false)

  // 页面加载后触发动画
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 处理升级按钮的点击：先看动画，再跳转
  const handleUpgradeClick = () => {
    setTimeout(() => {
      window.location.href = '/login'
    }, 1500)
  }

  return (
    <main className="relative flex flex-col items-center w-full overflow-hidden flex-1 pb-[160px] min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- 背景光晕装饰 (Glow Background) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-40 pointer-events-none -z-10 flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      {/* --- 1. 标题区域 (Hero Section) --- */}
      <div
        className={`relative z-10 px-6 lg:px-0 w-full max-w-[1000px] flex flex-col items-center mt-[80px] mb-[48px] ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-200`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-600 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Transparent Pricing
        </div>

        <h1 className="m-0 p-0 text-center text-5xl md:text-6xl font-extrabold tracking-tight leading-tight pb-4 max-w-[900px]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            {t('title')}
          </span>
        </h1>

        <div className="flex flex-col items-center max-w-[700px] space-y-2 mt-4">
          <p className="text-slate-800 text-lg md:text-xl font-medium text-center">
            {t('subtitle')}
          </p>
          <p className="text-slate-500 text-base font-normal leading-relaxed text-center">
            {t('description')}
          </p>
        </div>
      </div>

      {/* --- 2. 价格方案 (Pricing Cards) --- */}
      <div
        className={`relative z-10 w-full px-6 lg:px-0 max-w-[1200px] ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-500`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

          {/* 免费版 (Free) */}
          <div className="flex flex-col bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer hover:shadow-2xl hover:shadow-slate-200/60">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('free.name')}</h3>
              <p className="text-sm text-slate-500 min-h-[40px]">{t('free.description')}</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight text-slate-900">{t('free.price')}</span>
              <span className="text-base text-slate-500 font-medium ml-1">{t('free.period')}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {freeFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-200">
                  <svg className="w-5 h-5 text-blue-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="/login"
              className="block w-full text-center py-3.5 bg-slate-100 text-slate-700 rounded-xl text-base font-semibold hover:bg-slate-200 transition-all duration-200 active:scale-[0.98]"
            >
              {t('free.cta')}
            </a>
          </div>

          {/* 专业版 (Pro - 高亮且有动画效果) */}
          <div
            className={`flex flex-col bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-2xl shadow-blue-500/10 hover:-translate-y-2 transition-transform duration-300 relative group cursor-pointer hover:shadow-blue-500/20 ${animationClasses.container
              } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-500`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-blue-100/30 to-violet-50/20 animate-bg-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-md z-10">
              推荐方案
            </div>
            <div className="mb-6 mt-2 relative z-10">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('pro.name')}</h3>
              <p className="text-sm text-slate-500 min-h-[40px] group-hover:text-slate-600 transition-colors duration-200">{t('pro.description')}</p>
            </div>
            <div className="mb-8 relative z-10">
              <span className="text-5xl font-bold tracking-tight text-slate-900">{t('pro.price')}</span>
              <span className="text-base text-slate-500 font-medium ml-1">{t('pro.period')}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {proFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-200">
                  <svg className="w-5 h-5 text-blue-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            {/* --- 替换的新版动画升级按钮 --- */}
            <div className="relative z-10 w-full">
              <button className="upgrade-btn w-full mt-auto" onClick={handleUpgradeClick}>
                <div className="outline"></div>
                <div className="state state--default">
                  <div className="icon">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g style={{ filter: 'url(#shadow)' }}>
                        <path d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z" fill="currentColor"></path>
                        <path d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z" fill="currentColor"></path>
                      </g>
                      <defs>
                        <filter id="shadow">
                          <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.5"></feDropShadow>
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <p>
                    <span style={{ '--i': 0 } as React.CSSProperties}>立</span>
                    <span style={{ '--i': 1 } as React.CSSProperties}>即</span>
                    <span style={{ '--i': 2 } as React.CSSProperties}>升</span>
                    <span style={{ '--i': 3 } as React.CSSProperties}>级</span>
                  </p>
                </div>
                <div className="state state--sent">
                  <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="1em" width="1em" strokeWidth="0.5px" stroke="black">
                      <g style={{ filter: 'url(#shadow)' }}>
                        <path fill="currentColor" d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"></path>
                        <path fill="currentColor" d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C10.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"></path>
                      </g>
                    </svg>
                  </div>
                  <p>
                    <span style={{ '--i': 5 } as React.CSSProperties}>前</span>
                    <span style={{ '--i': 6 } as React.CSSProperties}>往</span>
                    <span style={{ '--i': 7 } as React.CSSProperties}>升</span>
                    <span style={{ '--i': 8 } as React.CSSProperties}>级</span>
                  </p>
                </div>
              </button>
            </div>
            {/* --- 按钮结束 --- */}
          </div>

          {/* 企业版 (Enterprise) */}
          <div
            className={`flex flex-col bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer hover:shadow-2xl hover:shadow-slate-200/60 ${animationClasses.container
              } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-500`}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('enterprise.name')}</h3>
              <p className="text-sm text-slate-500 min-h-[40px]">{t('enterprise.description')}</p>
            </div>
            <div className="mb-8 h-[60px] flex items-center">
              <span className="text-4xl font-bold tracking-tight text-slate-900">{t('enterprise.price')}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {enterpriseFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-200">
                  <svg className="w-5 h-5 text-blue-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="mailto:contact@eucal.ai"
              className="block w-full text-center py-3.5 bg-slate-900 text-white rounded-xl text-base font-semibold hover:bg-slate-800 shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              {t('enterprise.cta')}
            </a>
          </div>
        </div>
      </div>

      {/* --- 3. 计费方式 (Billing Methods) --- */}
      <div
        className={`w-full px-6 lg:px-0 max-w-[900px] mt-24 mb-16 ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-700`}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">
          {t('billing.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-blue-200">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('billing.payAsYouGo')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  {t('billing.payAsYouGoDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-violet-200">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('billing.monthly')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  {t('billing.monthlyDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. 常见问题 (FAQ) --- */}
      <div
        className={`w-full px-6 lg:px-0 max-w-[800px] py-16 ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-900`}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-10">
          {t('faq.title')}
        </h2>

        <div className="grid gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer hover:border-slate-300">
              <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center group-hover:text-blue-700 transition-colors duration-200">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs mr-3 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
                  Q{num}
                </span>
                {t(`faq.q${num}`)}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-9 group-hover:text-slate-800 transition-colors duration-200">
                {t(`faq.a${num}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ================= 注入按钮组件专属 CSS ================= */}
      {/* ========================================================= */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .upgrade-btn {
          /* 变量定制：配色改为靛蓝，半径适应卡片 */
          --primary: #4f46e5;
          --neutral-1: #f7f8f7;
          --neutral-2: #e7e7e7;
          --radius: 12px;

          cursor: pointer;
          border-radius: var(--radius);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          border: none;
          box-shadow: 0 0.5px 0.5px 1px rgba(255, 255, 255, 0.2),
            0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 5px 0px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          width: 100%;
          padding: 0;
          height: 56px;
          font-family: inherit;
          font-style: normal;
          font-size: 16px;
          font-weight: 600;
        }
        .upgrade-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
            0 15px 30px rgba(0, 0, 0, 0.3), 0 10px 3px -3px rgba(0, 0, 0, 0.04);
        }
        .upgrade-btn:active, .upgrade-btn:focus {
          transform: scale(1);
          box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
            0 10px 3px -3px rgba(0, 0, 0, 0.2);
        }
        .upgrade-btn:after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          border: 2.5px solid transparent;
          background: linear-gradient(var(--neutral-1), var(--neutral-2)) padding-box,
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45))
              border-box;
          z-index: 0;
          transition: all 0.4s ease;
        }
        .upgrade-btn:hover::after {
          transform: scale(1.05, 1.1);
          box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
        }
        .upgrade-btn::before {
          content: "";
          inset: 7px 6px 6px 6px;
          position: absolute;
          background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
          border-radius: 30px;
          filter: blur(0.5px);
          z-index: 2;
        }
        .state p {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .state .icon {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          transform: scale(1.25);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .state .icon svg {
          overflow: visible;
        }

        /* Outline */
        .outline {
          position: absolute;
          border-radius: inherit;
          overflow: hidden;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.4s ease;
          inset: -2px -3.5px;
        }
        .outline::before {
          content: "";
          position: absolute;
          inset: -100%;
          background: conic-gradient(
            from 180deg,
            transparent 60%,
            white 80%,
            transparent 100%
          );
          animation: spin 2s linear infinite;
          animation-play-state: paused;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .upgrade-btn:hover .outline {
          opacity: 1;
        }
        .upgrade-btn:hover .outline::before {
          animation-play-state: running;
        }

        /* Letters */
        .state p span {
          display: block;
          opacity: 0;
          animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
        }
        .upgrade-btn:hover p span {
          opacity: 1;
          animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
        }
        .upgrade-btn:focus p span {
          opacity: 1;
          animation: disapear 0.6s ease forwards calc(var(--i) * 0.03s);
        }
        @keyframes wave {
          30% { opacity: 1; transform: translateY(4px) translateX(0) rotate(0); }
          50% { opacity: 1; transform: translateY(-3px) translateX(0) rotate(0); color: var(--primary); }
          100% { opacity: 1; transform: translateY(0) translateX(0) rotate(0); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px) translateX(5px) rotate(-90deg); color: var(--primary); filter: blur(5px); }
          30% { opacity: 1; transform: translateY(4px) translateX(0) rotate(0); filter: blur(0); }
          50% { opacity: 1; transform: translateY(-3px) translateX(0) rotate(0); }
          100% { opacity: 1; transform: translateY(0) translateX(0) rotate(0); }
        }
        @keyframes disapear {
          from { opacity: 1; }
          to { opacity: 0; transform: translateX(5px) translateY(20px); color: var(--primary); filter: blur(5px); }
        }

        /* Plane */
        .state--default .icon svg {
          animation: land 0.6s ease forwards;
        }
        .upgrade-btn:hover .state--default .icon {
          transform: rotate(45deg) scale(1.25);
        }
        .upgrade-btn:focus .state--default svg {
          animation: takeOff 0.8s linear forwards;
        }
        .upgrade-btn:focus .state--default .icon {
          transform: rotate(0) scale(1.25);
        }
        @keyframes takeOff {
          0% { opacity: 1; }
          60% { opacity: 1; transform: translateX(70px) rotate(45deg) scale(2); }
          100% { opacity: 0; transform: translateX(160px) rotate(45deg) scale(0); }
        }
        @keyframes land {
          0% { transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2); opacity: 0; filter: blur(3px); }
          100% { transform: translateX(0) translateY(0) rotate(0); opacity: 1; filter: blur(0); }
        }

        /* Contrail */
        .state--default .icon:before {
          content: "";
          position: absolute;
          top: 50%;
          height: 2px;
          width: 0;
          left: -5px;
          background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
        }
        .upgrade-btn:focus .state--default .icon:before {
          animation: contrail 0.8s linear forwards;
        }
        @keyframes contrail {
          0% { width: 0; opacity: 1; }
          8% { width: 15px; }
          60% { opacity: 0.7; width: 80px; }
          100% { opacity: 0; width: 160px; }
        }

        /* States */
        .state {
          padding-left: 29px;
          z-index: 2;
          display: flex;
          position: relative;
        }
        .state--default span:nth-child(4) {
          margin-right: 5px;
        }
        .state--sent {
          display: none;
        }
        .state--sent svg {
          transform: scale(1.25);
          margin-right: 8px;
        }
        .upgrade-btn:focus .state--default {
          position: absolute;
        }
        .upgrade-btn:focus .state--sent {
          display: flex;
        }
        .upgrade-btn:focus .state--sent span {
          opacity: 0;
          animation: slideDown 0.8s ease forwards calc(var(--i) * 0.2s);
        }
        .upgrade-btn:focus .state--sent .icon svg {
          opacity: 0;
          animation: appear 1.2s ease forwards 0.8s;
        }
        @keyframes appear {
          0% { opacity: 0; transform: scale(4) rotate(-40deg); color: var(--primary); filter: blur(4px); }
          30% { opacity: 1; transform: scale(0.6); filter: blur(1px); }
          50% { opacity: 1; transform: scale(1.2); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </main>
  )
}