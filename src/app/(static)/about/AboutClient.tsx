'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import NewsGrid from './news/NewsGrid'

// --- 动画组件 1: 数字滚动效果 (Odometer/CountUp) ---
function AnimatedNumber({ value, isLoaded }: { value: string, isLoaded: boolean }) {
  const [displayNum, setDisplayNum] = useState(0)

  // 提取数字和后缀 (例如 "500+" -> num: 500, suffix: "+")
  const match = value.match(/(\d+)(.*)/)
  const targetNum = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (!isLoaded || targetNum === 0) return

    let startTime: number
    const duration = 2000 // 滚动持续时间 2 秒

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)

      // 使用 easeOutQuart 缓动函数，让数字滚动前快后慢
      const ease = 1 - Math.pow(1 - progress, 4)
      setDisplayNum(Math.floor(ease * targetNum))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayNum(targetNum)
      }
    }

    requestAnimationFrame(animate)
  }, [isLoaded, targetNum])

  return (
    <>
      {targetNum > 0 ? displayNum : value}
      {suffix}
    </>
  )
}

// --- 动画组件 2: 文字逐个跳出效果 (Staggered Bounce-in) ---
function BouncingText({ text, delayOffset = 0, isLoaded }: { text: string, delayOffset?: number, isLoaded: boolean }) {
  // 按字符拆分，兼容中文单字和英文字母
  const chars = text.split('')

  return (
    <span className="inline-block">
      {chars.map((char, index) => {
        if (char === ' ') return <span key={index}>&nbsp;</span>
        return (
          <span
            key={index}
            className={`inline-block ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}
            style={{
              animationDelay: `${delayOffset + index * 0.05}s`,
              animationFillMode: 'forwards'
            }}
          >
            {char}
          </span>
        )
      })}
    </span>
  )
}


// --- 页面主要组件 ---
type NewsItem = {
  slug: string
  title: string
  date: string
  category: string
  coverImage?: string
  content: string
}

type TabType = 'about' | 'news'

interface AboutClientProps {
  newsList: NewsItem[]
}

const animationClasses = {
  container: 'transition-all duration-1000 ease-out',
  hidden: 'opacity-0 translate-y-12',
  visible: 'opacity-100 translate-y-0',
}

export default function AboutClient({ newsList }: AboutClientProps) {
  const { t } = useTranslation('about')
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const [isLoaded, setIsLoaded] = useState(false)

  // 用于果冻效果的 Ref 和状态
  const aboutTabRef = useRef<HTMLButtonElement>(null)
  const newsTabRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  // 页面加载后触发全局进场动画
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 计算滑块位置的逻辑
  useEffect(() => {
    const updateIndicator = () => {
      const currentRef = activeTab === 'about' ? aboutTabRef.current : newsTabRef.current;
      if (currentRef) {
        setIndicatorStyle({
          left: currentRef.offsetLeft,
          width: currentRef.offsetWidth,
          opacity: 1 // 计算完成后显示滑块，避免初始闪烁
        });
      }
    };

    // 使用 setTimeout 确保 DOM 已经完全渲染并分配了尺寸
    const timeoutId = setTimeout(updateIndicator, 50);

    // 监听窗口大小变化以保持滑块对齐
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, isLoaded]);

  const coreValues = [
    { title: t('values.customerFirst'), description: t('values.customerFirstDesc'), colorTheme: 'blue' },
    { title: t('values.innovation'), description: t('values.innovationDesc'), colorTheme: 'violet' },
    { title: t('values.integrity'), description: t('values.integrityDesc'), colorTheme: 'indigo' },
    { title: t('values.collaboration'), description: t('values.collaborationDesc'), colorTheme: 'cyan' },
  ]

  const getColorClasses = (theme: string) => {
    switch (theme) {
      case 'blue': return 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-blue-200 group-hover:shadow-blue-500/30'
      case 'violet': return 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white shadow-violet-200 group-hover:shadow-violet-500/30'
      case 'indigo': return 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white shadow-indigo-200 group-hover:shadow-indigo-500/30'
      case 'cyan': return 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white shadow-cyan-200 group-hover:shadow-cyan-500/30'
      default: return 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-blue-200'
    }
  }

  return (
    <main className="relative flex flex-col w-full overflow-hidden flex-1 pb-[120px] min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 背景光晕装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-40 pointer-events-none -z-10 flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      {/* 头部区域 */}
      <div className={`relative z-10 w-full flex flex-col items-center mt-[80px] mb-[32px] px-6 lg:px-0 ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-200`}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-600 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Discover Us
        </div>

        <h1 className="m-0 p-0 text-center text-5xl md:text-6xl font-extrabold tracking-tight leading-tight pb-4 max-w-[900px]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            {t('page.title')}
          </span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium text-center max-w-[700px] mb-10">
          {t('page.subtitle')}
        </p>

        {/* --- 果冻滑动 Tab 切换器 --- */}
        <div className="flex justify-center mt-4">
          <div className="relative inline-flex bg-[#F1F3F5] p-1.5 rounded-[1.25rem] shadow-inner border border-slate-200/50">
            {/* 动态滑块指示器 */}
            <div
              className="absolute top-[6px] bottom-[6px] rounded-xl bg-white shadow-md shadow-slate-200 pointer-events-none"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
                transitionProperty: 'left, width',
                transitionDuration: '500ms',
                // 核心：带有回弹感（果冻感）的贝塞尔曲线
                transitionTimingFunction: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
              }}
            />

            <button
              ref={aboutTabRef}
              onClick={() => setActiveTab('about')}
              className={`relative z-10 px-8 py-2.5 rounded-xl text-base font-bold transition-colors duration-300 ${activeTab === 'about' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {t('tabs.about')}
            </button>
            <button
              ref={newsTabRef}
              onClick={() => setActiveTab('news')}
              className={`relative z-10 px-8 py-2.5 rounded-xl text-base font-bold transition-colors duration-300 ${activeTab === 'news' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {t('tabs.news')}
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1200px] px-6 lg:px-0">

          {activeTab === 'about' ? (
            <div className="flex flex-col gap-16 md:gap-24 w-full pt-8">

              {/* --- 公司介绍 (Intro & Stats) --- */}
              <section className={`w-full ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-400`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    {/* 使用动态跳出文字组件作为标题 */}
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6 h-10">
                      <BouncingText text={t('intro.title') || "专注于 AI 技术创新"} delayOffset={0.6} isLoaded={isLoaded} />
                    </h2>
                    <div className="space-y-4 text-slate-600 text-base leading-relaxed mb-8">
                      <p>{t('intro.description1')}</p>
                      <p>{t('intro.description2')}</p>
                    </div>

                    {/* 数据统计网格 - 使用数字滚动组件 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 transition-transform duration-300 text-center">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-violet-600 mb-1">
                          <AnimatedNumber value="1" isLoaded={isLoaded} />
                        </div>
                        <div className="text-slate-500 text-sm font-medium">{t('stats.years')}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 transition-transform duration-300 text-center">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-violet-600 mb-1">
                          <AnimatedNumber value="500+" isLoaded={isLoaded} />
                        </div>
                        <div className="text-slate-500 text-sm font-medium">{t('stats.customers')}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 transition-transform duration-300 text-center">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-violet-600 mb-1">
                          <AnimatedNumber value="200+" isLoaded={isLoaded} />
                        </div>
                        <div className="text-slate-500 text-sm font-medium">{t('stats.experts')}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 transition-transform duration-300 text-center">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-violet-600 mb-1">
                          <AnimatedNumber value="50+" isLoaded={isLoaded} />
                        </div>
                        <div className="text-slate-500 text-sm font-medium">{t('stats.patents')}</div>
                      </div>
                    </div>
                  </div>

                  {/* 品牌视觉卡片 */}
                  <div className="relative group perspective">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-[2.5rem] blur-2xl transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-slate-200/60 shadow-xl shadow-slate-200/50 flex items-center justify-center transition-transform duration-500">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -ml-20 -mb-20"></div>

                      <div className="text-center relative z-10 flex flex-col items-center">
                        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 transform group-hover:-translate-y-2 transition-all duration-300">
                          <span className="text-5xl font-extrabold text-white">E</span>
                        </div>
                        {/* 品牌名称同样使用跳出动画 */}
                        <div className="text-slate-900 font-bold text-3xl tracking-tight mb-3 h-10">
                          <BouncingText text={t('brand.name') || "Eucal AI"} delayOffset={0.8} isLoaded={isLoaded} />
                        </div>
                        <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">{t('brand.tagline')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- 愿景与使命 --- */}
              <section className={`w-full ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-600`}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{t('visionMission.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-10 rounded-[2rem] text-white overflow-hidden shadow-2xl shadow-blue-600/20 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/20">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 tracking-tight">{t('vision')}</h3>
                      <p className="text-blue-50 text-base leading-relaxed opacity-90">
                        {t('visionDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="relative bg-slate-900 p-10 rounded-[2rem] text-white overflow-hidden shadow-2xl shadow-slate-900/20 group hover:-translate-y-1 transition-transform duration-300 border border-slate-800">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-colors duration-700"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-700 group-hover:border-violet-500/50 transition-colors duration-300">
                        <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 tracking-tight">{t('mission')}</h3>
                      <p className="text-slate-400 text-base leading-relaxed">
                        {t('missionDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- 核心价值观 --- */}
              <section className={`w-full ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-800`}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">{t('values.title')}</h2>
                  <p className="text-slate-500 text-lg">{t('values.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {coreValues.map((value) => (
                    <div
                      key={value.title}
                      className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-2 transition-all duration-300 cursor-default"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-inner group-hover:scale-110 ${getColorClasses(value.colorTheme)}`}>
                        <ValueIcon name={value.title} className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          ) : (
            /* --- 新闻标签内容 --- */
            <section className={`w-full pt-8 ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden}`}>
              <NewsGrid newsList={newsList} />
            </section>
          )}

        </div>
      </div>

      {/* --- 注入动态效果所需的专属 Keyframes --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          60% {
            opacity: 1;
            transform: translateY(-5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-bounce-in {
          opacity: 0;
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}} />
    </main>
  )
}

function ValueIcon({ name, className }: { name: string; className?: string }) {
  const { t } = useTranslation('about')
  const keyMap: Record<string, string> = {
    [t('values.customerFirst')]: 'customerFirst',
    [t('values.innovation')]: 'innovation',
    [t('values.integrity')]: 'integrity',
    [t('values.collaboration')]: 'collaboration',
  }
  const key = keyMap[name] || name

  switch (key) {
    case 'customerFirst':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    case 'innovation':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case 'integrity':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.29 9.824 10 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'collaboration':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    default:
      return null
  }
}