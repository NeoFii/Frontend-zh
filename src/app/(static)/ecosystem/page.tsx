'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useEffect, useState } from 'react'

// 定义进入动画的 Tailwind 类组合
const animationClasses = {
  container: 'transition-all duration-1000 ease-out',
  hidden: 'opacity-0 translate-y-12',
  visible: 'opacity-100 translate-y-0',
}

// 提取：极客风互动交互按钮组件
const PartnerInteractionBtn = ({ href }: { href: string }) => {
  return (
    <a href={href} className="inline-block relative z-10 p-6 no-underline">
      <div className="btn-container">
        <div className="btn-drawer transition-top">加入我们！</div>
        <div className="btn-drawer transition-bottom">大家庭！</div>

        <button className="btn">
          <span className="btn-text">成为合作伙伴</span>
        </button>

        <svg className="btn-corner" xmlns="http://www.w3.org/2000/svg" viewBox="-1 1 32 32">
          <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z"></path>
        </svg>
        <svg className="btn-corner" xmlns="http://www.w3.org/2000/svg" viewBox="-1 1 32 32">
          <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z"></path>
        </svg>
        <svg className="btn-corner" xmlns="http://www.w3.org/2000/svg" viewBox="-1 1 32 32">
          <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z"></path>
        </svg>
        <svg className="btn-corner" xmlns="http://www.w3.org/2000/svg" viewBox="-1 1 32 32">
          <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z"></path>
        </svg>
      </div>
    </a>
  )
}

export default function EcosystemPage() {
  const { t } = useTranslation('ecosystem')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 提取合作伙伴数据，生成足够长的数组以实现无缝无限滚动
  const basePartners = [t('partnerA'), t('partnerB'), t('partnerC'), t('partnerD')]
  // 复制三次确保单屏宽度被填满，然后再在渲染时复制一份实现 translateX(-50%) 的无缝循环
  const marqueeBlock = [...basePartners, ...basePartners, ...basePartners, ...basePartners]

  return (
    <main className="relative flex flex-col items-center w-full overflow-hidden flex-1 pb-[120px] min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- 背景光晕装饰 --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-40 pointer-events-none -z-10 flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      {/* --- 1 & 2. 沉浸式 Hero 区块 (流光 Logo 墙 + 悬浮内容) --- */}
      <div className="relative w-full min-h-[700px] md:min-h-[85vh] flex items-center justify-center overflow-hidden mb-[48px]">

        {/* 背景层：无限滚动 Marquee */}
        {/* 使用 mask-image 添加边缘羽化过渡效果 */}
        <div
          className="absolute inset-0 z-0 flex flex-col justify-center gap-6 opacity-60 scale-110"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
        >
          {/* 第一行：向左滚动 */}
          <div className="flex gap-6 animate-marquee-left w-max">
            {[...marqueeBlock, ...marqueeBlock].map((partner, index) => (
              <div
                key={`row1-${index}`}
                className="w-48 h-32 md:w-64 md:h-40 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm"
              >
                <span className="text-xl md:text-2xl font-bold text-slate-400/80">{partner}</span>
              </div>
            ))}
          </div>

          {/* 第二行：向右滚动 */}
          <div className="flex gap-6 animate-marquee-right w-max ml-[-400px]">
            {[...marqueeBlock, ...marqueeBlock].map((partner, index) => (
              <div
                key={`row2-${index}`}
                className="w-48 h-32 md:w-64 md:h-40 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm"
              >
                <span className="text-xl md:text-2xl font-bold text-slate-400/80">{partner}</span>
              </div>
            ))}
          </div>

          {/* 第三行：向左滚动 */}
          <div className="flex gap-6 animate-marquee-left w-max ml-[-200px]">
            {[...marqueeBlock, ...marqueeBlock].map((partner, index) => (
              <div
                key={`row3-${index}`}
                className="w-48 h-32 md:w-64 md:h-40 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm"
              >
                <span className="text-xl md:text-2xl font-bold text-slate-400/80">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ============= 前景层：居中的毛玻璃内容卡片 =============== */}
        {/* ========================================================= */}
        <div
          className={`relative z-10 mx-6 px-8 py-12 md:px-16 md:py-16 w-full max-w-[900px] flex flex-col items-center
            bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem]
            ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-200`}
        >
          {/* 徽章也稍微通透一点 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/30 border border-blue-200/30 text-blue-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Open Ecosystem
          </div>

          <h1 className="m-0 p-0 text-center text-5xl md:text-6xl font-extrabold tracking-tight leading-tight pb-4 max-w-[800px]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              {t('title')}
            </span>
          </h1>

          <div className="flex flex-col items-center max-w-[600px] space-y-4 mt-2">
            {/* 调亮文本颜色，使其在玻璃上更清晰 */}
            <p className="text-slate-900 text-lg md:text-xl font-medium text-center">
              {t('subtitle')}
            </p>
            <p className="text-slate-600 text-base font-normal leading-relaxed text-center">
              {t('description')}
            </p>
          </div>

          {/* 顶部 CTA 按钮 */}
          <div className="flex items-center justify-center pt-8">
            <PartnerInteractionBtn href="mailto:partnership@example.com" />
          </div>
        </div>
      </div>

      {/* --- 3. 合作方式 --- */}
      <div
        className={`w-full px-6 lg:px-0 max-w-[1000px] py-16 ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-600`}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">
          {t('cooperation')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 技术合作 */}
          <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('technical')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                  {t('technicalDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* 渠道合作 */}
          <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('channel')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                  {t('channelDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* 解决方案合作 */}
          <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('solution')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                  {t('solutionDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* 战略合作 */}
          <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-300 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('strategic')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                  {t('strategicDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. 合作伙伴权益 --- */}
      <div
        className={`w-full px-6 lg:px-0 max-w-[900px] py-16 ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-800`}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-10">
          {t('benefits')}
        </h2>

        <div className="bg-white rounded-3xl p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="flex items-start gap-4 group cursor-default">
                <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
                    {t(`benefit${num}`)}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {t(`benefit${num}Desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 5. 联系我们 --- */}
      <div
        className={`w-full px-6 lg:px-0 max-w-[900px] pt-8 pb-16 ${animationClasses.container
          } ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-1000`}
      >
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center text-center shadow-2xl">
          {/* Deep dark card internal glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-violet-600/30 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="relative z-10 text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            {t('contact')}
          </h2>
          <p className="relative z-10 text-base md:text-lg text-slate-300 mb-10 max-w-[500px]">
            {t('contactDesc')}
          </p>

          <div className="relative z-10">
            <a
              href="mailto:partnership@example.com"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl text-base font-bold shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>partnership@example.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ================= CSS 动画及互动按钮样式注入 ================== */}
      {/* ========================================================= */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* 无限滚动 Marquee 动画 */
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* translateX(-50%) 配合两倍元素实现无缝衔接 */
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 60s linear infinite;
        }

        /* 互动交互按钮的原始 CSS 保持不变 */
        .btn-container {
          --btn-color: #d8ff7c;
          --corner-color: #0002;
          --corner-dist: 24px;
          --corner-multiplier: 1.5;
          --timing-function: cubic-bezier(0, 0, 0, 2.5);
          --duration: 250ms;

          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .btn {
          position: relative;
          min-width: 200px;
          min-height: calc(var(--corner-dist) * 2.2);
          border-radius: 16px;
          border: none;
          padding: 0.5em 1.5em;

          background: linear-gradient(#fff2, #0001), var(--btn-color);
          box-shadow:
            1px 1px 2px -1px #fff inset,
            0 2px 1px #00000010,
            0 4px 2px #00000010,
            0 8px 4px #00000010,
            0 16px 8px #00000010,
            0 32px 16px #00000010;

          transition:
            transform var(--duration) var(--timing-function),
            filter var(--duration) var(--timing-function);
          -webkit-transition:
            transform var(--duration) var(--timing-function),
            -webkit-filter var(--duration) var(--timing-function);

          cursor: pointer;
        }

        .btn-drawer {
          position: absolute;
          display: flex;
          justify-content: center;

          min-height: 32px;
          border-radius: 16px;
          border: none;
          padding: 0.25em 1em;
          font-size: 0.85em;
          font-weight: 600;
          font-family: inherit;
          color: #0009;

          background: linear-gradient(#fff2, #0001), var(--btn-color);
          background-color: #fbff13;
          opacity: 0;

          transition:
            transform calc(0.5 * var(--duration)) ease,
            filter var(--duration) var(--timing-function),
            opacity calc(0.5 * var(--duration)) ease;
          -webkit-transition:
            transform calc(0.5 * var(--duration)) ease,
            -webkit-filter var(--duration) var(--timing-function),
            opacity calc(0.5 * var(--duration)) ease;
          filter: blur(2px);
          -webkit-filter: blur(2px);
        }

        .transition-top {
          top: 0;
          left: 0;
          border-radius: 12px 12px 0 0;
          align-items: start;
        }
        .transition-bottom {
          bottom: 0;
          right: 0;
          border-radius: 0 0 12px 12px;
          align-items: end;
        }

        .btn-text {
          display: inline-block;
          font-size: 1.15em;
          font-family: inherit;
          font-weight: 700;
          color: #5550;

          background-image: linear-gradient(#444, #000a);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 #fff6) drop-shadow(0 -1px 0 #0006);
          -webkit-filter: drop-shadow(0 1px 0 #fff6) drop-shadow(0 -1px 0 #0006);

          transition:
            transform var(--duration) var(--timing-function),
            filter var(--duration) var(--timing-function),
            color var(--duration) var(--timing-function);
          -webkit-transition:
            transform var(--duration) var(--timing-function),
            -webkit-filter var(--duration) var(--timing-function),
            color var(--duration) var(--timing-function);
        }

        .btn-corner {
          position: absolute;
          width: 32px;
          fill: none;
          stroke: var(--corner-color);

          transition:
            transform var(--duration) var(--timing-function),
            filter var(--duration) var(--timing-function);
          -webkit-transition:
            transform var(--duration) var(--timing-function),
            -webkit-filter var(--duration) var(--timing-function);
        }

        .btn-corner:nth-of-type(1) {
          top: 0;
          left: 0;
          transform: translate( calc(-1 * var(--corner-dist)), calc(-1 * var(--corner-dist)) ) rotate(90deg);
        }
        .btn-corner:nth-of-type(2) {
          top: 0;
          right: 0;
          transform: translate(var(--corner-dist), calc(-1 * var(--corner-dist))) rotate(180deg);
        }
        .btn-corner:nth-of-type(3) {
          bottom: 0;
          right: 0;
          transform: translate(var(--corner-dist), var(--corner-dist)) rotate(-90deg);
        }
        .btn-corner:nth-of-type(4) {
          bottom: 0;
          left: 0;
          transform: translate(calc(-1 * var(--corner-dist)), var(--corner-dist)) rotate(0deg);
        }

        /* Hover & Focus States - 解耦展开以兼容旧版引擎 */
        .btn-container:hover .btn,
        .btn-container:focus-within .btn {
          transform: scale(1.05);
          filter: drop-shadow(0 16px 16px #0002);
          -webkit-filter: drop-shadow(0 16px 16px #0002);
        }

        .btn-container:hover .transition-top,
        .btn-container:focus-within .transition-top {
          transform: translateY(-24px) rotateZ(4deg);
          filter: blur(0px);
          -webkit-filter: blur(0px);
          animation: hue-anim 3s infinite linear;
          -webkit-animation: hue-anim 3s infinite linear;
          opacity: 1;
        }

        .btn-container:hover .transition-bottom,
        .btn-container:focus-within .transition-bottom {
          transform: translateY(24px) rotateZ(4deg);
          filter: blur(0px);
          -webkit-filter: blur(0px);
          animation: hue-anim 3s infinite linear;
          -webkit-animation: hue-anim 3s infinite linear;
          opacity: 1;
        }

        .btn-container:hover .btn-text,
        .btn-container:focus-within .btn-text {
          filter: drop-shadow(0 1px 0 #fff6) drop-shadow(0 -1px 0 #0006) drop-shadow(0px 6px 2px #0003);
          -webkit-filter: drop-shadow(0 1px 0 #fff6) drop-shadow(0 -1px 0 #0006) drop-shadow(0px 6px 2px #0003);
          transform: scale(1.05);
          color: #0008;
        }

        .btn-container:hover .btn-corner:first-of-type,
        .btn-container:focus-within .btn-corner:first-of-type {
          transform: translate( calc(-1 * var(--corner-multiplier) * var(--corner-dist)), calc(-1 * var(--corner-multiplier) * var(--corner-dist)) ) rotate(90deg);
          filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
          -webkit-filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
        }

        .btn-container:hover .btn-corner:nth-of-type(2),
        .btn-container:focus-within .btn-corner:nth-of-type(2) {
          transform: translate( calc(var(--corner-multiplier) * var(--corner-dist)), calc(-1 * var(--corner-multiplier) * var(--corner-dist)) ) rotate(180deg);
          filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
          -webkit-filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
        }

        .btn-container:hover .btn-corner:nth-of-type(3),
        .btn-container:focus-within .btn-corner:nth-of-type(3) {
          transform: translate( calc(var(--corner-multiplier) * var(--corner-dist)), calc(var(--corner-multiplier) * var(--corner-dist)) ) rotate(-90deg);
          filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
          -webkit-filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
        }

        .btn-container:hover .btn-corner:nth-of-type(4),
        .btn-container:focus-within .btn-corner:nth-of-type(4) {
          transform: translate( calc(-1 * var(--corner-multiplier) * var(--corner-dist)), calc(var(--corner-multiplier) * var(--corner-dist)) ) rotate(0deg);
          filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
          -webkit-filter: drop-shadow(-10px 10px 1px rgba(0,0,0,0.25)) drop-shadow(-20px 20px 2px rgba(0,0,0,0.25));
        }

        /* Active (Click) States */
        .btn-container:active .btn {
          transform: scale(0.95);
          filter: drop-shadow(0 10px 4px #0002);
          -webkit-filter: drop-shadow(0 10px 4px #0002);
        }
        .btn-container:active .transition-top,
        .btn-container:active .transition-bottom {
          transform: translateY(0px) scale(0.5);
        }
        .btn-container:active .btn-text {
          filter: drop-shadow(0 1px 0 #fff6) drop-shadow(0 -1px 0 #0006) drop-shadow(0px 6px 2px #0003);
          -webkit-filter: drop-shadow(0 1px 0 #fff6) drop-shadow(0 -1px 0 #0006) drop-shadow(0px 6px 2px #0003);
          transform: scale(1);
          color: #000a;
        }

        @keyframes hue-anim {
          0%, 100% { filter: hue-rotate(0deg); -webkit-filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(-70deg); -webkit-filter: hue-rotate(-70deg); }
        }
        @-webkit-keyframes hue-anim {
          0%, 100% { -webkit-filter: hue-rotate(0deg); }
          50% { -webkit-filter: hue-rotate(-70deg); }
        }
      `}} />
    </main>
  )
}