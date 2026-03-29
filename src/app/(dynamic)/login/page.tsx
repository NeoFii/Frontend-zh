'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter as useNextRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/hooks/useTranslation'
import { LoginForm } from '@/components/login'

const Scanline = () => (
  <div className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-b from-transparent via-[rgba(0,210,255,0.03)] to-transparent animate-scanline-sweep pointer-events-none z-10"></div>
)

const HUDCorners = () => (
  <>
    <div className="fixed w-10 h-10 border-tech-accent/40 border-t-2 border-l-2 top-5 left-5 z-5 pointer-events-none"></div>
    <div className="fixed w-10 h-10 border-tech-accent/40 border-t-2 border-r-2 top-5 right-5 z-5 pointer-events-none"></div>
    <div className="fixed w-10 h-10 border-tech-accent/40 border-b-2 border-l-2 bottom-5 left-5 z-5 pointer-events-none"></div>
    <div className="fixed w-10 h-10 border-tech-accent/40 border-b-2 border-r-2 bottom-5 right-5 z-5 pointer-events-none"></div>
  </>
)

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  className?: string;
}

const WithTooltip = ({ children, text, className = '' }: TooltipProps) => (
  <div className={`group relative ${className}`}>
    {children}
    <div className="custom-tooltip">{text}</div>
  </div>
)

function LoginContent() {
  const { t } = useTranslation('auth.login')
  const { t: tHero } = useTranslation('auth.hero')
  const router = useNextRouter()
  const searchParams = useSearchParams()
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const [successMessage, setSuccessMessage] = useState('')

  const [currentSlide, setCurrentSlide] = useState(0)
  const [bgHex1, setBgHex1] = useState('0x8F9A')
  const [dynamicHex1, setDynamicHex1] = useState('0x0000')
  const [latencies, setLatencies] = useState({ gpt: 145, claude: 210, deepseek: 42 })

  // ================= 动画跳转状态 =================
  const [exitMode, setExitMode] = useState(false)
  const isFromRegister = searchParams.get('dir') === 'ltr'

  // 核心修改：去掉 !isFromRegister 的限制，永远初始化为 true
  const [showHello, setShowHello] = useState(true)

  const handleLinkCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')

    if (link) {
      const href = link.getAttribute('href')
      if (href && href.includes('/register')) {
        e.preventDefault()
        e.stopPropagation()

        setExitMode(true)

        setTimeout(() => {
          router.push('/register?dir=rtl')
        }, 600)
      }
    }
  }

  const formAnimClass = exitMode
    ? 'animate-[slideOutLeft_0.6s_cubic-bezier(0.16,1,0.3,1)_both]'
    : isFromRegister
      ? 'animate-[slideInFromLeft_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_both]'
      : 'animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_both]'

  const carouselAnimClass = exitMode
    ? 'animate-[slideOutLeft_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_both]'
    : isFromRegister
      ? 'animate-[slideInFromLeft_0.6s_cubic-bezier(0.16,1,0.3,1)_both]'
      : 'animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_both]'
  // ===============================================

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage(t('registeredSuccess'))
    } else if (searchParams.get('reset') === 'true') {
      setSuccessMessage(t('resetSuccess'))
    }
  }, [searchParams, t])

  useEffect(() => {
    if (isHydrated && sessionStatus === 'authenticated') {
      router.replace('/console/usage/record')
    }
  }, [isHydrated, router, sessionStatus])

  const handleLoginSuccess = () => {
    window.location.href = '/console/usage/record'
  }

  useEffect(() => {
    const helloTimer = setTimeout(() => {
      setShowHello(false)
    }, 3100)

    const carouselTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 5)
    }, 5500)

    const hexTimer = setInterval(() => {
      setBgHex1('0x' + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0'))
      setDynamicHex1('0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0'))
    }, 1500)

    const latencyTimer = setInterval(() => {
      const getNewMs = (base: number) => {
        let fluc = Math.floor(Math.random() * 14) - 5
        return Math.max(5, base + fluc)
      }
      setLatencies({
        gpt: getNewMs(145),
        claude: getNewMs(210),
        deepseek: getNewMs(42)
      })
    }, 2000)

    return () => {
      clearTimeout(helloTimer)
      clearInterval(carouselTimer)
      clearInterval(hexTimer)
      clearInterval(latencyTimer)
    }
  }, [])

  const getLatencyColor = (ms: number) => {
    if (ms > 500) return 'text-red-500'
    if (ms > 300) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 lg:px-10 lg:py-6 relative bg-[#F4F7FB] text-[#0B1121] font-tech-sans antialiased overflow-hidden selection:bg-tech-accent/20"
      onClickCapture={handleLinkCapture}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#FFFFFF_0%,transparent_80%)] pointer-events-none"></div>

      <Scanline />
      <HUDCorners />

      <div className="fixed top-8 left-12 font-tech-mono text-[10px] text-tech-muted/50 tracking-[0.3em] flex flex-col gap-1 pointer-events-none z-0">
        <span>&gt; Eucal AI [就绪]</span>
        <span>&gt; 登录模块_稳定</span>
        <span className="text-tech-accent/60">&gt; 动态规划API {bgHex1}</span>
      </div>
      <div className="fixed bottom-8 right-12 font-tech-mono text-[10px] text-tech-muted/50 tracking-[0.3em] text-right pointer-events-none z-0">
        <div className="flex items-center justify-end gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-tech-accent animate-pulse"></div>
          坐标: 34.0522° N, 118.2437° W
        </div>
        <div>状态: 登录中</div>
      </div>

      <div className="relative z-10 w-[98%] max-w-[1600px] 2xl:max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr] gap-8 lg:gap-12 xl:gap-20 items-center lg:-translate-y-12 xl:-translate-y-16">

        <div className={`w-full max-w-md mx-auto lg:mx-0 flex flex-col shrink-0 ${formAnimClass}`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tech-accent/10 border border-tech-accent/20 rounded-sm mb-4">
              <div className="w-2 h-2 bg-tech-accent shadow-[0_0_8px_#00d2ff]"></div>
              <span className="font-tech-mono text-[10px] text-tech-accent font-bold tracking-[0.2em] uppercase">Eucal AI Beta</span>
            </div>
            <h1 className="text-5xl lg:text-[3.5rem] font-black mb-3 tracking-wider font-tech-display leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0B1121] via-[#0B1121] to-[#3B82F6]">{'Eucal'}</span>
              <span className="text-tech-accent drop-shadow-[0_0_12px_rgba(0,210,255,0.9)] animate-pulse">_</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0B1121] via-[#0B1121] to-[#3B82F6]">{'AI'}</span>
              <span className="text-tech-accent drop-shadow-[0_0_12px_rgba(0,210,255,0.9)] animate-pulse">_</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0B1121] via-[#0B1121] to-[#3B82F6]">Login</span>
            </h1>
            <p className="text-tech-muted text-xs font-tech-mono tracking-widest uppercase">登录享动态规划API，立享最优AI调度</p>
          </div>

          <div className="tech-panel stripe-bg p-8 rounded-xl relative bg-white/60 backdrop-blur-3xl border border-white/90">
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-tech-text/20 rounded-tl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-tech-text/20 rounded-br-xl"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-tech-accent to-transparent opacity-50"></div>

            {successMessage && (
              <div className="bg-green-100/70 border border-green-300 p-3 mb-6 rounded font-tech-mono text-xs text-green-800 shadow-inner relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <span className="text-green-600 font-bold mr-2 opacity-80">&gt;&gt; 成功:</span>
                {successMessage}
              </div>
            )}

            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>

        <div className={`hidden lg:flex relative w-full h-[660px] xl:h-[740px] 2xl:h-[820px] max-h-[82vh] rounded-xl overflow-hidden border border-tech-border/80 bg-white/40 shadow-2xl items-center justify-center ${carouselAnimClass}`}>

          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-tech-muted/40"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-tech-muted/40"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-tech-muted/40"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-tech-muted/40"></div>

          <div className="absolute inset-0 grid-bg opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tech-accent/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

          {showHello && (
            <div className="intro-screen">
              <div className="hello-text">
                HELLO
              </div>
            </div>
          )}

          <div className="relative w-full h-full">

            <div className={`carousel-slide ${currentSlide === 0 ? 'active' : ''}`}>
              <div className="tech-panel p-8 xl:p-12 rounded-lg w-[85%] max-w-[800px] bg-white/60 backdrop-blur-3xl border border-white/90 scale-100 hover:scale-[1.03] transition-transform duration-300 cursor-default relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-tech-accent to-transparent opacity-50"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="font-tech-mono text-[10px] xl:text-xs text-tech-accent font-bold tracking-[0.2em] uppercase border border-tech-accent/30 px-3 py-1 rounded-full bg-tech-accent/5">系统.矩阵.路由</div>
                  <div className="font-tech-mono text-xs text-tech-muted">{dynamicHex1}</div>
                </div>
                <h3 className="text-3xl xl:text-4xl font-black mb-8 text-tech-text font-tech-display tracking-tight">多维度并发路由协议</h3>

                <div className="relative py-4 space-y-6">
                  {[
                    { key: '[代码生成]', model: 'GPT-4o', tip: '复杂逻辑与核心代码生成优先调度至旗舰模型' },
                    { key: '[长文解析]', model: 'DeepSeek', tip: '超长上下文与大规模文档分析直连高性价比模型' },
                    { key: '[情感交互]', model: '豆包_Pro', tip: '高频短对话与拟人化情感陪伴请求无缝分发' },
                  ].map((item, index) => (
                    <WithTooltip key={index} text={item.tip}>
                      <div className="flex justify-between items-center group/path relative">
                        <div className="px-6 py-3 bg-white border border-slate-200 rounded text-sm font-tech-mono font-bold w-36 text-center text-tech-muted group-hover/path:border-tech-accent group-hover/path:text-tech-accent transition-all duration-300">
                          {item.key}
                        </div>
                        <div className="h-[1px] flex-1 bg-slate-300 mx-5 relative overflow-hidden">
                          <div className={`absolute inset-0 bg-tech-accent w-1/4 translate-x-[-100%] group-hover/path:translate-x-[400%] transition-transform duration-[1200ms] ease-in-out`} style={{ animationDelay: `${index * 100}ms` }}></div>
                        </div>
                        <div className="px-6 py-3 bg-tech-text text-white rounded text-sm font-tech-mono font-bold w-36 text-center shadow-lg relative overflow-hidden">
                          <span className="relative z-10">{item.model}</span>
                        </div>
                      </div>
                    </WithTooltip>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-tech-muted text-[10px] font-tech-mono tracking-widest uppercase">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-tech-accent animate-pulse"></span>等待交互式悬停检测</span>
                  <span>延迟: &lt; 50ms</span>
                </div>
              </div>
            </div>

            {/* 剩余的 carousel-slide 保持不变，为了篇幅省略，请保留原本所有轮播内容 */}
            <div className={`carousel-slide ${currentSlide === 1 ? 'active' : ''}`}>
              <div className="tech-panel p-8 xl:p-12 rounded-lg w-[85%] max-w-[800px] bg-white/60 backdrop-blur-3xl border shadow-lg hover:scale-[1.03] transition-transform duration-300 relative cursor-default">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-tech-accent to-transparent opacity-50"></div>
                <div className="font-tech-mono text-[10px] xl:text-xs text-tech-accent font-bold tracking-[0.2em] uppercase mb-2">性能.吞吐量.测试</div>
                <h3 className="text-3xl xl:text-4xl font-black mb-8 text-tech-text font-tech-display">高压并发吞吐量峰值</h3>
                <div className="space-y-6 font-tech-mono">
                  {[
                    { node: 'GPT-4o', throughput: '~80 T/s', width: '53%', tip: '单点处理受限于原生速率，易遇排队拥堵' },
                    { node: 'DeepSeek V3', throughput: '~75 T/s', width: '50%', tip: '高压逻辑推理并发极易触碰瓶颈限制' },
                    { node: '豆包_Pro', throughput: '~100 T/s', width: '66%', tip: '国内优质节点特定场景下的吞吐量表现' },
                  ].map((item, index) => (
                    <WithTooltip key={index} text={item.tip}>
                      <div className="group/bar relative">
                        <div className="flex justify-between text-xs mb-2 text-tech-muted font-bold uppercase">
                          <span>节点: {item.node}</span><span>{item.throughput}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-none overflow-hidden">
                          <div className="h-full bg-slate-400 transition-all duration-1000 group-hover/bar:bg-slate-600" style={{ width: item.width }}></div>
                        </div>
                      </div>
                    </WithTooltip>
                  ))}

                  <WithTooltip text="动态连接池智能切换，突破所有单一节点限速限制">
                    <div className="group/bar relative pt-4">
                      <div className="flex justify-between mb-3 items-end">
                        <span className="font-bold text-tech-accent text-sm tracking-widest uppercase flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          极光多路复用 API
                        </span>
                        <span className="font-bold text-tech-accent text-sm bg-tech-accent/10 px-2 py-0.5 rounded">150+ T/s</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-none overflow-hidden relative border border-tech-accent/30">
                        <div className="h-full bg-tech-accent w-full"></div>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                    </div>
                  </WithTooltip>
                </div>
              </div>
            </div>

            <div className={`carousel-slide ${currentSlide === 2 ? 'active' : ''}`}>
              <div className="tech-panel p-8 xl:p-12 rounded-lg w-[85%] max-w-[800px] bg-white/60 backdrop-blur-3xl border shadow-lg hover:scale-[1.03] transition-transform duration-300 relative cursor-default">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-tech-accent to-transparent opacity-50"></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl xl:text-4xl font-black text-tech-text font-tech-display flex justify-center items-center gap-3">
                    <svg className="w-8 h-8 text-tech-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    API 价格对比 ($ / 1M Tokens)
                  </h3>
                </div>

                <div className="flex justify-center gap-8 mb-8">
                  <div className="flex items-center gap-2 text-sm font-tech-mono font-bold text-tech-muted">
                    <div className="w-4 h-4 bg-[#60A5FA] rounded-sm shadow-sm"></div> 输入价格
                  </div>
                  <div className="flex items-center gap-2 text-sm font-tech-mono font-bold text-tech-muted">
                    <div className="w-4 h-4 bg-[#A78BFA] rounded-sm shadow-sm"></div> 输出价格
                  </div>
                </div>

                <div className="h-56 flex justify-between gap-6 px-6 font-tech-mono relative mt-10">
                  <div className="absolute inset-0 px-6 pointer-events-none z-0">
                    <div className="w-full h-full relative">
                      {[0.2, 0.4, 0.6, 0.8].map(top => (
                        <div key={top} className="absolute w-full border-t border-dashed border-slate-300" style={{ top: `${top * 100}%` }}></div>
                      ))}
                      <div className="absolute w-full border-t border-slate-300 bottom-[32px]"></div>
                    </div>
                  </div>

                  {[
                    { name: 'GPT-4o', total: '$20.0', h: '85%', inH: '25%', tip: '入: $5.00/M | 出: $15.00/M' },
                    { name: 'Gemini 1.5', total: '$14.0', h: '60%', inH: '25%', tip: '入: $3.50/M | 出: $10.50/M' },
                    { name: 'DeepSeek', total: '$0.42', h: '5%', inH: '33%', tip: '入: $0.14/M | 出: $0.28/M' },
                    { name: '豆包 Pro', total: '$0.11', h: '3%', inH: '45%', tip: '入: $0.05/M | 出: $0.06/M' },
                  ].map((bar, index) => (
                    <WithTooltip key={index} text={bar.tip} className="flex-1 h-full z-10 cursor-pointer">
                      <div className="absolute inset-0 bottom-[32px] flex items-end justify-center">
                        <div className="w-full max-w-[60px] flex flex-col justify-end relative transition-all duration-300 transform hover:scale-105 origin-bottom" style={{ height: bar.h }}>
                          <span className="absolute -top-6 w-full text-center text-xs font-bold text-slate-600">{bar.total}</span>
                          <div className="w-full bg-[#A78BFA] flex-1 rounded-t-sm shadow-sm"></div>
                          <div className="w-full bg-[#60A5FA] shadow-sm" style={{ height: bar.inH }}></div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 w-full h-[32px] flex items-center justify-center pt-1">
                        <span className="text-[11px] text-tech-text font-bold tracking-widest uppercase shrink-0">{bar.name}</span>
                      </div>
                    </WithTooltip>
                  ))}

                  <WithTooltip text="智能匹配各家接口低价时段，无缝切换突破底价" className="flex-1 h-full z-10 cursor-pointer group/jiguang">
                    <div className="absolute inset-0 bottom-[32px] flex items-end justify-center">
                      <div className="w-full max-w-[60px] flex flex-col justify-end relative transition-all duration-300" style={{ height: '6%' }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-tech-text text-tech-accent border border-tech-accent px-2 py-1 whitespace-nowrap z-10">
                          智能最低
                        </div>
                        <div className="w-full bg-tech-accent h-full relative transform transition-transform group-hover/jiguang:-translate-y-2 flex flex-col justify-end rounded-t-sm">
                          <div className="w-full h-[1px] bg-white mb-[1px]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 w-full h-[32px] flex items-center justify-center pt-1">
                      <span className="text-[11px] font-bold text-tech-accent tracking-widest uppercase shrink-0">极光_API</span>
                    </div>
                  </WithTooltip>
                </div>
              </div>
            </div>

            <div className={`carousel-slide ${currentSlide === 3 ? 'active' : ''}`}>
              <div className="tech-panel p-8 xl:p-12 rounded-lg w-[85%] max-w-[800px] bg-white/60 backdrop-blur-3xl border shadow-lg hover:scale-[1.03] transition-transform duration-300 relative cursor-default">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-tech-accent to-transparent opacity-50"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="font-tech-mono text-[10px] xl:text-xs text-tech-accent font-bold tracking-[0.2em] uppercase border border-tech-accent/30 px-3 py-1 rounded-full bg-tech-accent/5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    节点.集群.监控
                  </div>
                  <div className="font-tech-mono text-xs text-tech-muted">全网联通率: 99.98%</div>
                </div>

                <h3 className="text-3xl xl:text-4xl font-black mb-6 text-tech-text font-tech-display tracking-tight">各路由节点实时延迟 (ms)</h3>

                <div className="space-y-4 font-tech-mono">
                  {[
                    { name: 'GPT-4o', ms: latencies.gpt, base: 145, barColor: 'bg-tech-secondary' },
                    { name: 'Claude 3.5', ms: latencies.claude, base: 210, barColor: 'bg-purple-400' },
                    { name: 'DeepSeek V3', ms: latencies.deepseek, base: 42, barColor: 'bg-tech-accent' },
                  ].map(node => (
                    <div key={node.name} className="flex items-center justify-between p-4 bg-white/50 border border-slate-200 rounded-lg group hover:border-tech-accent transition-colors">
                      <div className="flex items-center gap-4 w-1/3">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="font-bold text-sm text-tech-text">{node.name}</span>
                      </div>
                      <div className="flex gap-1 h-8 items-end w-1/3 justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        {[0.1, 0.3, 0.5, 0.7, 0.9].map(delay => (
                          <div key={delay} className={`w-1.5 ${node.barColor} h-full origin-bottom animate-wave`} style={{ animationDelay: `${delay}s`, animationDuration: '1.1s' }}></div>
                        ))}
                      </div>
                      <div className="text-lg font-bold w-1/3 text-right">
                        <span className={`${getLatencyColor(node.ms)} transition-colors duration-300`}>{node.ms}</span> <span className="text-sm text-slate-400">ms</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="font-tech-mono text-xs text-tech-muted">当前智能优先分发至: <span className="text-tech-accent font-bold px-2 py-0.5 bg-tech-accent/10 rounded">DeepSeek V3</span></div>
                  <div className="font-tech-mono text-xs text-tech-muted">数据同步间隔: 2s</div>
                </div>
              </div>
            </div>

            <div className={`carousel-slide ${currentSlide === 4 ? 'active' : ''}`}>
              <div className="w-full px-12 xl:px-20 max-w-[1100px] scale-100 hover:scale-[1.03] transition-transform duration-300 cursor-default">
                <div className="text-center mb-12">
                  <div className="font-tech-mono text-[10px] text-tech-accent font-bold mb-3 tracking-[0.3em] uppercase">&gt;&gt; 业务.投资回报.预测</div>
                  <h3 className="text-4xl xl:text-5xl font-black text-tech-text mb-4 font-tech-display">系统集群开销大幅缩减</h3>
                  <p className="text-tech-muted text-xs font-tech-mono tracking-widest uppercase">体量: 10亿 Tokens/月 | 分布: 50% 代码 / 50% 文本</p>
                </div>

                <div className="flex gap-8 items-center justify-center">
                  <WithTooltip text="单一旗舰模型承接所有低价值请求，算力严重溢出" className="flex-1 max-w-[400px]">
                    <div className="bg-white/40 border border-slate-300 p-8 rounded-lg text-center opacity-80 backdrop-blur-md relative">
                      <div className="text-[10px] font-tech-mono text-slate-500 mb-4 font-bold tracking-widest uppercase">传统单一节点调度</div>
                      <div className="text-4xl xl:text-5xl font-tech-mono text-slate-400 line-through decoration-slate-400 decoration-1">
                        14万<span className="text-sm">¥</span>
                      </div>
                    </div>
                  </WithTooltip>

                  <div className="text-tech-muted shrink-0 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </div>

                  <WithTooltip text="精准分发大幅压降高昂 API 开支，确保核心体验无损" className="flex-[1.2] max-w-[480px]">
                    <div className="bg-white p-10 rounded-lg shadow-2xl border border-tech-accent/40 text-center relative overflow-hidden h-full z-10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00d2ff_0%,transparent_30%)] opacity-10"></div>
                      <div className="text-[10px] font-tech-mono text-tech-accent mb-4 font-bold tracking-widest uppercase relative z-10">极光动态路由矩阵</div>
                      <div className="text-5xl xl:text-6xl font-tech-mono font-bold text-tech-text mb-5 tracking-tight relative z-10 drop-shadow-sm">
                        1.5万<span className="text-lg text-tech-muted font-normal">¥</span>
                      </div>
                      <div className="inline-block px-4 py-1.5 bg-tech-text text-tech-accent font-tech-mono text-xs font-bold rounded relative z-10 border border-tech-accent/50">
                        系统.总节省 = 89%
                      </div>
                    </div>
                  </WithTooltip>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const { t: tCommon } = useTranslation('common')
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] font-tech-mono text-tech-muted selection:bg-tech-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-tech-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="tracking-widest uppercase text-xs">{tCommon('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] font-tech-mono text-tech-muted selection:bg-tech-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-tech-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="tracking-widest uppercase text-xs">{tCommon('loading')}</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}