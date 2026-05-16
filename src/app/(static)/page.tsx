'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import { useUser } from '@/hooks/useUser'
import { useAuthStore } from '@/stores/auth'
import './homepage.css'

const DOCS_URL = 'https://neofii.github.io/TierFlow-Doc/'

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function ArrowIcon({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* --- Tech stat icons (48x48) --- */
function IconCloud() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-[26px] w-[26px]">
      <path d="M10 31c0-8 6-14 14-14s14 6 14 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M15 26c-5 0-8-3-8-7s3-7 7-7c1-5 5-8 10-8s9 3 10 8c4 0 7 3 7 7s-3 7-8 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 17v24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
function IconBrain() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-[26px] w-[26px]">
      <path d="M16 10c-5 1-8 5-8 10 0 3 1 6 4 8-1 7 4 12 11 12V10h-7Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M32 10c5 1 8 5 8 10 0 3-1 6-4 8 1 7-4 12-11 12V10h7Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M17 23h14M18 32h12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
function IconTarget() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-[26px] w-[26px]">
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="4" />
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="4" />
      <path d="M36 12 41 7M37 7h4v4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconBolt() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-[26px] w-[26px]">
      <path d="m26 4-15 22h12l-2 18 16-24H25l1-16Z" fill="currentColor" />
    </svg>
  )
}

/* --- Tech node card icons (48x48) --- */
function IconSearch() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
      <circle cx="21" cy="21" r="13" stroke="currentColor" strokeWidth="4" />
      <path d="m31 31 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
function IconClipboard() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
      <rect x="12" y="8" width="24" height="32" rx="4" stroke="currentColor" strokeWidth="4" />
      <path d="M18 19h12M18 28h8M30 5v8M18 5v8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
function IconDocument() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
      <rect x="12" y="7" width="24" height="34" rx="3" stroke="currentColor" strokeWidth="4" />
      <path d="M18 17h12M18 25h12M18 33h7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
function IconMapping() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
      <path d="M10 14h18M10 24h28M10 34h18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="36" cy="14" r="4" fill="currentColor" />
      <circle cx="18" cy="24" r="4" fill="currentColor" />
      <circle cx="36" cy="34" r="4" fill="currentColor" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
      <path d="M24 5 10 11v11c0 9 6 16 14 21 8-5 14-12 14-21V11L24 5Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="m17 24 5 5 10-11" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconSun() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
      <path d="M24 6v7M24 35v7M6 24h7M35 24h7M11 11l5 5M32 32l5 5M37 11l-5 5M16 32l-5 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

/* --- Proof section icons (24x24) --- */
function IconBenchmark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[26px] w-[26px]">
      <path d="M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0V8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v4M8 20h8M5 10H3m18 0h-2M6 5 4.5 3.5M18 5l1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Brand mark (TierFlow logo bars)                                    */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const providerTags = [
  { name: 'GPT', cls: 'hp-tag-openai', icon: 'openai' },
  { name: 'Claude', cls: 'hp-tag-claude', icon: 'anthropic' },
  { name: 'Gemini', cls: 'hp-tag-gemini', icon: 'gemini' },
  { name: 'DeepSeek', cls: 'hp-tag-deep', icon: 'deepseek' },
  { name: 'Qwen', cls: 'hp-tag-qwen', icon: 'qwen' },
  { name: 'MiniMax', cls: 'hp-tag-mini', icon: 'minimax' },
  { name: 'StepFun', cls: 'hp-tag-stepfun', icon: 'stepfun' },
  { name: 'Zhipu', cls: 'hp-tag-zhipu', icon: 'zhipu' },
]

const techStats = [
  { icon: <IconCloud />, value: '8B', label: '模型大小' },
  { icon: <IconBrain />, value: '类脑计算', label: '新范式' },
  { icon: <IconTarget />, value: '任务感知', label: '更精准' },
  { icon: <IconBolt />, value: '调度更快', label: '开销更低' },
]

const nodeCards = [
  { pos: 'hp-node-task', side: 'left', icon: <IconSearch />, title: '任务理解', desc: '理解任务目标与上下文语义' },
  { pos: 'hp-node-complex', side: 'left', icon: <IconClipboard />, title: '复杂度评估', desc: '评估当前 step 的难度与资源需求' },
  { pos: 'hp-node-context', side: 'left', icon: <IconDocument />, title: '上下文压缩', desc: '提取关键信息，生成精炼上下文' },
  { pos: 'hp-node-map', side: 'right', icon: <IconMapping />, title: '模型能力映射', desc: '理解不同模型的能力边界与特长' },
  { pos: 'hp-node-cost', side: 'right', icon: <IconShield />, title: '成本预测', desc: '预测 Token 消耗与延迟成本' },
  { pos: 'hp-node-decision', side: 'right', icon: <IconSun />, title: '决策输出', desc: '输出最优模型与执行策略' },
]

const rankData = [
  { rank: 1, model: 'TierFlow', score: '88.7%', barWidth: '100%', cost: '2.04', winner: true, icon: 'tierflow' as const },
  { rank: 2, model: 'Claude-opus-4.6', score: '82.3%', barWidth: '92.8%', cost: '17.62', winner: false, icon: '/icons/providers/anthropic.png' },
  { rank: 3, model: 'Claude-Sonnet-4.5', score: '80.7%', barWidth: '91%', cost: '15.52', winner: false, icon: '/icons/providers/anthropic.png' },
]


/* ------------------------------------------------------------------ */
/*  Section components                                                 */
/* ------------------------------------------------------------------ */

function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative z-[1] pb-6 pt-14">
      <div className="hp-wrap grid min-h-[480px] items-center gap-8 lg:grid-cols-[minmax(420px,1fr)_minmax(400px,0.85fr)]">
        {/* Left — message */}
        <Reveal>
          <div className="max-w-[620px] pb-5">
            <h1
              className="hp-brand-word mb-5 text-[clamp(52px,6.5vw,88px)] font-black leading-[0.88]"
            >
              TierFlow
            </h1>

            <h2 className="mb-0 text-[clamp(22px,2.2vw,32px)] font-black leading-[1.2] tracking-[-0.03em] text-[#07113b]">
              智能体时代的 Token 优化引擎
            </h2>

            <div className="my-6 h-1 w-[74px] rounded-full bg-[#0759ff] shadow-[0_8px_18px_rgba(7,89,255,0.24)]" aria-hidden="true" />

            <p className="max-w-[620px] text-[clamp(15px,1.1vw,18px)] font-medium leading-[1.7] text-[#4a5172]">
              TierFlow 通过自研BrainNet-8B引擎实现Token调度与上下文管理，
              <br className="hidden sm:block" />
              在保证效果的同时<strong className="font-semibold text-[#0759ff]">显著降低成本</strong>，释放<strong className="font-semibold text-[#0759ff]">AI 应用生产力</strong>。
            </p>

            <div className="hp-hero-cta mt-8 flex flex-wrap gap-[18px]">
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex min-h-[48px] min-w-[142px] items-center justify-center gap-[9px] rounded-[10px] border border-transparent bg-gradient-to-br from-[#174fff] to-[#1267ff] px-5 text-base font-bold text-white shadow-[0_14px_30px_rgba(20,86,255,0.26)] transition hover:-translate-y-0.5"
              >
                获取 API
                <ArrowIcon />
              </button>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] min-w-[142px] items-center justify-center gap-[9px] rounded-[10px] border border-[#cddcff] bg-white/60 px-5 text-base font-bold text-[#06153f] transition hover:-translate-y-0.5"
              >
                查看文档
              </a>
            </div>
          </div>
        </Reveal>

        {/* Right — 3D visual */}
        <Reveal delay={120}>
          <div className="hp-visual" aria-label="TierFlow 智能调度芯片示意图">
            {/* Diamond nodes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="hp-node" />
            ))}

            {/* Provider tags */}
            {providerTags.map((tag) => (
              <div key={tag.name} className={`hp-tag ${tag.cls}`}>
                <Image
                  src={`/icons/providers/${tag.icon}.png`}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 flex-shrink-0 object-contain"
                  aria-hidden="true"
                />
                {tag.name}
              </div>
            ))}

            {/* Glow + Cube */}
            <div className="hp-chip-glow" aria-hidden="true" />
            <div className="hp-cube" aria-hidden="true">
              <div className="hp-cube-face hp-cube-face-front" />
              <div className="hp-cube-logo">
                <span className="hp-cube-logo-bar" />
                <span className="hp-cube-logo-bar" />
                <span className="hp-cube-logo-bar" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TechSection() {
  return (
    <section className="hp-tech-section relative z-[2] overflow-hidden py-16">
      <div className="hp-wrap relative grid items-center gap-12 lg:grid-cols-[minmax(430px,0.9fr)_minmax(640px,1.1fr)]">
        {/* Left — text */}
        <Reveal>
          <div>
            <div className="mb-7 inline-flex items-center gap-3 text-lg font-extrabold text-[#184dff]">
              <span className="h-3 w-3 rounded-full bg-[#3439ff] shadow-[0_0_20px_rgba(52,57,255,0.45)]" />
              核心技术 / Core Technology
            </div>

            <h2 className="hp-tech-title mb-4 text-[clamp(22px,2.2vw,30px)] font-black leading-[1.2] text-[#07113b]">
              类脑任务感知模型
              <span className="hp-tech-model-name mt-2 block text-[clamp(36px,3.8vw,56px)] leading-[1.05]">
                BrainNet-8B
              </span>
            </h2>

            <p className="hp-tech-copy mb-6 max-w-[560px] text-base font-medium leading-[1.65] text-[#4a5172]">
              TierFlow 自研并训练的 <strong className="font-extrabold text-[#184dff]">8B</strong> 任务感知模型，基于类脑计算范式，让智能体在每个 step 精准感知任务需求，动态选择最优模型与执行路径，实现 Token 成本的数量级下降。
            </p>

            <div className="grid max-w-[560px] grid-cols-2 gap-3 sm:grid-cols-4" aria-label="BrainNet-8B 核心指标">
              {techStats.map((stat) => (
                <div
                  key={stat.value}
                  className="grid min-h-[118px] content-center justify-items-center gap-[9px] rounded-[18px] border border-[#e1e9f8] bg-white/70 p-[18px_10px] text-center shadow-[0_18px_42px_rgba(42,92,198,0.09)]"
                >
                  <div className="grid h-[42px] w-[42px] place-items-center text-[#463cff]">
                    {stat.icon}
                  </div>
                  <strong className="text-[19px] leading-[1.15] text-[#10184a]">{stat.value}</strong>
                  <span className="text-[15px] font-bold text-[#35456f]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — BrainNet visual */}
        <Reveal delay={150}>
          <div className="hp-tech-visual" aria-label="BrainNet-8B 类脑任务感知模型">
            {/* Dashed connection lines */}
            {['l1', 'l2', 'l3'].map((id) => (
              <span key={id} className={`hp-brain-link hp-brain-link-left hp-brain-link-${id}`} />
            ))}
            {['r1', 'r2', 'r3'].map((id) => (
              <span key={id} className={`hp-brain-link hp-brain-link-right hp-brain-link-${id}`} />
            ))}

            {/* Node cards */}
            {nodeCards.map((card) => (
              <article
                key={card.title}
                className={`hp-tech-node-card hp-tech-node-card-${card.side} ${card.pos}`}
              >
                <div className="text-[#4b45ff]">{card.icon}</div>
                <div>
                  <h3 className="mb-1.5 text-[17px] font-black leading-[1.1] text-[#10184a]">{card.title}</h3>
                  <p className="text-[13px] font-semibold leading-[1.45] text-[#2c3d73]">{card.desc}</p>
                </div>
              </article>
            ))}

            {/* Brain core panel */}
            <div className="hp-brain-core" aria-hidden="true">
              <div className="mb-5 flex items-center justify-between text-lg font-black text-[#07133d]">
                BrainNet-8B
                <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#1b62ff]">router</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Task', '8B', 'Cost', 'Ctx', 'Policy', 'Model'].map((cell) => (
                  <span
                    key={cell}
                    className={`grid min-h-[58px] place-items-center rounded-2xl border text-sm font-black ${
                      cell === '8B'
                        ? 'border-transparent bg-gradient-to-br from-[#226cff] to-[#0b43d7] text-white shadow-[0_18px_36px_rgba(31,91,210,0.24)]'
                        : 'border-[#d7e5ff] bg-white/70 text-[#174fff] shadow-[0_10px_24px_rgba(31,91,210,0.08)]'
                    }`}
                  >
                    {cell}
                  </span>
                ))}
              </div>
              {/* Path dots */}
              <div className="relative mx-[8%] my-4 h-[38px]">
                <span className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-[rgba(24,103,255,0.34)]" />
                {[0, 48, 100].map((left) => (
                  <span
                    key={left}
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#1e67ff] shadow-[0_0_18px_rgba(30,103,255,0.42)]"
                    style={{ left: `${left}%` }}
                  />
                ))}
              </div>
              <p className="text-sm font-bold leading-[1.5] text-[#304273]">
                按任务复杂度、上下文规模和成本预算，选择最合适的模型路径。
              </p>
            </div>

            {/* Stage ellipse + label */}
            <div className="hp-brain-stage" aria-hidden="true" />
            <div className="hp-brain-label absolute bottom-[78px] left-1/2 z-[3] -translate-x-1/2 text-[22px] font-black text-[#0d35d9]">
              BrainNet-8B
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ProofSection() {
  return (
    <section className="hp-proof-section relative z-[2] overflow-hidden py-[72px_0_86px]">
      <div className="hp-wrap">
        {/* Heading */}
        <Reveal>
          <h2 className="hp-proof-heading mb-4 text-[clamp(22px,2.2vw,30px)] font-black leading-[1.2] text-[#07113b]">
            效果验证
          </h2>
          <p className="hp-proof-lead mb-7 max-w-[860px] text-base font-medium leading-[1.6] text-[#4a5172]">
            TierFlow 助力 <strong className="text-[#0759ff]">OpenClaw</strong> 在 <strong className="text-[#0759ff]">PinchBench</strong> 基准测试中取得顶尖表现
          </p>
        </Reveal>

        <div className="grid gap-6">
          {/* Benchmark card */}
          <Reveal delay={100}>
            <article className="hp-benchmark-card rounded-2xl border border-[#bfd2ff] bg-white/80 p-6 shadow-[0_18px_42px_rgba(19,83,205,0.08)] backdrop-blur-[18px]">
              {/* Head */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
                <div className="hp-benchmark-name inline-flex items-center gap-3 text-lg font-black text-[#06133e]">
                  <span className="grid h-[34px] w-[34px] place-items-center rounded-xl bg-gradient-to-br from-[rgba(240,249,255,0.95)] to-[rgba(219,234,255,0.9)] text-[#0f5fff] shadow-[inset_0_0_0_1px_rgba(166,198,255,0.56)]">
                    <IconBenchmark />
                  </span>
                  PinchBench 基准测试 Top 对比
                </div>
                <div className="flex flex-wrap justify-end gap-4 text-[13px] font-bold text-[#405080]" aria-hidden="true">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-[11px] w-[11px] rounded-[3px] bg-[#145aff]" />
                    任务成功率
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-[11px] w-[11px] rounded-[3px] bg-[#cfe0ff]" />
                    成本（CNY）
                  </span>
                </div>
              </div>

              {/* Labels row (desktop) */}
              <div className="mb-0 hidden min-h-[40px] grid-cols-[60px_minmax(180px,1fr)_minmax(180px,0.5fr)_80px] items-center gap-4 px-4 text-[14px] font-extrabold text-[#233563] md:grid">
                <span>排名</span>
                <span>模型</span>
                <span>任务成功率</span>
                <span>成本（CNY）</span>
              </div>

              {/* Rank rows */}
              <div className="grid gap-3.5">
                {rankData.map((row) => (
                  <div
                    key={row.rank}
                    className={`hp-rank-row grid min-h-[56px] items-center gap-3 overflow-hidden rounded-[11px] border px-4 py-3 text-[15px] font-bold text-[#07113b] md:grid-cols-[60px_minmax(180px,1fr)_minmax(180px,0.5fr)_80px] md:gap-4 md:px-4 md:py-0 ${
                      row.winner
                        ? 'border-[#6f98ff] bg-gradient-to-r from-[rgba(234,244,255,0.92)] to-[rgba(255,255,255,0.86)] shadow-[inset_0_0_0_1px_rgba(57,113,255,0.18)]'
                        : 'border-[#e2eaff] bg-white/75'
                    }`}
                  >
                    {/* Rank number */}
                    <span
                      className={`grid h-[30px] w-[30px] place-items-center rounded-[10px] font-extrabold ${
                        row.winner
                          ? 'bg-gradient-to-br from-[#2d7cff] to-[#0b4cff] text-white shadow-[0_10px_20px_rgba(18,84,255,0.22)]'
                          : 'bg-[#f4f8ff] text-[#07133d] shadow-[inset_0_0_0_1px_#dce7ff]'
                      }`}
                    >
                      {row.rank}
                    </span>

                    {/* Model name */}
                    <span className="inline-flex items-center gap-2.5">
                      {row.icon === 'tierflow' ? (
                        <span className="grid h-5 w-5 flex-shrink-0 place-items-center">
                          <svg viewBox="0 0 100 64" fill="none" className="h-full w-full">
                            <defs>
                              <linearGradient id="tf-rank-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4A3AF8" />
                                <stop offset="100%" stopColor="#256BFB" />
                              </linearGradient>
                            </defs>
                            <g fill="url(#tf-rank-grad)">
                              <rect x="0" y="0" width="16" height="16" rx="8" />
                              <rect x="24" y="0" width="76" height="16" rx="8" />
                              <rect x="0" y="24" width="100" height="16" rx="8" />
                              <rect x="0" y="48" width="16" height="16" rx="8" />
                              <rect x="24" y="48" width="52" height="16" rx="8" />
                              <rect x="84" y="48" width="16" height="16" rx="8" />
                            </g>
                          </svg>
                        </span>
                      ) : (
                        <Image
                          src={row.icon as string}
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6 flex-shrink-0 object-contain"
                          aria-hidden="true"
                        />
                      )}
                      {row.model}
                    </span>

                    {/* Score bar + value */}
                    <span className="hp-rank-score grid grid-cols-[1fr_64px] items-center gap-4">
                      <span
                        className="hp-bar-track"
                        style={{ '--score': row.barWidth } as React.CSSProperties}
                      />
                      <span className={row.winner ? 'font-black text-[#0b56ff]' : ''}>{row.score}</span>
                    </span>

                    {/* Cost */}
                    <span className="hp-rank-cost">{row.cost}</span>
                  </div>
                ))}
              </div>

            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA Section                                                        */
/* ------------------------------------------------------------------ */

function CTASection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative z-[2] pt-5 pb-20">
      <div className="hp-cta-wrap">
        <Reveal>
          <div className="hp-cta-banner">
            {/* Decorative art */}
            <div className="hp-cta-art">
              <div className="hp-cta-shard hp-cta-shard-s1" />
              <div className="hp-cta-shard hp-cta-shard-s2" />
              <div className="hp-cta-browser">
                <div className="hp-cta-browser-bar">
                  <i /><i /><i />
                </div>
                <div className="hp-cta-browser-body">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text + actions */}
            <div>
              <h3 className="hp-cta-title text-[24px] font-bold tracking-[-0.01em] text-[#0f1535] mb-3">
                让每一次AI调用都更聪明
              </h3>
              <p className="hp-cta-desc text-[15px] text-[#4a5172] mb-6">
                TierFlow 帮助你降低成本、提升效率、保障稳定，为你的智能体应用提供坚实的推理引擎。
              </p>
              <div className="hp-cta-actions flex justify-center gap-[14px]">
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-transparent bg-gradient-to-r from-[#3b56ff] to-[#4a3dff] px-8 py-[14px] text-base font-semibold text-white shadow-[0_10px_24px_rgba(60,80,255,0.28)] transition hover:-translate-y-px hover:shadow-[0_14px_32px_rgba(60,80,255,0.36)]"
                >
                  免费试用
                </button>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#e5e8f3] bg-white px-8 py-[14px] text-base font-semibold text-[#0f1535] transition hover:bg-[#fafbff] hover:border-[#d4d8e8]"
                >
                  查看文档
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}


/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const router = useRouter()
  useUser({ enabled: true })
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const isLoggedIn = sessionStatus === 'authenticated'

  const handleCtaClick = () => {
    router.push(isLoggedIn ? '/console/account/basic-information' : '/login')
  }

  return (
    <div className="hp-page relative">
      <HeroSection onCtaClick={handleCtaClick} />
      <TechSection />
      <ProofSection />
      <CTASection onCtaClick={handleCtaClick} />
    </div>
  )
}
