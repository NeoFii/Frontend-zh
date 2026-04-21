'use client'

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useUser } from '@/hooks/useUser'
import Reveal from '@/components/Reveal'
import { useAuthStore } from '@/stores/auth'
import Image from 'next/image'
import Chart from 'chart.js/auto'

const BASE_URL = 'https://api.eucal.ai/v1/chat/completions'

// 支持的供应商数据
const providers = [
  { name: 'OpenAI', icon: '/icons/providers/openai.png' },
  { name: 'Claude', icon: '/icons/providers/anthropic.png' },
  { name: 'Gemini', icon: '/icons/providers/gemini.png' },
  { name: 'DeepSeek', icon: '/icons/providers/deepseek.png' },
  { name: '智谱', icon: '/icons/providers/zhipu.png' },
  { name: 'Kimi', icon: '/icons/providers/moonshot.png' },
  { name: '通义千问', icon: '/icons/providers/qwen.png' },
  { name: '百川', icon: '/icons/providers/cornerstone.png' },
  { name: 'MiniMax', icon: '/icons/providers/minimax.png' },
  { name: '阶跃星辰', icon: '/icons/providers/stepfun.png' },
  { name: '硅基流动', icon: '/icons/providers/silicon-flow.png' },
  { name: 'Llama', icon: '/icons/providers/meta.png' },
]

export default function Home() {
  const { t } = useTranslation('home')
  const router = useRouter()
  useUser({ enabled: true })
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const isLoggedIn = sessionStatus === 'authenticated'

  const [copied, setCopied] = useState(false)
  const [typedText, setTypedText] = useState('')

  // 图表和数值动画 Refs
  const chartCanvasRef1 = useRef<HTMLCanvasElement>(null)
  const chartCanvasRef2 = useRef<HTMLCanvasElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  // 使用 ref 保存 chart 实例，防止 React 严格模式导致二次渲染画布报错
  const priceChartRef = useRef<Chart | null>(null)
  const lifecycleChartRef = useRef<Chart | null>(null)

  const [oldCost, setOldCost] = useState(0)
  const [newCost, setNewCost] = useState(0)

  const handleCtaClick = () => {
    const targetUrl = isLoggedIn ? '/console/account/basic-information' : '/login'
    router.push(targetUrl)
  }

  const copyBaseUrl = () => {
    navigator.clipboard.writeText(BASE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const texts = [
      "一个接口 主流大模型",
      "一次接入 自动处理API",
      "毫秒级别寻找最合适模型",
      "性能拉满 成本骤降",
      "自适应推理API"
    ]
    let textIdx = 0
    let charIdx = 0
    let isDeleting = false
    let timer: NodeJS.Timeout

    const type = () => {
      const current = texts[textIdx]
      if (isDeleting) {
        setTypedText(current.substring(0, charIdx - 1))
        charIdx--
      } else {
        setTypedText(current.substring(0, charIdx + 1))
        charIdx++
      }

      let speed = isDeleting ? 40 : 100
      if (!isDeleting && charIdx === current.length) {
        speed = 1500
        isDeleting = true
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false
        textIdx = (textIdx + 1) % texts.length
        speed = 500
      }
      timer = setTimeout(type, speed)
    }

    timer = setTimeout(type, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const dataOld = [12.5, 18.2, 25.5, 10.8]
    const dataNew = [2.5, 18.0, 4.2, 1.5]
    const sumOld = dataOld.reduce((a, b) => a + b, 0)
    const sumNew = dataNew.reduce((a, b) => a + b, 0)

    const animateValue = (setter: Dispatch<SetStateAction<number>>, end: number, duration: number) => {
      let startTimestamp: number | null = null
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 4)
        setter(Number((easeOut * end).toFixed(2)))
        if (progress < 1) window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll<HTMLElement>('.progress-bar-custom').forEach((bar) => {
            const width = bar.dataset.width
            if (width) {
              bar.style.width = width
            }
          })

          if (chartCanvasRef1.current) {
            if (priceChartRef.current) priceChartRef.current.destroy()
            priceChartRef.current = new Chart(chartCanvasRef1.current, {
              type: 'bar',
              data: {
                labels: ['GPT-4o', 'Gemini 1.5', 'DeepSeek-V3', '豆包 Pro'],
                datasets: [
                  { label: '输入价格', data: [5.0, 3.5, 0.14, 0.08], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4 },
                  { label: '输出价格', data: [15.0, 10.5, 0.28, 0.16], backgroundColor: 'rgba(139, 92, 246, 0.8)', borderRadius: 4 }
                ]
              },
              options: { responsive: true, maintainAspectRatio: false, scales: { y: { stacked: true }, x: { stacked: true, grid: { display: false } } } }
            })
          }

          if (chartCanvasRef2.current) {
            if (lifecycleChartRef.current) lifecycleChartRef.current.destroy()
            lifecycleChartRef.current = new Chart(chartCanvasRef2.current, {
              type: 'line',
              data: {
                labels: ['需求文档', '架构设计', '业务编码', '营销文案'],
                datasets: [
                  { label: '单一昂贵大模型', data: dataOld, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderWidth: 2, borderDash: [5, 5], pointBackgroundColor: '#ef4444', fill: true, tension: 0.4 },
                  { label: 'Nexus 自适应 API', data: dataNew, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 3, pointBackgroundColor: '#10b981', fill: true, tension: 0.4 }
                ]
              },
              options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }
            })
          }

          animateValue(setOldCost, sumOld, 2000)
          animateValue(setNewCost, sumNew, 2000)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })

    if (statsRef.current) observer.observe(statsRef.current)

    return () => {
      if (priceChartRef.current) priceChartRef.current.destroy()
      if (lifecycleChartRef.current) lifecycleChartRef.current.destroy()
      observer.disconnect()
    }
  }, [])

  return (
    <main className="relative overflow-x-hidden bg-slate-50 text-slate-900 font-sans selection:bg-[#3b82f6] selection:text-white">

      <style dangerouslySetInnerHTML={{
        __html: `
        .glow-bg { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 30%, rgba(248, 250, 252, 0) 70%); border-radius: 50%; top: -200px; left: 50%; transform: translateX(-50%); z-index: 0; pointer-events: none; }
        
        .text-gradient-dynamic { 
          background: linear-gradient(270deg, #1e3a8a, #3b82f6, #60a5fa, #3b82f6, #1e3a8a);
          background-size: 200% auto;
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
          animation: shine-blue 3s linear infinite;
        }
        @keyframes shine-blue {
          to { background-position: 200% center; }
        }

        .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 1); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); border-radius: 1.25rem; }
        .route-line::after { content: ''; position: absolute; top: 50%; left: -100%; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent); animation: flow 2s infinite linear; }
        @keyframes flow { 100% { left: 100%; } }
        .progress-bar-custom { transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        
        /* 3D 轮播动画 */
        .card-stack-container { position: relative; width: 100%; max-width: 520px; aspect-ratio: 1/1; margin: 0 auto; perspective: 1500px; transform-style: preserve-3d; }
        .stacked-card { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transform-origin: center; animation: stack-swipe-physical 36s infinite linear; transform-style: preserve-3d; opacity: 0; }
        ${providers.map((_, i) => `.sc-${i + 1} { animation-delay: -${36 - (i * 3)}s; }`).join('\n')}
        @keyframes stack-swipe-physical {
            0%, 1.5% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); filter: brightness(1); opacity: 1; }
            4% { transform: translate3d(140%, 10%, 50px) rotateZ(15deg) scale(0.95); filter: brightness(1.05); opacity: 1; }
            6% { transform: translate3d(110%, -10%, -200px) rotateZ(5deg) scale(0.85); filter: brightness(0.8); opacity: 0; }
            8.333% { transform: translate3d(0, -55px, -440px) rotateZ(0deg) scale(0.45); filter: brightness(0.5); opacity: 0; }
            16.666% { transform: translate3d(0, -50px, -400px) rotateZ(0deg) scale(0.5); opacity: 0; }
            25.000% { transform: translate3d(0, -45px, -360px) rotateZ(0deg) scale(0.55); opacity: 0; }
            33.333% { transform: translate3d(-5px, -40px, -320px) rotateZ(-1deg) scale(0.6); opacity: 0; }
            41.666% { transform: translate3d(5px, -35px, -280px) rotateZ(1deg) scale(0.65); opacity: 0; }
            50.000% { transform: translate3d(-15px, -30px, -240px) rotateZ(-2deg) scale(0.7); opacity: 0; }
            58.333% { transform: translate3d(15px, -25px, -200px) rotateZ(2deg) scale(0.75); opacity: 0; }
            66.666% { transform: translate3d(-25px, -20px, -160px) rotateZ(-4deg) scale(0.8); opacity: 0; }
            75.000% { transform: translate3d(25px, -15px, -120px) rotateZ(4deg) scale(0.85); opacity: 0; }
            83.333% { transform: translate3d(-35px, -10px, -80px) rotateZ(-6deg) scale(0.9); opacity: 0; }
            91.666% { transform: translate3d(35px, -5px, -40px) rotateZ(6deg) scale(0.95); opacity: 0; }
            95% { transform: translate3d(10px, -2px, -15px) rotateZ(2deg) scale(0.98); opacity: 1; }
            100% { transform: translate3d(0, 0, 0) rotateZ(0deg) scale(1); filter: brightness(1); opacity: 1; }
        }

        /* 新增：无限滚动 Logo 墙动画与遮罩 */
        .mask-image-linear-horizontal {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse 40s linear infinite; }
        .animate-marquee:hover, .animate-marquee-reverse:hover { animation-play-state: paused; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}} />

      {/* 首屏 Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="glow-bg"></div>
        <div className="absolute top-40 left-10 text-blue-500/10 text-9xl font-serif pointer-events-none rotate-12">{'{'}</div>
        <div className="absolute bottom-20 right-10 text-purple-500/10 text-9xl font-serif pointer-events-none -rotate-12">{'}'}</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-medium mb-8 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                Eucal AI 一次计入 主流大模型
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
                面向<span className="text-6xl md:text-7xl xl:text-8xl text-slate-900">智能体</span>的 <br />
                <span className="text-gradient-dynamic text-7xl md:text-8xl xl:text-[6rem] inline-block mt-3 pb-2 drop-shadow-sm whitespace-nowrap">自适应推理 API</span>
              </h1>

              <div className="mt-6 mb-8 h-[60px] md:h-[72px] flex items-center">
                <p className="text-xl md:text-2xl text-slate-600 font-medium tracking-wide">
                  <span className="text-[#2563eb] drop-shadow-sm">{typedText}</span>
                  <span className="cursor-blink inline-block w-1 h-6 md:h-7 bg-[#3b82f6] ml-1 align-middle translate-y-[-2px]"></span>
                </p>
              </div>

              <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-5 py-3 mb-10 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('baseUrl.label')}</span>
                <span className="text-sm font-mono text-slate-800 select-all">{BASE_URL}</span>
                <button
                  onClick={copyBaseUrl}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="复制"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400 hover:text-blue-500 transition-colors"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleCtaClick} className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:rotate-12 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  {t('cta.getKey')}
                </button>
                <a href="https://neofii.github.io/TierFlow-Doc/" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-sm flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  {t('cta.docs')}
                </a>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative w-full py-16 flex justify-center">
                <div className="card-stack-container">
                  {providers.map((provider, idx) => (
                    <div key={provider.name} className={`stacked-card sc-${idx + 1} group`}>
                      <Image src={provider.icon} alt={provider.name} width={400} height={400} className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" unoptimized />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <div className="mt-20 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-20">
                <div className="bg-slate-50 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="ml-2 text-xs text-slate-500 font-mono font-medium">nexus-quickstart.js</span>
                </div>
                <div className="p-6 overflow-x-auto bg-white text-sm">
                  <pre className="font-mono text-[13px] md:text-sm leading-loose text-slate-700 whitespace-pre">
                    <div className="flex"><span className="text-purple-600 font-medium mr-2">import</span> {'{'} OpenAI {'}'} <span className="text-purple-600 font-medium mx-2">from</span> <span className="text-blue-600">{'\'openai\''}</span>;</div>
                    <div className="text-slate-400 italic mt-3 mb-1">{'// 100% 兼容 OpenAI SDK，只需替换 baseURL'}</div>
                    <div className="flex"><span className="text-purple-600 font-medium mr-2">const</span> client = <span className="text-purple-600 font-medium mr-2">new</span> <span className="text-amber-600">OpenAI</span>({'{'})</div>
                    <div className="pl-6">baseURL: <span className="text-blue-600">{`'${BASE_URL}'`}</span>,</div>
                    <div className="pl-6">apiKey: <span className="text-blue-600">{'\'sk-your-api-key\''}</span>,</div>
                    <div>{'}'});</div>
                    <div className="flex mt-4"><span className="text-purple-600 font-medium mr-2">const</span> response = <span className="text-purple-600 font-medium mr-2">await</span> client.chat.completions.<span className="text-amber-600">create</span>({'{'})</div>
                    <div className="pl-6 flex">model: <span className="text-blue-600 mx-2">{'\'nexus-auto\''}</span>, <span className="text-slate-400 italic">{'// ✨ 启用自适应智能路由'}</span></div>
                    <div className="pl-6 flex">messages: [{'{'} role: <span className="text-blue-600 mx-2">{'\'user\''}</span>, content: <span className="text-blue-600 mx-2">{'\'帮我写一段快排算法\''}</span> {'}'}],</div>
                    <div>{'}'});</div>
                  </pre>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 智能路由区块 */}
      <section id="routing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#2563eb] font-semibold tracking-wider text-sm uppercase mb-2 block">Smart Routing</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">感知任务意图，精准分发</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">内置轻量级意图分类模型（延迟 &lt; 10ms），准确识别用户的提示词类型，将其分配给最擅长且性价比最高的底层大模型。</p>
            </div>
          </Reveal>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 relative">

            <div className="w-full lg:w-1/3 flex flex-col gap-4 z-10">
              <Reveal delay={100}>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">日常对话 / 情感陪伴</span>
                  </div>
                  <p className="text-slate-700 font-medium text-sm">{'"今天工作遇到挫折了，感觉自己好失败，能陪我聊聊吗？"'}</p>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z" clipRule="evenodd" /></svg>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">复杂逻辑 / 架构设计</span>
                  </div>
                  <p className="text-slate-700 font-medium text-sm">{'"帮我设计一个支持高并发的微服务系统架构，并写出核心网关代码..."'}</p>
                </div>
              </Reveal>
              <Reveal delay={300}>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400"><path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.875 18.875 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.817zM11.439 4.005a9.761 9.761 0 016.12 3.208 12.924 12.924 0 00-6.12-1.325V4.005zM12.561 4.005v1.878c-2.19 0-4.269.467-6.12 1.325a9.761 9.761 0 016.12-3.208z" /></svg>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">长文本翻译 / 总结</span>
                  </div>
                  <p className="text-slate-700 font-medium text-sm">{'"将这篇 20 页的英文财报翻译成中文，并总结三个核心增长点..."'}</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={400}>
              <div className="w-full lg:w-48 flex flex-col items-center justify-center py-8 z-10">
                <div className="relative w-32 h-32 rounded-2xl bg-white border border-blue-200 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.15)] group">
                  <div className="absolute inset-0 bg-blue-50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[#2563eb] relative z-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <div className="absolute inset-0 border-2 border-[#3b82f6] rounded-2xl animate-[spin_8s_linear_infinite] opacity-20"></div>
                </div>
                <div className="mt-4 font-bold text-slate-800 text-center">
                  意图引擎<br /><span className="text-xs text-[#3b82f6] font-medium">99.8% 准确率 · 8ms 延迟</span>
                </div>
              </div>
            </Reveal>

            <div className="w-full lg:w-1/3 flex flex-col gap-4 z-10">
              <Reveal delay={500}>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-[#ff7d00] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#ff7d00]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">豆包 Doubao <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">极低成本</span></h4>
                    <p className="text-xs text-slate-500 mt-0.5">拟人化好，价格便宜，适合海量闲聊。</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={600}>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-[#10a37f] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#10a37f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">GPT-4o / Gemini <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full">高智商</span></h4>
                    <p className="text-xs text-slate-500 mt-0.5">推理能力顶尖，专门用于攻克复杂代码与架构。</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={700}>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-[#4d6bfe] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#4d6bfe]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c1.68 0 3.282.466 4.75 1.257a.75.75 0 001-.707V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">DeepSeek <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">性价比王</span></h4>
                    <p className="text-xs text-slate-500 mt-0.5">文本处理速度快，长上下文性价比极高。</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-px -translate-y-1/2 z-0 overflow-hidden pointer-events-none route-line"></div>
          </div>
        </div>
      </section>

      {/* 新增：无限滚动 Logo 墙区块 */}
      <section id="supported-models" className="py-20 relative border-t border-slate-200/60 overflow-hidden bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[#2563eb] font-semibold tracking-wider text-sm uppercase mb-2 block">Supported Ecosystem</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">支持市面上主流的全部大模型</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">无论闭源还是开源，只需一次接入，即可在数百个顶尖模型间自由无缝切换。</p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative w-full overflow-hidden flex flex-col gap-6 mask-image-linear-horizontal py-4">
              {/* 第一行：从右向左滚动 */}
              <div className="flex w-max animate-marquee gap-6">
                {[...providers, ...providers].map((p, i) => (
                  <div key={`row1-${i}`} className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-w-[200px]">
                    <Image src={p.icon} alt={p.name} width={32} height={32} className="w-8 h-8 object-contain" unoptimized />
                    <span className="font-bold text-slate-700 whitespace-nowrap">{p.name}</span>
                  </div>
                ))}
              </div>
              {/* 第二行：从左向右滚动 */}
              <div className="flex w-max animate-marquee-reverse gap-6">
                {[...providers, ...providers].reverse().map((p, i) => (
                  <div key={`row2-${i}`} className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-w-[200px]">
                    <Image src={p.icon} alt={p.name} width={32} height={32} className="w-8 h-8 object-contain" unoptimized />
                    <span className="font-bold text-slate-700 whitespace-nowrap">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="benchmarks" className="py-24 relative border-t border-slate-200/60" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#2563eb] font-semibold tracking-wider text-sm uppercase mb-2 block">Provider Benchmarks</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">让数据说话，揭示真实优劣</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">监控全网主流厂商的实时性能，作为自动路由和故障转移的重要依据。</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Reveal delay={100}>
              <div className="glass-card p-6 sm:p-8 bg-white">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#3b82f6]"><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" /></svg>
                  平均生成速度 (Tokens/s)
                </h3>
                <div className="space-y-5">
                  {[{ n: 'DeepSeek-V3', v: 85, c: 'bg-[#4d6bfe]' }, { n: '豆包 Doubao-Pro', v: 90, c: 'bg-[#ff7d00]' }, { n: 'Gemini 1.5 Pro', v: 60, c: 'bg-[#1a73e8]' }, { n: 'GPT-4o', v: 55, c: 'bg-[#10a37f]' }].map(item => (
                    <div key={item.n} className="relative">
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{item.n}</span><span className="text-slate-500 font-mono">{item.v} t/s</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`${item.c} h-2.5 rounded-full progress-bar-custom w-0`} data-width={`${item.v}%`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="glass-card p-6 sm:p-8 bg-white h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#3b82f6]"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" /><path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" /></svg>
                  API 价格对比 ($ / 1M Tokens)
                </h3>
                <div className="relative flex-1 w-full min-h-[250px]"><canvas ref={chartCanvasRef1}></canvas></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                <div className="lg:col-span-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">综合项目成本模拟</h3>
                  <p className="text-slate-500 mb-6 text-sm">以开发一个“AI 导购小程序”为例，涵盖从架构设计到描述生成全流程（约 500万 Tokens）。</p>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-red-50 border border-red-100"><div className="text-xs text-red-500 font-bold mb-1">单一昂贵模型</div><div className="text-2xl font-extrabold text-red-600 flex items-baseline gap-1"><span>$</span><span>{oldCost.toFixed(2)}</span></div></div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100 relative overflow-hidden"><div className="text-xs text-green-600 font-bold mb-1">使用自适应动态路由</div><div className="text-3xl font-extrabold text-green-600 flex items-baseline gap-1"><span>$</span><span>{newCost.toFixed(2)}</span></div><div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse">省 82%</div></div>
                  </div>
                </div>
                <div className="lg:col-span-2 relative h-[300px] w-full"><canvas ref={chartCanvasRef2}></canvas></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal><div className="text-center mb-16"><span className="text-[#2563eb] font-semibold tracking-wider text-sm uppercase mb-2 block">Enterprise Ready</span><h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">为生产环境而生的坚实底座</h2><p className="text-slate-500 text-lg">除了智能降本，我们更关注大模型应用在商业化落地中的稳定性。</p></div></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                i: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>,
                c: 'text-[#3b82f6]', t: '无缝接入', d: '提供完全兼容 OpenAI 格式的接口。现有业务代码无需重构，改一行 BaseURL 即可生效。'
              },
              {
                i: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
                c: 'text-emerald-500', t: '高可用故障转移', d: '遇到接口限流或宕机时，在 50ms 内自动平滑切换至同级备用模型，保障业务永不掉线。'
              },
              {
                i: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>,
                c: 'text-amber-500', t: '账单透明', d: '提供细粒度的可观测 Dashboard。清晰展示每一次请求的路由决策、消耗占比及节省金额。'
              },
              {
                i: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
                c: 'text-purple-500', t: '数据隐私', d: '不存储任何业务 Prompt 内容，支持私有化部署版本，满足金融/医疗等敏感行业要求。'
              }
            ].map((feat, idx) => (
              <Reveal delay={idx * 100} key={idx}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group h-full">
                  <div className={`w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center ${feat.c} mb-6 group-hover:scale-110 transition-transform`}>
                    {feat.i}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.t}</h3><p className="text-slate-500 text-sm leading-relaxed">{feat.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="pt-24 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3b82f6]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <Reveal>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">准备好升级您的 AI 架构了吗？</h2>
            <p className="text-slate-500 mb-10 text-lg">加入全球开发者团队，立即告别高昂且低效的大模型账单。</p>
            <div className="flex justify-center mb-20">
              <button onClick={handleCtaClick} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 hover:-translate-y-1">
                {t('cta.startFree')}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </button>
            </div>
          </div>
        </Reveal>
      </footer>
    </main>
  )
}
