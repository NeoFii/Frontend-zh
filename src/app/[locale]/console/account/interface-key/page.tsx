'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsedAt: string | null
}

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

const STORAGE_KEY = 'api-keys'

export default function InterfaceKeyPage() {
  const t = useTranslations('console.account')
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
      console.error('Failed to copy:', err)
    }
  }

  // 删除密钥
  const handleDelete = (id: string) => {
    if (confirm(t('interfaceKey.confirmDelete'))) {
      setKeys(keys.filter(k => k.id !== id))
    }
  }

  // 格式化日期
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-normal text-gray-900">{t('interfaceKey.title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('interfaceKey.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowNameDialog(true)}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-normal rounded-lg transition-colors"
        >
          {t('interfaceKey.createNew')}
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('interfaceKey.empty')}
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
              <div>
                <p className="font-normal text-gray-900">{item.name}</p>
                <code className="text-sm text-gray-500 font-mono">{item.key}</code>
                <p className="text-xs text-gray-400 mt-1">
                  {t('interfaceKey.createdOn')} {formatDate(item.createdAt)} · {t('interfaceKey.lastUsed')} {formatDate(item.lastUsedAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(item)}
                  className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copiedId === item.id ? t('interfaceKey.copied') : t('interfaceKey.copy')}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-sm text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  {t('interfaceKey.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 创建密钥弹窗 */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-normal text-gray-900 mb-4">{t('interfaceKey.enterName')}</h3>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
              placeholder={t('interfaceKey.namePlaceholder')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setShowNameDialog(false); setNewKeyName('') }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('interfaceKey.cancel')}
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('interfaceKey.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
