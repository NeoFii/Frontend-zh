'use client'

import Link from 'next/link'
import { useState, useEffect, ReactNode, Suspense } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { RegisterForm } from '@/components/register'
import { useSearchParams, useRouter } from 'next/navigation'

const WithTooltip = ({ children, text, className = '' }: { children: ReactNode, text: string, className?: string }) => (
  <div className={`group relative ${className}`}>
    {children}
    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-800 text-white text-base rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-slate-800"></div>
    </div>
  </div>
)

function RegisterContent() {
  const { t } = useTranslation('auth.register')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [hexCode, setHexCode] = useState('0x000000')
  const [latencies, setLatencies] = useState([24, 85, 142, 35])

  // ================= 动画跳转状态 =================
  const [exitMode, setExitMode] = useState(false)
  const isFromLogin = searchParams.get('dir') === 'rtl'

  // 去掉 !isFromLogin 的限制，永远初始化为 true
  const [isIntroVisible, setIsIntroVisible] = useState(true)

  const handleLinkCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')

    if (link) {
      const href = link.getAttribute('href')
      if (href && href.includes('/login')) {
        e.preventDefault()
        e.stopPropagation()

        setExitMode(true)

        setTimeout(() => {
          router.push('/login?dir=ltr')
        }, 600)
      }
    }
  }

  const carouselAnimClass = exitMode
    ? 'animate-[slideOutRight_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_both]'
    : isFromLogin
      ? 'animate-[slideInFromRight_0.6s_cubic-bezier(0.16,1,0.3,1)_both]'
      : 'animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_both]'

  const formAnimClass = exitMode
    ? 'animate-[slideOutRight_0.6s_cubic-bezier(0.16,1,0.3,1)_both]'
    : isFromLogin
      ? 'animate-[slideInFromRight_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_both]'
      : 'animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_both]'
  // ===============================================

  useEffect(() => {
    const introTimer = setTimeout(() => {
      // 不再判断 isIntroVisible 的状态，时间到了直接设为 false
      setIsIntroVisible(false)
    }, 2500)

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5)
    }, 5500)

    const hexInterval = setInterval(() => {
      setHexCode(`0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`)
    }, 1500)

    const latencyInterval = setInterval(() => {
      setLatencies(prev => prev.map(val => {
        const fluctuate = Math.floor(Math.random() * 15) - 7
        return Math.max(10, val + fluctuate)
      }))
    }, 2000)

    return () => {
      clearTimeout(introTimer)
      clearInterval(slideInterval)
      clearInterval(hexInterval)
      clearInterval(latencyInterval)
    }
  }, []) // 移除了依赖项，只在挂载时执行

  const renderSlideContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex flex-col w-full h-full justify-center">
            <h3 className="text-4xl lg:text-5xl font-tech-display font-bold mb-4 tracking-wider text-tech-text whitespace-nowrap">多维度并发路由协议</h3>
            <p className="text-tech-muted text-base lg:text-lg font-tech-sans mb-12">基于全球 200+ 节点的智能分发，精准匹配最优大模型</p>
            <div className="flex justify-between items-center w-full px-4 lg:px-8 relative">
              <WithTooltip text="客户端请求入口">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-2 border-tech-accent bg-tech-accent/10 flex items-center justify-center font-tech-mono text-xl shadow-[0_0_20px_rgba(var(--tech-accent),0.3)] shrink-0">API</div>
              </WithTooltip>
              <div className="flex-1 h-[2px] bg-tech-border relative mx-6">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-6 h-1.5 bg-tech-accent shadow-[0_0_12px_rgba(var(--tech-accent),0.8)] animate-[pulse_1s_ease-in-out_infinite] transition-all duration-1000" style={{ left: '50%' }}></div>
              </div>
              <div className="flex flex-col gap-5 w-52 lg:w-60 shrink-0">
                <WithTooltip text="路由匹配权重：98%">
                  <div className="px-5 py-3 border border-slate-300/30 bg-slate-800/20 rounded-lg text-base text-center relative overflow-hidden group">
                    <div className="relative z-10 font-tech-mono">GPT-4o <span className="text-sm text-tech-muted block">复杂代码/逻辑</span></div>
                  </div>
                </WithTooltip>
                <WithTooltip text="路由匹配权重：92%">
                  <div className="px-5 py-3 border border-tech-accent/50 bg-tech-accent/10 rounded-lg text-base text-center shadow-[0_0_15px_rgba(var(--tech-accent),0.1)]">
                    <div className="font-tech-mono text-tech-accent">DeepSeek <span className="text-sm opacity-70 block">长文解析/推理</span></div>
                  </div>
                </WithTooltip>
                <WithTooltip text="路由匹配权重：99%">
                  <div className="px-5 py-3 border border-slate-300/30 bg-slate-800/20 rounded-lg text-base text-center">
                    <div className="font-tech-mono">豆包_Pro <span className="text-sm text-tech-muted block">高频日常对话</span></div>
                  </div>
                </WithTooltip>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="flex flex-col w-full h-full justify-center">
            <h3 className="text-4xl lg:text-5xl font-tech-display font-bold mb-4 tracking-wider text-tech-text whitespace-nowrap">高压并发吞吐量峰值</h3>
            <p className="text-tech-muted text-base lg:text-lg font-tech-sans mb-12">极光多路复用 API 完美突破单一官方节点速率限制</p>
            <div className="w-full space-y-10">
              <WithTooltip text="单节点极易触发 429 Too Many Requests">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-base font-tech-mono text-tech-muted whitespace-nowrap"><span>GPT-4o 官方节点</span><span className="text-lg">~80 T/s</span></div>
                  <div className="w-full h-4 bg-slate-200/20 rounded-full overflow-hidden"><div className="h-full bg-slate-400 w-[40%] rounded-full"></div></div>
                </div>
              </WithTooltip>
              <WithTooltip text="DeepSeek 官方满载时常有延迟">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-base font-tech-mono text-tech-muted whitespace-nowrap"><span>DeepSeek 官方节点</span><span className="text-lg">~95 T/s</span></div>
                  <div className="w-full h-4 bg-slate-200/20 rounded-full overflow-hidden"><div className="h-full bg-slate-400 w-[50%] rounded-full"></div></div>
                </div>
              </WithTooltip>
              <WithTooltip text="通过动态矩阵并发，突破吞吐墙">
                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex justify-between text-lg font-tech-mono text-tech-accent font-bold whitespace-nowrap"><span>极光动态路由 API</span><span className="text-2xl">150+ T/s</span></div>
                  <div className="w-full h-5 bg-slate-200/20 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(var(--tech-accent),0.2)]">
                    <div className="h-full bg-tech-accent w-[90%] rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/40 -skew-x-12 translate-x-[-100%] animate-[pulse_1.5s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </WithTooltip>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="flex flex-col w-full h-full justify-center items-center">
            <h3 className="text-4xl lg:text-5xl font-tech-display font-bold mb-4 tracking-wider text-tech-text whitespace-nowrap">API 价格对比</h3>
            <p className="text-tech-muted text-base lg:text-lg font-tech-sans mb-16">算力池化带来压倒性的成本优势 (每百万 Token)</p>
            <div className="flex items-end justify-center h-48 lg:h-56 gap-12 lg:gap-16 w-full px-6 lg:px-12">
              <div className="flex flex-col items-center gap-4 w-20 lg:w-24">
                <div className="flex flex-col gap-1.5 items-center h-40 lg:h-48 justify-end w-full">
                  <WithTooltip text="输出: $15 / 1M"><div className="w-full bg-slate-500 h-[80%] rounded-t-sm"></div></WithTooltip>
                  <WithTooltip text="输入: $5 / 1M"><div className="w-full bg-slate-400 h-[30%] rounded-t-sm"></div></WithTooltip>
                </div>
                <span className="text-base lg:text-lg font-tech-mono text-tech-muted">GPT-4o</span>
              </div>
              <div className="flex flex-col items-center gap-4 w-20 lg:w-24">
                <div className="flex flex-col gap-1.5 items-center h-40 lg:h-48 justify-end w-full">
                  <WithTooltip text="输出: $15 / 1M"><div className="w-full bg-slate-500 h-[75%] rounded-t-sm"></div></WithTooltip>
                  <WithTooltip text="输入: $3 / 1M"><div className="w-full bg-slate-400 h-[25%] rounded-t-sm"></div></WithTooltip>
                </div>
                <span className="text-base lg:text-lg font-tech-mono text-tech-muted">Claude3.5</span>
              </div>
              <div className="flex flex-col items-center gap-3 w-24 lg:w-30 -translate-y-4 transition-transform hover:-translate-y-7">
                <div className="text-base lg:text-lg text-tech-accent border border-tech-accent/50 px-3 py-1 rounded-md bg-tech-accent/10 whitespace-nowrap animate-pulse">智能最低</div>
                <div className="flex flex-col gap-0 items-center h-12 justify-end w-full">
                  <WithTooltip text="极光统一价格: 极致压缩"><div className="w-full bg-tech-accent h-full rounded-t-sm shadow-[0_0_20px_rgba(var(--tech-accent),0.6)]"></div></WithTooltip>
                </div>
                <span className="text-xl lg:text-2xl font-tech-mono text-tech-accent font-bold mt-2 text-center leading-tight">Eucal AI</span>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="flex flex-col w-full h-full justify-center">
            <h3 className="text-4xl lg:text-5xl font-tech-display font-bold mb-4 tracking-wider text-tech-text whitespace-nowrap">各路由节点实时延迟</h3>
            <p className="text-tech-muted text-base lg:text-lg font-tech-sans mb-10">毫秒级响应，自动剔除高延迟及熔断节点</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 w-full">
              {[
                { name: 'AP-East-1 (Tokyo)', ping: latencies[0] },
                { name: 'US-West-2 (Oregon)', ping: latencies[1] },
                { name: 'EU-Central (Frankfurt)', ping: latencies[2] },
                { name: 'CN-North (Beijing)', ping: latencies[3] },
              ].map((node, i) => (
                <div key={i} className="border border-slate-200/20 bg-slate-800/5 p-5 lg:p-6 rounded-xl flex flex-col gap-4 lg:gap-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-base lg:text-lg font-tech-mono text-tech-text truncate mr-3">{node.name}</span>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full animate-ping ${node.ping < 50 ? 'bg-green-400' : node.ping < 120 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                      <span className={`text-base lg:text-lg font-tech-mono font-bold ${node.ping < 50 ? 'text-green-500' : node.ping < 120 ? 'text-yellow-500' : 'text-red-500'}`}>{node.ping}ms</span>
                    </div>
                  </div>
                  <div className="flex items-end h-8 lg:h-10 gap-0.5 opacity-50">
                    {[...Array(15)].map((_, idx) => (
                      <div key={idx} className={`w-1 rounded-t-sm ${node.ping < 50 ? 'bg-green-400' : node.ping < 120 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ height: `${Math.random() * 100}%`, transition: 'height 0.3s ease' }}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="flex flex-col w-full h-full justify-center items-center text-center">
            <h3 className="text-4xl lg:text-5xl font-tech-display font-bold mb-4 tracking-wider text-tech-text whitespace-nowrap">系统集群开销大幅缩减</h3>
            <p className="text-tech-muted text-base lg:text-lg font-tech-sans mb-12">重塑企业 AI 算力投资回报率 (ROI)</p>
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 w-full items-stretch">
              <div className="flex-1 border border-red-400/20 bg-red-400/5 p-6 lg:p-8 rounded-xl flex flex-col justify-center items-center">
                <span className="text-base lg:text-lg text-tech-muted mb-3 lg:mb-4 font-tech-mono">传统独立调度月均开销</span>
                <span className="text-3xl lg:text-4xl font-tech-mono text-slate-400 line-through decoration-red-500/50 whitespace-nowrap">¥ 145,000</span>
              </div>
              <div className="flex-1 border border-tech-accent bg-tech-accent/10 p-6 lg:p-8 rounded-xl flex flex-col justify-center items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-tech-accent/0 via-tech-accent/10 to-tech-accent/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-base lg:text-lg text-tech-accent mb-3 lg:mb-4 font-tech-mono z-10">极光动态矩阵月均开销</span>
                <span className="text-4xl lg:text-6xl font-tech-display text-tech-text font-bold z-10 text-shadow-glow whitespace-nowrap">¥ 15,400</span>
              </div>
            </div>
            <div className="mt-10 lg:mt-12 text-tech-accent font-bold text-lg lg:text-2xl border border-tech-accent/40 px-10 py-3 rounded-full bg-tech-accent/10 shadow-[0_0_25px_rgba(var(--tech-accent),0.2)]">
              系统总节省 = 89%
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen bg-tech-bg text-tech-text relative overflow-hidden grid-bg font-tech-sans antialiased"
      onClickCapture={handleLinkCapture}
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[1200px] h-[1200px] bg-tech-accent/10 rounded-full blur-[160px] animate-pulse-glow"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-primary-300/10 rounded-full blur-[140px] animate-pulse-glow delay-700"></div>
        <div className="absolute inset-0 bg-repeat opacity-[0.015] animate-scanline-sweep" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}></div>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center p-4 lg:p-10">
        <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-stretch min-h-[750px] -translate-y-8 lg:-translate-y-12">

          <div className={`hidden lg:flex lg:col-span-7 flex-col relative bg-white/60 backdrop-blur-3xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden w-full ${carouselAnimClass}`}>

            <div
              className={`absolute inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${isIntroVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <div
                className={`hello-text text-gradient text-6xl xl:text-8xl transition-transform duration-1000 ${isIntroVisible ? 'scale-100 translate-y-0' : 'scale-110 -translate-y-10'
                  }`}
              >
                Register
              </div>
            </div>

            <div className="absolute top-10 left-10 w-6 h-6 border-t-2 border-l-2 border-tech-accent/40"></div>
            <div className="absolute bottom-10 right-10 w-6 h-6 border-b-2 border-r-2 border-tech-accent/40"></div>
            <div className="absolute top-10 right-10 text-base font-tech-mono text-tech-accent/60 opacity-70">
              Eucal_AI: <span className="text-tech-text">{hexCode}</span>
            </div>

            <div className="flex-1 relative w-full h-full flex items-center justify-center px-16 xl:px-24 py-16">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`absolute inset-0 px-12 xl:px-20 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${index === currentSlide
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-tech-display text-[20rem] xl:text-[28rem] font-black text-slate-200/30 select-none -z-10 pointer-events-none">
                    0{index + 1}
                  </div>

                  {renderSlideContent(index)}
                </div>
              ))}
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 z-20 font-tech-mono text-base">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 flex flex-col items-center gap-3 group`}
                >
                  <span className={`transition-colors ${currentSlide === index ? 'text-tech-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    0{index + 1}
                  </span>
                  <span className={`h-[3px] rounded-full transition-all duration-500 ${currentSlide === index ? 'w-16 bg-tech-accent shadow-[0_0_12px_rgba(var(--tech-accent),0.8)]' : 'w-5 bg-slate-300'}`}></span>
                </button>
              ))}
            </div>
          </div>

          <div className={`w-full lg:col-span-3 tech-panel p-8 sm:p-12 xl:p-14 rounded-3xl relative group shadow-2xl bg-white/60 backdrop-blur-md border border-slate-200/50 flex flex-col justify-center mx-auto lg:mx-0 ${formAnimClass}`}>

            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-tech-accent"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-tech-accent"></div>

            <div className="mb-10 relative z-10">
              <h1 className="text-3xl xl:text-4xl font-tech-display font-bold tracking-tighter text-tech-text flex items-center gap-3 xl:gap-4 whitespace-nowrap">
                <span className="w-3 h-8 xl:h-10 bg-tech-accent inline-block shrink-0"></span>
                {t('pageTitle')}
              </h1>
            </div>

            <div className="w-full">
              <RegisterForm />
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200/50 text-center relative z-10">
              <p className="text-sm xl:text-base font-tech-mono text-tech-muted uppercase">
                {t('hasAccount')}
                <Link href="/login" className="text-tech-text text-base xl:text-lg font-bold hover:text-tech-accent transition-colors ml-2 xl:ml-3 underline decoration-tech-accent/40 underline-offset-6">
                  {t('loginNow')}
                </Link>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] font-tech-mono text-tech-muted selection:bg-tech-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-tech-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="tracking-widest uppercase text-xs">正在建安全注册通道...</span>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}