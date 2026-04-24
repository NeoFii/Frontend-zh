'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import * as echarts from 'echarts/core'
import { ScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import Reveal from '@/components/Reveal'
import { useUser } from '@/hooks/useUser'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = 'https://api.eucal.ai/v1/chat/completions'
const DOCS_URL = 'https://neofii.github.io/TierFlow-Doc/'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-lg border border-slate-200 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
    </div>
  ),
})

echarts.use([ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

type BenchmarkPoint = {
  name: string
  successRate: number
  cost: number
  category: 'router' | 'frontier'
  note: string
}

const benchmarkPoints: BenchmarkPoint[] = [
  {
    name: 'Eucal AI',
    successRate: 88.7,
    cost: 2.04,
    category: 'router',
    note: 'TierFlow 动态路由',
  },
  {
    name: 'Claude-opus-4.6',
    successRate: 83.1,
    cost: 14.2,
    category: 'frontier',
    note: '固定高价模型',
  },
  {
    name: 'GPT-5.4',
    successRate: 81.8,
    cost: 12.6,
    category: 'frontier',
    note: '固定高价模型',
  },
  {
    name: 'Gemini-3.0-pro',
    successRate: 78.4,
    cost: 8.9,
    category: 'frontier',
    note: '固定模型',
  },
  {
    name: 'DeepSeek-R2',
    successRate: 71.2,
    cost: 1.72,
    category: 'frontier',
    note: '低成本模型',
  },
]

const leaderBoard = [
  { rank: 1, model: 'Eucal AI / TierFlow', success: '88.7%', cost: '¥2.04', verdict: '最高成功率，成本低于 Claude/GPT' },
  { rank: 2, model: 'Claude-opus-4.6', success: '83.1%', cost: '¥14.20', verdict: '强推理，单次任务成本高' },
  { rank: 3, model: 'GPT-5.4', success: '81.8%', cost: '¥12.60', verdict: '通用能力强，价格带偏高' },
]

const workflowSteps = [
  {
    title: '识别任务形态',
    description: '将智能体请求拆成规划、工具调用、代码修复、长上下文与验证等任务片段。',
  },
  {
    title: '预测性价比区间',
    description: '结合 PinchBench 表现、实时价格、上下文长度与供应商可用性计算候选模型。',
  },
  {
    title: '按结果闭环调度',
    description: '失败、限流或低置信度时自动切换模型，把 OpenClaw 任务推进到可验证结果。',
  },
]

const scenarios = [
  { title: 'Browser Agent', metric: '88.7%', detail: 'OpenClaw 网页任务成功率', accent: 'bg-emerald-500' },
  { title: 'Code Agent', metric: '-68%', detail: '相对固定 Claude/GPT 的调用成本', accent: 'bg-blue-500' },
  { title: 'Research Agent', metric: 'ms', detail: '按上下文与检索阶段切换模型', accent: 'bg-amber-500' },
  { title: 'Ops Agent', metric: 'HA', detail: '供应商限流时自动故障转移', accent: 'bg-violet-500' },
]

const apiSnippet = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${BASE_URL}',
  apiKey: process.env.EUCAL_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'nexus-auto',
  messages: [
    {
      role: 'user',
      content: 'Run this browser task and verify the result.',
    },
  ],
});`

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function BenchmarkScatterChart() {
  const option = useMemo(
    () => ({
      color: ['#0f172a'],
      grid: { left: 54, right: 24, top: 24, bottom: 46 },
      tooltip: {
        trigger: 'item',
        formatter: (params: { data: { name: string; value: [number, number]; note: string } }) =>
          `${params.data.name}<br/>成本 ¥${params.data.value[0]} / 成功率 ${params.data.value[1]}%<br/>${params.data.note}`,
      },
      xAxis: {
        name: '成本',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 16,
        axisLabel: { formatter: '¥{value}', color: '#64748b' },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
      },
      yAxis: {
        name: '成功率',
        min: 65,
        max: 92,
        axisLabel: { formatter: '{value}%', color: '#64748b' },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: (value: [number, number]) => (value[1] >= 88 ? 22 : 15),
          data: benchmarkPoints.map((point) => ({
            name: point.name,
            value: [point.cost, point.successRate] as [number, number],
            note: point.note,
            itemStyle: {
              color: point.category === 'router' ? '#2563eb' : '#94a3b8',
              borderColor: point.category === 'router' ? '#1d4ed8' : '#64748b',
              borderWidth: 1,
            },
            label: {
              show: point.name === 'Eucal AI',
              formatter: point.name,
              position: 'top',
              color: '#1d4ed8',
              fontWeight: 700,
            },
          })),
        },
      ],
    }),
    []
  )

  return <ReactECharts option={option} style={{ height: 340, width: '100%' }} />
}

function SectionHeading(props: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">{props.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{props.title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{props.description}</p>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  useUser({ enabled: true })
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const isLoggedIn = sessionStatus === 'authenticated'
  const [copied, setCopied] = useState(false)

  const handleCtaClick = () => {
    router.push(isLoggedIn ? '/console/account/basic-information' : '/login')
  }

  const copyBaseUrl = async () => {
    if (!navigator.clipboard) return

    await navigator.clipboard.writeText(BASE_URL)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-x-hidden bg-[#f8fafc] text-slate-950 selection:bg-blue-700 selection:text-white">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8 lg:py-24">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                PinchBench · OpenClaw 实测
              </div>
              <h1 className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
                <span className="block">更高任务成功率</span>
                <span className="mt-3 block text-blue-700">更低调用成本</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
                <span className="block">让智能体用对模型，而不是用贵模型</span>
                <span className="block">Eucal AI 的 TierFlow 会根据任务阶段、实时成本与可用性自动选择模型。</span>
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  获取 API Key
                  <ArrowIcon />
                </button>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  查看文档
                </a>
              </div>
              <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Base URL</p>
                  <p className="mt-1 break-all font-mono text-sm text-slate-900">{BASE_URL}</p>
                </div>
                <button
                  type="button"
                  onClick={copyBaseUrl}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-4 self-center">
              <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">PinchBench 实测</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-300">OpenClaw</p>
                    <p className="text-xs text-slate-400">任务成功率</p>
                    <p className="mt-2 text-4xl font-bold">88.7%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">平均任务成本</p>
                    <p className="mt-2 text-4xl font-bold">¥2.04</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-300">
                  相比固定使用 Claude/GPT，TierFlow 在多阶段智能体任务中以更低成本达到更高完成率。
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm font-semibold text-slate-500">
                  <span>模型策略</span>
                  <span>任务结果</span>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-950">Eucal AI / TierFlow</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Best</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-[89%] rounded-full bg-blue-600" />
                  </div>
                  <p className="text-sm text-slate-600">动态组合模型，优先完成任务而不是锁定单一厂商。</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Benchmark"
              title="把成本和成功率放在同一张图上"
              description="参考页的 canvas 图表已收敛为 ECharts 组件，Eucal AI 的 PinchBench 成功率统一修正为 88.7。"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Reveal delay={120}>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <BenchmarkScatterChart />
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-950">排行榜</h3>
                <div className="mt-5 space-y-4">
                  {leaderBoard.map((item) => (
                    <div key={item.model} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-blue-700">#{item.rank}</p>
                          <p className="font-semibold text-slate-950">{item.model}</p>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          <p>{item.success}</p>
                          <p>{item.cost}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.verdict}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Workflow"
              title="工作原理"
              description="TierFlow 不把智能体请求一次性塞给最贵模型，而是按任务阶段持续评估、调度和回退。"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 100}>
                <div className="h-full rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Use cases"
              title="场景矩阵"
              description="同一个 nexus-auto 入口覆盖浏览器、代码、研究和运维智能体，让模型策略跟随任务变化。"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {scenarios.map((scenario, index) => (
              <Reveal key={scenario.title} delay={index * 90}>
                <div className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`h-1.5 w-12 rounded-full ${scenario.accent}`} />
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{scenario.title}</h3>
                  <p className="mt-4 text-3xl font-bold text-slate-950">{scenario.metric}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8">
          <Reveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Developer API</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">开发者接入</h2>
              <p className="mt-5 text-base leading-7 text-slate-300">
                保持 OpenAI SDK 调用方式，只替换 baseURL，并把模型名设置为 nexus-auto。Eucal AI 负责后续模型选择、重试和成本控制。
              </p>
              <p className="mt-5 inline-flex rounded-lg border border-slate-700 px-3 py-2 font-mono text-sm text-blue-200">
                nexus-auto
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-slate-400">tierflow-quickstart.ts</span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-100">
                <code>{apiSnippet}</code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="home-cta-heading" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Eucal AI</p>
            <h2 id="home-cta-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
              让 Eucal AI 接管下一次模型选择
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              在生产智能体中接入 TierFlow，用真实任务结果决定每一笔模型调用。
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleCtaClick}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                免费开始
                <ArrowIcon />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
