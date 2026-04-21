'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import { extractErrorMessage } from '@/lib/error'
import {
  formatDateTime,
} from '@/lib/router-analytics'

interface DialogState {
  mode: 'create' | 'edit'
  id?: number
  name: string
}

function resolveRouterOpenAIBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL?.trim()
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, '')
  }

  return 'http://localhost:8003/v1'
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

function NameDialog(props: {
  title: string
  actionLabel: string
  initialName: string
  submitting: boolean
  onSubmit: (name: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState(props.initialName)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <h3 className="text-xl text-gray-900">{props.title}</h3>
        <p className="mt-2 text-sm text-gray-500">建议用备注区分使用场景，例如生产环境、联调环境、团队共享。</p>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && name.trim() && !props.submitting) {
              props.onSubmit(name.trim())
            }
          }}
          placeholder="例如：生产环境 / 团队联调"
          className="mt-4 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
          autoFocus
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={props.onClose}
            className="rounded-xl px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={() => props.onSubmit(name.trim())}
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
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [baseUrl, setBaseUrl] = useState('/router-api/v1')

  useEffect(() => {
    setBaseUrl(resolveRouterOpenAIBaseUrl())
  }, [])

  const visibleKeys = useMemo(() => [...keys].sort((left, right) => left.id - right.id), [keys])

  async function handleCreate(name: string) {
    setSubmitting(true)
    setErrorMessage(null)
    setNoticeMessage(null)
    try {
      const payload = await create(name)
      await navigator.clipboard.writeText(payload.api_key)
      setCopiedKeyId(payload.item.id)
      setNoticeMessage('新创建的完整 Key 已复制到剪贴板。页面不会缓存完整密钥，请立即保管。')
      window.setTimeout(() => setCopiedKeyId((current) => (current === payload.item.id ? null : current)), 1500)
      setDialog(null)
    } catch (error) {
      setErrorMessage(extractErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(name: string) {
    if (!dialog?.id) {
      return
    }
    setSubmitting(true)
    setErrorMessage(null)
    setNoticeMessage(null)
    try {
      await update(dialog.id, { name })
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

  async function handleCopyBaseUrl() {
    await navigator.clipboard.writeText(baseUrl)
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="rounded-[32px] bg-[#f7f7f8] px-8 py-7 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[1.75rem] tracking-tight text-gray-950">API</h2>
            <p className="mt-4 text-xl leading-8 text-gray-900">
              API Key 是你请求 Eucal Router 大模型服务的重要凭证。
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              API Key 长期有效。请勿把密钥公开到共享环境，妥善保管并定期轮换密钥，避免因未授权使用造成安全风险或资金损失。
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-[#f7f7f8] px-8 py-7 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <h3 className="text-[1.75rem] tracking-tight text-gray-950">BaseURL</h3>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <p className="text-sm text-gray-900">OpenAI compatible baseURL:</p>
          <div className="flex items-center gap-3">
            <div className="min-w-0 rounded-2xl border border-[#cbd5e1] bg-[#eef3fa] px-4 py-3 text-sm text-gray-900 shadow-inner lg:min-w-[380px]">
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
      </section>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</div>
      ) : null}
      {noticeMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{noticeMessage}</div>
      ) : null}

      <section className="rounded-[32px] bg-[#f7f7f8] px-8 py-6 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
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
              onClick={() => setDialog({ mode: 'create', name: '' })}
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
          <div className="rounded-[24px] bg-white p-6">
            <div className="h-40 animate-pulse rounded-2xl bg-gray-100"></div>
          </div>
        ) : !isLoading && isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            加载 API Key 失败。
            <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
              重试
            </button>
          </div>
        ) : visibleKeys.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg text-gray-900">你还没有创建任何 API Key</p>
            <p className="mt-2 text-sm text-gray-500">点击右上角按钮创建第一个 Key。完整密钥只会即时复制，不会在页面中缓存。</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] bg-white ring-1 ring-inset ring-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#edf2f7] text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">密钥</th>
                    <th className="px-6 py-4 font-medium">备注</th>
                    <th className="px-6 py-4 font-medium">创建时间</th>
                    <th className="px-6 py-4 font-medium">配额</th>
                    <th className="px-6 py-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleKeys.map((item, index) => {
                    return (
                      <tr key={item.id} className="border-t border-gray-100 text-gray-700">
                        <td className="px-6 py-5 align-middle text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-5 align-middle">
                          <div className="flex items-center gap-3">
                            <span className="text-base text-[#5c6471]">
                              {item.token_preview}
                            </span>
                            <span className={`text-xs ${copiedKeyId === item.id ? 'text-emerald-600' : 'text-gray-500'}`}>
                              {copiedKeyId === item.id ? '已复制完整 Key' : '完整 Key 仅在创建时返回'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-middle text-sm text-[#5c6471]">
                          <div className="font-medium text-gray-700">{item.name}</div>
                        </td>
                        <td className="px-6 py-5 align-middle text-sm text-[#5c6471]">{formatDateTime(item.created_at)}</td>
                        <td className="px-6 py-5 align-middle text-sm text-[#5c6471]">
                          {item.billing_mode === 'limited'
                            ? `已用 ${item.quota_used.toFixed(2)} / ${item.quota_limit.toFixed(2)}`
                            : '不限额'}
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <div className="flex items-center gap-2">
                            <IconButton
                              title={item.is_active ? '禁用 Key' : '已禁用，后端不支持重新启用'}
                              onClick={() => handleDisable(item.id)}
                              disabled={!item.is_active}
                            >
                              <PowerIcon active={item.is_active} />
                            </IconButton>
                            <IconButton
                              title="修改备注"
                              onClick={() => setDialog({ mode: 'edit', id: item.id, name: item.name })}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton title="删除 Key" onClick={() => handleDelete(item.id)} tone="danger">
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section id="usage-guide" className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.35)]">
        <h3 className="text-xl text-gray-950">使用说明</h3>
        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-900">安全说明</p>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              平台默认只展示脱敏预览。复制完整 Key 时会实时向后端请求，不会在页面中保留明文缓存；若怀疑泄露，直接失效或删除对应 Key。
            </p>
          </div>
          <div className="rounded-2xl bg-gray-950 p-5">
            <p className="text-sm font-medium text-gray-100">curl 示例</p>
            <pre className="mt-4 overflow-x-auto text-sm leading-7 text-gray-100">{`curl -X POST ${baseUrl}/chat/completions \\
  -H "Authorization: Bearer YOUR_ROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"smart-router","messages":[{"role":"user","content":"Hello"}]}'`}</pre>
          </div>
        </div>
      </section>

      {dialog ? (
        <NameDialog
          key={`${dialog.mode}-${dialog.id ?? 'new'}`}
          title={dialog.mode === 'create' ? '创建新的 API Key' : '修改备注'}
          actionLabel={dialog.mode === 'create' ? '创建' : '保存'}
          initialName={dialog.name}
          submitting={submitting}
          onSubmit={dialog.mode === 'create' ? handleCreate : handleUpdate}
          onClose={() => {
            if (!submitting) {
              setDialog(null)
            }
          }}
        />
      ) : null}
    </div>
  )
}
