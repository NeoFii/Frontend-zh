'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

// 动态导入 ECharts，添加加载状态
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  ),
})

// ECharts 按需加载配置
import * as echarts from 'echarts/core'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册需要的组件
echarts.use([
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
])

// 模型颜色映射 - 相同模型在不同图表中使用相同颜色
const MODEL_COLORS: Record<string, string> = {
  'GPT-4o': '#f97316',      // 橙色
  'Claude-3.5': '#8B5CF6',  // 紫色
  'Gemini Pro': '#10B981',   // 绿色
  'Llama-3': '#3B82F6',     // 蓝色
  'GPT-4': '#F59E0B',       // 黄色
  'DeepSeek': '#EC4899',     // 粉色
  'Moonshot': '#06B6D4',    // 青色
}

// 可选的参考模型列表
const REFERENCE_MODELS = [
  { id: 'claude-3.5', name: 'Claude-3.5', color: '#8B5CF6' },
  { id: 'gpt-4o', name: 'GPT-4o', color: '#f97316' },
  { id: 'gpt-4', name: 'GPT-4', color: '#F59E0B' },
  { id: 'gemini-pro', name: 'Gemini Pro', color: '#10B981' },
]

// 成本倍数：各模型换成参考模型需要乘以的倍数
// 价格从高到低：Claude-3.5 > GPT-4 > GPT-4o > Gemini Pro > Llama-3 > DeepSeek > Moonshot
const COST_MULTIPLIERS: Record<string, Record<string, number>> = {
  // 参考 Claude-3.5：其他模型换成 Claude-3.5 需要多少钱
  'claude-3.5': {
    'Claude-3.5': 1,
    'GPT-4o': 1.15,      // GPT-4o 换成 Claude-3.5 需要 1.15 倍
    'GPT-4': 0.9,        // GPT-4 换成 Claude-3.5 只需 0.9 倍（Claude 更贵）
    'Gemini Pro': 5.5,    // Gemini Pro 换成 Claude-3.5 需要 5.5 倍
    'Llama-3': 9,        // Llama-3 换成 Claude-3.5 需要 9 倍
    'DeepSeek': 12,      // DeepSeek 换成 Claude-3.5 需要 12 倍
    'Moonshot': 3,       // Moonshot 换成 Claude-3.5 需要 3 倍
  },
  // 参考 GPT-4o
  'gpt-4o': {
    'Claude-3.5': 0.87,  // Claude-3.5 换成 GPT-4o 只需 0.87 倍（Claude 更贵）
    'GPT-4o': 1,
    'GPT-4': 0.78,       // GPT-4 换成 GPT-4o 只需 0.78 倍
    'Gemini Pro': 4.8,    // Gemini Pro 换成 GPT-4o 需要 4.8 倍
    'Llama-3': 7.8,      // Llama-3 换成 GPT-4o 需要 7.8 倍
    'DeepSeek': 10.4,    // DeepSeek 换成 GPT-4o 需要 10.4 倍
    'Moonshot': 2.6,     // Moonshot 换成 GPT-4o 需要 2.6 倍
  },
  // 参考 GPT-4
  'gpt-4': {
    'Claude-3.5': 1.1,   // Claude-3.5 换成 GPT-4 需要 1.1 倍
    'GPT-4o': 1.28,      // GPT-4o 换成 GPT-4 需要 1.28 倍
    'GPT-4': 1,
    'Gemini Pro': 6,      // Gemini Pro 换成 GPT-4 需要 6 倍
    'Llama-3': 10,       // Llama-3 换成 GPT-4 需要 10 倍
    'DeepSeek': 13.3,   // DeepSeek 换成 GPT-4 需要 13.3 倍
    'Moonshot': 3.3,     // Moonshot 换成 GPT-4 需要 3.3 倍
  },
  // 参考 Gemini Pro：显示相对于"更贵的商业模型方案"的节省
  'gemini-pro': {
    // 这里表示：相对于全用 GPT-4o 级别的高端商业模型，我们节省了多少
    // 实际上是把其他模型换成高端商业模型的成本
    'Claude-3.5': 0.5,   // 换成高端模型约 0.5 倍
    'GPT-4o': 0.6,       // 换成高端模型约 0.6 倍
    'GPT-4': 0.45,       // 换成高端模型约 0.45 倍
    'Gemini Pro': 3,      // Gemini Pro 换成高端模型需要 3 倍（高端模型比 Gemini 贵 3 倍）
    'Llama-3': 5,        // Llama-3 换成高端模型需要 5 倍
    'DeepSeek': 6,       // DeepSeek 换成高端模型需要 6 倍
    'Moonshot': 2,       // Moonshot 换成高端模型需要 2 倍
  },
}

// 不同时间范围的数据集
const timeRangeData = {
  '24h': {
    summary: { totalRequests: 1850, totalTokens: 680000, totalCost: 18.50, avgLatency: 1.1 },
    modelData: [
      { model: 'GPT-4o', cost: 6.5, requests: 520 },
      { model: 'Claude-3.5', cost: 5.2, requests: 480 },
      { model: 'Gemini Pro', cost: 3.8, requests: 420 },
      { model: 'Llama-3', cost: 2.1, requests: 280 },
      { model: 'GPT-4', cost: 0.9, requests: 150 },
    ],
    trendData: {
      dates: ['02-26'],
      requests: [1850],
      tokens: [680000],
      cost: [18.5],
    },
    tokenTrendData: {
      dates: ['02-26'],
      inputTokens: [420000],
      outputTokens: [260000],
    },
  },
  '7d': {
    summary: { totalRequests: 12580, totalTokens: 4567280, totalCost: 128.45, avgLatency: 1.2 },
    modelData: [
      { model: 'Claude-3.5', cost: 45.8, requests: 3200 },
      { model: 'GPT-4o', cost: 38.2, requests: 2800 },
      { model: 'Gemini Pro', cost: 22.4, requests: 2400 },
      { model: 'Llama-3', cost: 14.2, requests: 1800 },
      { model: 'GPT-4', cost: 7.85, requests: 980 },
    ],
    trendData: {
      dates: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
      requests: [1200, 1350, 1280, 1450, 1320, 1580, 1250],
      tokens: [450000, 520000, 480000, 550000, 490000, 620000, 510000],
      cost: [12.5, 14.2, 13.8, 15.5, 14.0, 17.2, 15.0],
    },
    tokenTrendData: {
      dates: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
      inputTokens: [180000, 210000, 195000, 220000, 200000, 250000, 210000],
      outputTokens: [120000, 150000, 135000, 170000, 140000, 190000, 150000],
    },
  },
  '30d': {
    summary: { totalRequests: 52800, totalTokens: 19200000, totalCost: 542.30, avgLatency: 1.3 },
    modelData: [
      { model: 'GPT-4o', cost: 185.5, requests: 12500 },
      { model: 'Claude-3.5', cost: 168.2, requests: 11200 },
      { model: 'Gemini Pro', cost: 98.6, requests: 9800 },
      { model: 'Llama-3', cost: 62.8, requests: 7200 },
      { model: 'GPT-4', cost: 27.2, requests: 2100 },
    ],
    trendData: {
      dates: Array.from({ length: 30 }, (_, i) => `02-${String(i + 1).padStart(2, '0')}`).filter(d => d <= '02-26'),
      requests: Array.from({ length: 22 }, () => Math.floor(1000 + Math.random() * 800)),
      tokens: Array.from({ length: 22 }, () => Math.floor(400000 + Math.random() * 300000)),
      cost: Array.from({ length: 22 }, () => Math.floor(10 + Math.random() * 10) + Math.random()),
    },
    tokenTrendData: {
      dates: Array.from({ length: 22 }, (_, i) => `02-${String(i + 1).padStart(2, '0')}`).filter(d => d <= '02-26'),
      inputTokens: Array.from({ length: 22 }, () => Math.floor(150000 + Math.random() * 150000)),
      outputTokens: Array.from({ length: 22 }, () => Math.floor(100000 + Math.random() * 100000)),
    },
  },
  '90d': {
    summary: { totalRequests: 158400, totalTokens: 57600000, totalCost: 1628.50, avgLatency: 1.4 },
    modelData: [
      { model: 'Claude-3.5', cost: 585.2, requests: 38500 },
      { model: 'GPT-4o', cost: 512.8, requests: 34200 },
      { model: 'Gemini Pro', cost: 285.5, requests: 25800 },
      { model: 'Llama-3', cost: 178.6, requests: 19200 },
      { model: 'GPT-4', cost: 66.4, requests: 6700 },
    ],
    trendData: {
      dates: Array.from({ length: 90 }, (_, i) => {
        const d = new Date(2026, 1, 1)
        d.setDate(d.getDate() - 89 + i)
        return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      }).filter((_, i) => i < 88),
      requests: Array.from({ length: 88 }, () => Math.floor(1200 + Math.random() * 1000)),
      tokens: Array.from({ length: 88 }, () => Math.floor(450000 + Math.random() * 350000)),
      cost: Array.from({ length: 88 }, () => Math.floor(12 + Math.random() * 12) + Math.random()),
    },
    tokenTrendData: {
      dates: Array.from({ length: 88 }, (_, i) => {
        const d = new Date(2026, 1, 1)
        d.setDate(d.getDate() - 89 + i)
        return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      }),
      inputTokens: Array.from({ length: 88 }, () => Math.floor(180000 + Math.random() * 180000)),
      outputTokens: Array.from({ length: 88 }, () => Math.floor(120000 + Math.random() * 120000)),
    },
  },
}

export default function UsageRecordPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [referenceModel, setReferenceModel] = useState('claude-3.5')

  // 根据时间范围获取数据
  const currentData = timeRangeData[timeRange as keyof typeof timeRangeData] || timeRangeData['7d']
  const { summary, modelData, trendData, tokenTrendData } = currentData

  // 模型调用次数排行数据（按调用次数排序）
  const sortedByRequests = [...modelData].sort((a, b) => b.requests - a.requests)

  // 模型费用排行数据（按费用排序）
  const sortedByCost = [...modelData].sort((a, b) => b.cost - a.cost)

  // 模型调用次数排行图表配置
  const modelRequestsRankingOption = useMemo(() => ({
    echarts,
    title: {
      text: '模型调用次数排行',
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#181E25',
      },
      left: 0,
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>调用次数: ${data.value.toLocaleString()}`
      },
    },
    grid: {
      left: '3%',
      right: '15%',
      bottom: '3%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: { color: '#F3F4F6' },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedByRequests.map(d => d.model),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#5F5F5F',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '调用次数',
        type: 'bar',
        data: sortedByRequests.map(d => ({
          value: d.requests,
          itemStyle: {
            color: MODEL_COLORS[d.model] || '#94A3B8',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => params.value.toLocaleString(),
          color: '#9CA3AF',
          fontSize: 12,
        },
      },
    ],
  }), [sortedByRequests])

  // 模型费用占比图表配置
  const modelCostShareOption = useMemo(() => ({
    echarts,
    title: {
      text: '模型费用占比',
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#181E25',
      },
      left: 0,
      top: 0,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#5F5F5F',
        fontSize: 12,
      },
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [
      {
        name: '费用占比',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        labelLine: { show: false },
        data: sortedByCost.map((d) => ({
          value: d.cost,
          name: d.model,
          itemStyle: {
            color: MODEL_COLORS[d.model] || '#94A3B8',
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
        })),
      },
    ],
  }), [sortedByCost])

  // 调用趋势图表配置
  const trendOption = useMemo(() => ({
    echarts,
    title: {
      text: '调用趋势',
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#181E25',
      },
      left: 0,
      top: 0,
    },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['请求次数', 'Token消耗', '费用($)'],
      right: 0,
      top: 0,
      textStyle: { color: '#9CA3AF', fontSize: 12 },
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '25%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 12 },
    },
    yAxis: [
      {
        type: 'value',
        name: '请求/Token',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
      },
      {
        type: 'value',
        name: '费用',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 12, formatter: '${value}' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '请求次数',
        type: 'line',
        smooth: true,
        data: trendData.requests,
        itemStyle: { color: '#f97316' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(249, 115, 22, 0.2)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0)' },
            ],
          },
        },
      },
      {
        name: 'Token消耗',
        type: 'line',
        smooth: true,
        data: trendData.tokens,
        itemStyle: { color: '#8B5CF6' },
      },
      {
        name: '费用($)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: trendData.cost,
        itemStyle: { color: '#10B981' },
      },
    ],
  }), [trendData])

  // Token 消耗趋势图表配置
  const tokenTrendOption = useMemo(() => ({
    echarts,
    title: {
      text: 'Token 消耗趋势',
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#181E25',
      },
      left: 0,
      top: 0,
    },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['输入Token', '输出Token'],
      right: 0,
      top: 0,
      textStyle: { color: '#9CA3AF', fontSize: 12 },
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '25%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: tokenTrendData.dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        formatter: (value: number) => (value / 1000).toFixed(0) + 'k',
      },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '输入Token',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: tokenTrendData.inputTokens,
        itemStyle: { color: '#8B5CF6' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.05)' },
            ],
          },
        },
      },
      {
        name: '输出Token',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: tokenTrendData.outputTokens,
        itemStyle: { color: '#10B981' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
            ],
          },
        },
      },
    ],
  }), [tokenTrendData])

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('zh-CN').format(num)
  }

  // 计算相对于参考模型的节省成本
  const savingsData = useMemo(() => {
    const multipliers = COST_MULTIPLIERS[referenceModel] || COST_MULTIPLIERS['claude-3.5']

    // 计算如果全部使用参考模型的成本
    let theoreticalCost = 0
    modelData.forEach((model) => {
      const multiplier = multipliers[model.model] || 1
      theoreticalCost += model.cost * multiplier
    })

    const savedAmount = theoreticalCost - summary.totalCost
    const savingsPercentage = theoreticalCost > 0
      ? ((savedAmount / theoreticalCost) * 100)
      : 0

    return {
      actualCost: summary.totalCost,
      theoreticalCost: theoreticalCost,
      savedAmount: savedAmount,
      savingsPercentage: savingsPercentage,
      referenceModelName: REFERENCE_MODELS.find(m => m.id === referenceModel)?.name || 'Claude-3.5',
    }
  }, [modelData, summary.totalCost, referenceModel])

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-normal text-gray-900">用量记录</h2>
          <p className="text-sm text-gray-500 mt-1">查看您的 API 使用情况统计</p>
        </div>
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-normal rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 成本节省面板 */}
      <div className={`mb-6 p-6 rounded-xl border transition-all duration-300 ${
        savingsData.savedAmount >= 0
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
              savingsData.savedAmount >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {savingsData.savedAmount >= 0 ? (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">成本对比</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">对比模型：</span>
                <div className="relative ml-2">
                  <select
                    value={referenceModel}
                    onChange={(e) => setReferenceModel(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
                  >
                    {REFERENCE_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-right">
              <p className={`text-3xl font-semibold ${savingsData.savedAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ${Math.abs(savingsData.savedAmount).toFixed(2)}
              </p>
              <p className={`text-sm mt-1 ${savingsData.savedAmount >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                {savingsData.savedAmount >= 0 ? '节省' : '溢价'} {Math.abs(savingsData.savingsPercentage).toFixed(1)}%
              </p>
            </div>

            <div className={`h-12 w-px ${savingsData.savedAmount >= 0 ? 'bg-green-200' : 'bg-red-200'}`}></div>

            <div className="text-right">
              <div className="flex items-center space-x-4 text-sm">
                <div>
                  <span className="text-gray-400">当前消费</span>
                  <p className="text-lg font-medium text-gray-700">${savingsData.actualCost.toFixed(2)}</p>
                </div>
                <div className="text-gray-300">
                  {savingsData.savedAmount >= 0 ? '↓' : '↑'}
                </div>
                <div>
                  <span className="text-gray-400">参考方案</span>
                  <p className={`text-lg font-medium ${savingsData.savedAmount >= 0 ? 'text-gray-400 line-through' : 'text-red-500'}`}>
                    ${savingsData.theoreticalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 进度条展示节省比例 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>当前消费</span>
            <span>参考方案成本</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            {savingsData.savedAmount >= 0 ? (
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(95, (savingsData.actualCost / savingsData.theoreticalCost) * 100)}%` }}
              ></div>
            ) : (
              <div className="flex h-full">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-l-full transition-all duration-500"
                  style={{ width: `${Math.min(95, (savingsData.theoreticalCost / savingsData.actualCost) * 100)}%` }}
                ></div>
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>混合方案</span>
            <span>参考方案</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">总请求次数</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-2xl font-normal text-gray-900">{formatNumber(summary.totalRequests)}</p>
          <p className="text-xs text-green-600 mt-1">+12.5% 较昨日</p>
        </div>

        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">总 Token 消耗</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-2xl font-normal text-gray-900">{formatNumber(summary.totalTokens)}</p>
          <p className="text-xs text-green-600 mt-1">+8.3% 较昨日</p>
        </div>

        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">总消费金额</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-normal text-gray-900">${summary.totalCost.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-1">+5.2% 较昨日</p>
        </div>

        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">平均延迟</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-normal text-gray-900">{summary.avgLatency}s</p>
          <p className="text-xs text-gray-500 mt-1">响应时间</p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 模型调用次数排行 */}
        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <ReactECharts option={modelRequestsRankingOption} style={{ height: '280px' }} />
        </div>

        {/* 模型费用占比 */}
        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <ReactECharts option={modelCostShareOption} style={{ height: '280px' }} />
        </div>
      </div>

      {/* 调用趋势 */}
      <div className="p-4 bg-white border border-gray-100 rounded-lg mb-6">
        <ReactECharts option={trendOption} style={{ height: '300px' }} />
      </div>

      {/* Token 消耗趋势 */}
      <div className="p-4 bg-white border border-gray-100 rounded-lg">
        <ReactECharts option={tokenTrendOption} style={{ height: '280px' }} />
      </div>
    </div>
  )
}
