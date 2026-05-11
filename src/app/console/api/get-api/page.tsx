'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import { extractErrorMessage } from '@/lib/error'
import { apiKeyStatusMeta } from '@/lib/api/router'
import proxyConfig from '@/lib/proxy-config'
import {
  formatDateTime,
} from '@/lib/router-analytics'
import { formatShanghaiDateTimeLocalInput, toShanghaiApiDateTime } from '@/lib/time'

import type { ApiKeyCreatePayload, ApiKeyUpdatePayload } from '@/lib/api/router'
import { useToast } from '@/components/ui/Toast'

interface DialogState {
  mode: 'create' | 'edit'
  id?: number
  name: string
  quota_mode: number
  quota_limit: string
  allowed_models: string
  allow_ips: string
  expires_at: string
}

function IconButton(props: {
  title: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
        props.tone === 'danger'
          ? 'border-red-200 text-red-600 hover:bg-red-50'
          : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {props.children}
    </button>
  )
}

function ApiKeyDialog(props: {
  title: string
  actionLabel: string
  initial: DialogState
  submitting: boolean
  onSubmit: (data: DialogState) => void
  onClose: () => void
}) {
  const [name, setName] = useState(props.initial.name)
  const [quotaMode, setQuotaMode] = useState(props.initial.quota_mode)
  const [quotaLimit, setQuotaLimit] = useState(props.initial.quota_limit)
  const [allowedModels, setAllowedModels] = useState(props.initial.allowed_models)
  const [allowIps, setAllowIps] = useState(props.initial.allow_ips)
  const [expiresAt, setExpiresAt] = useState(props.initial.expires_at)

  const handleSubmit = () => {
    if (!name.trim() || props.submitting) return
    props.onSubmit({
      ...props.initial,
      name: name.trim(),
      quota_mode: quotaMode,
      quota_limit: quotaLimit,
      allowed_models: allowedModels,
      allow_ips: allowIps,
      expires_at: expiresAt,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl text-gray-900">{props.title}</h3>
        <p className="mt-2 text-sm text-gray-500">建议用备注区分使用场景，例如生产环境、联调环境、团队共享。</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600">名称 / 备注</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              placeholder="例如：生产环境 / 团队联调"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">配额模式</label>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setQuotaMode(1)}
                className={`rounded-xl px-4 py-2 text-sm transition ${quotaMode === 1 ? 'bg-gray-950 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                不限额
              </button>
              <button
                type="button"
                onClick={() => setQuotaMode(2)}
                className={`rounded-xl px-4 py-2 text-sm transition ${quotaMode === 2 ? 'bg-gray-950 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                限额
              </button>
            </div>
          </div>

          {quotaMode === 2 && (
            <div>
              <label className="text-sm text-gray-600">配额上限（元）</label>
              <input
                type="number"
                value={quotaLimit}
                onChange={(e) => setQuotaLimit(e.target.value)}
                placeholder="例如：100"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600">允许的模型（逗号分隔，留空表示全部）</label>
            <input
              type="text"
              value={allowedModels}
              onChange={(e) => setAllowedModels(e.target.value)}
              placeholder="例如：gpt-4o,claude-sonnet-4.6"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">IP 白名单（每行一个 CIDR，留空表示不限）</label>
            <textarea
              value={allowIps}
              onChange={(e) => setAllowIps(e.target.value)}
              placeholder="例如：192.168.1.0/24"
              rows={2}
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">过期时间（留空表示永不过期）</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={props.onClose}
            className="rounded-xl px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || props.submitting}
            className="rounded-xl bg-gray-950 px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {props.submitting ? '处理中...' : props.actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
    </svg>
  )
}

function PowerIcon(props: { active: boolean }) {
  return props.active ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v9m6.364-5.364a9 9 0 11-12.728 0" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v9m0 0l3-3m-3 3L9 9m9.364-2.364a9 9 0 11-12.728 0" />
    </svg>
  )
}

export default function GetApiPage() {
  const { keys, isLoading, isError, create, update, disable, remove, mutate } = useRouterKeys()
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [expandedKeyId, setExpandedKeyId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [baseUrl, setBaseUrl] = useState('http://47.99.200.103:8003/v1')
  const [anthropicBaseUrl, setAnthropicBaseUrl] = useState('http://47.99.200.103:8003/v1/anthropic')
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    setBaseUrl(proxyConfig.resolveRouterOpenAIBaseUrl())
    setAnthropicBaseUrl(proxyConfig.resolveRouterAnthropicBaseUrl())
  }, [])

  const visibleKeys = useMemo(() => [...keys].sort((left, right) => left.id - right.id), [keys])

  function buildCreatePayload(data: DialogState): ApiKeyCreatePayload {
    const payload: ApiKeyCreatePayload = { name: data.name }
    if (data.quota_mode === 2) {
      payload.quota_mode = 2
      payload.quota_limit = Math.round(parseFloat(data.quota_limit || '0') * 100)
    }
    if (data.allowed_models.trim()) payload.allowed_models = data.allowed_models.trim()
    if (data.allow_ips.trim()) payload.allow_ips = data.allow_ips.trim()
    if (data.expires_at) payload.expires_at = toShanghaiApiDateTime(data.expires_at)
    return payload
  }

  function buildUpdatePayload(data: DialogState): ApiKeyUpdatePayload {
    const payload: ApiKeyUpdatePayload = {}
    if (data.name) payload.name = data.name
    if (data.quota_mode === 2 && data.quota_limit) {
      payload.quota_limit = Math.round(parseFloat(data.quota_limit) * 100)
    }
    payload.allowed_models = data.allowed_models.trim() || null
    payload.allow_ips = data.allow_ips.trim() || null
    if (data.expires_at) {
      payload.expires_at = toShanghaiApiDateTime(data.expires_at)
    }
    return payload
  }

  async function handleCreate(data: DialogState) {
    setSubmitting(true)
    setErrorMessage(null)
    setNoticeMessage(null)
    try {
      const result = await create(buildCreatePayload(data))
      setRevealedKey(result.api_key)
      setDialog(null)
    } catch (error) {
      setErrorMessage(extractErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(data: DialogState) {
    if (!dialog?.id) {
      return
    }
    setSubmitting(true)
    setErrorMessage(null)
    setNoticeMessage(null)
    try {
      await update(dialog.id, buildUpdatePayload(data))
      setDialog(null)
    } catch (error) {
      setErrorMessage(extractErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDisable(id: number) {
    setErrorMessage(null)
    setNoticeMessage(null)
    try {
      await disable(id)
      setNoticeMessage('这个 API Key 已禁用。后端当前不支持重新启用，若需要继续调用请创建新 Key。')
    } catch (error) {
      setErrorMessage(extractErrorMessage(error))
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('确定删除这个 API Key 吗？删除后它不会继续显示在列表中。')) {
      return
    }
    setErrorMessage(null)
    setNoticeMessage(null)
    try {
      await remove(id)
    } catch (error) {
      setErrorMessage(extractErrorMessage(error))
    }
  }

  async function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch { /* fall through */ }
    }
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }

  async function handleCopyBaseUrl() {
    const ok = await copyToClipboard(baseUrl)
    showToast(ok ? 'Base URL 已复制' : '复制失败，请手动复制', ok ? 'success' : 'error')
  }

  async function handleCopyAnthropicBaseUrl() {
    const ok = await copyToClipboard(anthropicBaseUrl)
    showToast(ok ? 'Anthropic Base URL 已复制' : '复制失败，请手动复制', ok ? 'success' : 'error')
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="rounded-lg bg-[#f7f7f8] px-8 py-7 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[1.75rem] tracking-tight text-gray-950">API</h2>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              API Key 长期有效。请勿把密钥公开到共享环境，妥善保管并定期轮换密钥，避免因未授权使用造成安全风险或资金损失。
            </p>
          </div>
          <div className="shrink-0 space-y-4">
            <div>
              <p className="text-sm text-gray-500">OpenAI compatible baseURL</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="min-w-0 rounded-lg border border-[#cbd5e1] bg-[#eef3fa] px-4 py-3 text-sm text-gray-900 shadow-inner lg:min-w-[320px]">
                  <span className="block truncate">{baseUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBaseUrl}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
                  title="复制 BaseURL"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Anthropic compatible baseURL</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="min-w-0 rounded-lg border border-[#cbd5e1] bg-[#eef3fa] px-4 py-3 text-sm text-gray-900 shadow-inner lg:min-w-[320px]">
                  <span className="block truncate">{anthropicBaseUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAnthropicBaseUrl}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
                  title="复制 Anthropic BaseURL"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</div>
      ) : null}
      {noticeMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{noticeMessage}</div>
      ) : null}

      <section className="rounded-lg bg-[#f7f7f8] px-8 py-6 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="https://neofii.github.io/TierFlow-Doc/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gray-950 px-7 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              API 使用文档
            </Link>
            <button
              onClick={() => setDialog({ mode: 'create', name: '', quota_mode: 1, quota_limit: '', allowed_models: '', allow_ips: '', expires_at: '' })}
              className="inline-flex h-11 items-center gap-3 rounded-full bg-gray-950 px-6 text-sm font-medium text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.7)] transition hover:bg-gray-800"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/50">
                <PlusIcon />
              </span>
              创建 API KEY
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-lg bg-white p-6">
            <div className="h-40 animate-pulse rounded-lg bg-gray-100"></div>
          </div>
        ) : !isLoading && isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            加载 API Key 失败。
            <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
              重试
            </button>
          </div>
        ) : visibleKeys.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg text-gray-900">你还没有创建任何 API Key</p>
            <p className="mt-2 text-sm text-gray-500">点击右上角按钮创建第一个 Key。完整密钥只会即时复制，不会在页面中缓存。</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white ring-1 ring-inset ring-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f7f7f8] text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">密钥</th>
                    <th className="px-6 py-4 font-medium">备注</th>
                    <th className="px-6 py-4 font-medium">状态</th>
                    <th className="px-6 py-4 font-medium">配额</th>
                    <th className="px-6 py-4 font-medium">过期时间</th>
                    <th className="px-6 py-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleKeys.map((item, index) => {
                    const statusMeta = apiKeyStatusMeta(item.status)
                    const isExpanded = expandedKeyId === item.id
                    return (
                      <React.Fragment key={item.id}>
                      <tr
                        key={item.id}
                        className="border-t border-gray-100 cursor-pointer hover:bg-gray-50/50"
                        onClick={() => setExpandedKeyId(expandedKeyId === item.id ? null : item.id)}
                      >
                        <td className="px-6 py-5 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-sm text-gray-600">{item.token_preview}</span>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-5">
                          <span className={`rounded-full px-2.5 py-1 text-xs ${statusMeta.tone}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {item.billing_mode === 'limited'
                            ? `已用 ${item.quota_used.toFixed(2)} / ${item.quota_limit.toFixed(2)}`
                            : '不限额'}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">{item.expires_at ? formatDateTime(item.expires_at) : '永不过期'}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <IconButton
                              title={item.is_active ? '禁用 Key' : '已禁用，后端不支持重新启用'}
                              onClick={() => handleDisable(item.id)}
                              disabled={!item.is_active}
                            >
                              <PowerIcon active={item.is_active} />
                            </IconButton>
                            <IconButton
                              title="修改备注"
                              onClick={() => setDialog({
                                mode: 'edit',
                                id: item.id,
                                name: item.name,
                                quota_mode: item.quota_mode,
                                quota_limit: item.quota_mode === 2 ? item.quota_limit.toString() : '',
                                allowed_models: item.allowed_models || '',
                                allow_ips: item.allow_ips || '',
                                expires_at: item.expires_at ? formatShanghaiDateTimeLocalInput(new Date(item.expires_at)) : '',
                              })}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton title="删除 Key" onClick={() => handleDelete(item.id)} tone="danger">
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-t border-gray-100 bg-[#f7f7f8]">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid gap-3 md:grid-cols-3">
                              <div>
                                <p className="text-xs text-gray-400">允许的模型</p>
                                <p className="mt-1 text-sm text-gray-700">{item.allowed_models || '全部模型'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">IP 白名单</p>
                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{item.allow_ips || '不限制'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">创建时间</p>
                                <p className="mt-1 text-sm text-gray-700">{formatDateTime(item.created_at)}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section id="usage-guide" className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.35)]">
        <h3 className="text-xl text-gray-950">使用说明</h3>
        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-900">安全说明</p>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              平台默认只展示脱敏预览。复制完整 Key 时会实时向后端请求，不会在页面中保留明文缓存；若怀疑泄露，直接失效或删除对应 Key。
            </p>
          </div>
          <div className="rounded-lg bg-gray-950 p-5">
            <p className="text-sm font-medium text-gray-100">curl 示例</p>
            <pre className="mt-4 overflow-x-auto text-sm leading-7 text-gray-100">{`curl -X POST ${baseUrl}/chat/completions \\
  -H "Authorization: Bearer YOUR_ROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"auto","messages":[{"role":"user","content":"Hello"}]}'`}</pre>
            <p className="mt-3 text-xs leading-6 text-gray-400">
              <code className="rounded bg-gray-900 px-1.5 py-0.5 text-gray-200">model</code> 必须填管理员配置的允许别名（默认 <code className="rounded bg-gray-900 px-1.5 py-0.5 text-gray-200">auto</code>），平台会根据请求内容自动路由到合适的底层模型。
            </p>
          </div>
        </div>
      </section>

      {dialog ? (
        <ApiKeyDialog
          key={`${dialog.mode}-${dialog.id ?? 'new'}`}
          title={dialog.mode === 'create' ? '创建新的 API Key' : '编辑 API Key'}
          actionLabel={dialog.mode === 'create' ? '创建' : '保存'}
          initial={dialog}
          submitting={submitting}
          onSubmit={dialog.mode === 'create' ? handleCreate : handleUpdate}
          onClose={() => {
            if (!submitting) {
              setDialog(null)
            }
          }}
        />
      ) : null}

      {revealedKey ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl text-gray-900">API Key 创建成功</h3>
            <p className="mt-3 text-sm text-red-600 font-medium">
              请立即复制并妥善保存。关闭此窗口后将无法再次查看完整密钥。
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="break-all font-mono text-sm text-gray-900 select-all">{revealedKey}</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(revealedKey)
                  showToast(ok ? '密钥已复制到剪贴板' : '复制失败，请手动复制', ok ? 'success' : 'error')
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm text-white transition hover:bg-gray-800"
              >
                <CopyIcon /> 复制密钥
              </button>
              <button
                onClick={() => setRevealedKey(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                我已保存，关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ToastContainer />
    </div>
  )
}
