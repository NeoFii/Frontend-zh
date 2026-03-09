// TODO: [SECURITY] API Key 应通过后端 API 管理，当前 localStorage 方案为临时 Mock 实现
// 后续需对接: POST /api/v1/platform/api-keys (创建), GET (列表, 返回脱敏值), DELETE (删除)
'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsedAt: string | null
  enabled: boolean
}

// TODO: [SECURITY] 密钥应由后端生成，此为临时 Mock 实现
// 生成随机 API 密钥
function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'sk-'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 生成唯一 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const STORAGE_KEY = 'api-keys-list'

export default function GetApiPage() {
  const { t } = useTranslation('console.api')
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  // 从 localStorage 加载密钥
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setKeys(JSON.parse(stored))
      } catch {
        // 忽略解析错误
      }
    }
  }, [])

  // 保存密钥到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  }, [keys])

  // 创建新密钥
  const handleCreateKey = () => {
    if (!newKeyName.trim()) return

    const newKey: ApiKey = {
      id: generateId(),
      name: newKeyName.trim(),
      key: generateApiKey(),
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      enabled: true,
    }

    setKeys([newKey, ...keys])
    setNewKeyName('')
    setShowNameDialog(false)
  }

  // 复制密钥
  const handleCopy = async (key: ApiKey) => {
    try {
      await navigator.clipboard.writeText(key.key)
      setCopiedId(key.id)
      setTimeout(() => setCopiedId(null), 2000)

      // 更新最后使用时间
      setKeys(keys.map(k =>
        k.id === key.id ? { ...k, lastUsedAt: new Date().toISOString() } : k
      ))
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  // 删除密钥
  const handleDelete = (id: string) => {
    if (confirm(t('confirmDelete') || '确定要删除这个 API 密钥吗？')) {
      setKeys(keys.filter(k => k.id !== id))
    }
  }

  // 格式化日期
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  // 隐藏 API Key 中间部分
  const maskedKey = (key: string) => {
    if (key.length > 16) {
      return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`
    }
    return key
  }

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-normal text-gray-900">{t('title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('getApiSubtitle') || 'Get your API key to start calling the interface'}</p>
        </div>
        <button
          onClick={() => setShowNameDialog(true)}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-normal rounded-lg transition-colors"
        >
          {t('createNewKey') || 'Create New Key'}
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="p-6 border border-gray-100 rounded-lg bg-gray-50 text-center py-12">
          <p className="text-gray-500">{t('noApiKeys') || 'No API keys yet'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((item) => (
            <div key={item.id} className="p-6 border border-gray-100 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{item.name}</p>
                  <code
                    className="text-base text-gray-900 font-mono"
                    style={{ fontFamily: 'MiSans, sans-serif', letterSpacing: '0.5px' }}
                  >
                    {maskedKey(item.key)}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                  >
                    {copiedId === item.id ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('copied') || 'Copied'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {t('copy') || 'Copy'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-sm text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {t('delete') || 'Delete'}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>{t('createdAt') || 'Created'}: {formatDate(item.createdAt)}</p>
                  <p className="mt-1">{t('lastUsed') || 'Last used'}: {formatDate(item.lastUsedAt)}</p>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">{t('enabled')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-8">
        <h3 className="text-lg font-normal text-gray-900 mb-4">{t('usageGuide') || 'Usage Guide'}</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-normal mr-3">1</span>
            <div>
              <p className="text-sm font-normal text-gray-900">{t('addApiKey')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('addApiKeyDesc')}</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-normal mr-3">2</span>
            <div>
              <p className="text-sm font-normal text-gray-900">{t('protectApiKey')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('protectApiKeyDesc')}</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-normal mr-3">3</span>
            <div>
              <p className="text-sm font-normal text-gray-900">{t('exampleRequest')}</p>
              <div className="mt-2 p-3 bg-gray-900 rounded-lg overflow-x-auto">
                <pre className="text-sm text-gray-100 font-mono" style={{ fontFamily: 'MiSans, sans-serif' }}>
{`curl -X POST https://api.example.com/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 创建密钥弹窗 */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-normal text-gray-900 mb-4">{t('enterKeyName') || 'Enter key name'}</h3>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
              placeholder={t('keyNamePlaceholder') || 'e.g., Production, Testing'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setShowNameDialog(false); setNewKeyName('') }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('cancel') || 'Cancel'}
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('create') || 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
