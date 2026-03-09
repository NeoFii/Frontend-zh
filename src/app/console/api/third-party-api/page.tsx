// TODO: [SECURITY] 第三方 API Key 应通过后端加密存储，当前 localStorage 方案为临时实现
// 后续需对接: POST /api/v1/platform/third-party-keys (存储), GET (列表), DELETE (删除)
'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { SUPPORTED_PROVIDERS, getProviderById, Provider } from '@/config/providers'
import ProviderIcon from '@/components/ProviderIcon'

/**
 * 厂商配置接口
 */
interface ProviderConfig {
  providerId: string      // 厂商 ID
  apiKey: string         // 加密存储的 API Key
  status: 'active' | 'inactive' | 'not_configured'
  createdAt?: string
  lastUsed?: string
}

// localStorage 键名
const STORAGE_KEY = 'third_party_api_configs'

/**
 * 从 localStorage 加载配置
 */
function loadConfigs(): Record<string, ProviderConfig> {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

/**
 * 保存配置到 localStorage
 */
function saveConfigs(configs: Record<string, ProviderConfig>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
}

/**
 * 脱敏显示 API Key
 */
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '****'
  return key.substring(0, 8) + '****'
}

export default function ThirdPartyApiPage() {
  const { t } = useTranslation('console.api.thirdPartyApi')
  const [configs, setConfigs] = useState<Record<string, ProviderConfig>>({})
  const [showModal, setShowModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  // 页面加载时从 localStorage 读取配置
  useEffect(() => {
    const savedConfigs = loadConfigs()
    setConfigs(savedConfigs)
  }, [])

  // 检查某个厂商是否已配置
  const isProviderConfigured = (providerId: string): boolean => {
    const config = configs[providerId]
    return config && config.status !== 'not_configured' && !!config.apiKey
  }

  // 获取已配置的厂商列表
  const getConfiguredList = (): ProviderConfig[] => {
    return Object.values(configs).filter(
      config => config.status !== 'not_configured' && !!config.apiKey
    )
  }

  // 打开添加/编辑模态框
  const openModal = (provider: Provider) => {
    setEditingProvider(provider)
    const existingConfig = configs[provider.id]
    setApiKeyInput(existingConfig?.apiKey || '')
    setShowModal(true)
  }

  // 关闭模态框
  const closeModal = () => {
    setShowModal(false)
    setEditingProvider(null)
    setApiKeyInput('')
    setShowApiKey(false)
  }

  // 保存配置
  const handleSave = () => {
    if (!editingProvider || !apiKeyInput.trim()) return

    const newConfigs = {
      ...configs,
      [editingProvider.id]: {
        providerId: editingProvider.id,
        apiKey: apiKeyInput.trim(),
        status: 'active' as const,
        createdAt: configs[editingProvider.id]?.createdAt || new Date().toISOString().split('T')[0],
        lastUsed: new Date().toISOString().split('T')[0],
      },
    }

    setConfigs(newConfigs)
    saveConfigs(newConfigs)
    closeModal()
  }

  // 删除配置
  const handleDelete = (providerId: string) => {
    setIsDeleting(providerId)
    setTimeout(() => {
      const newConfigs = { ...configs }
      delete newConfigs[providerId]
      setConfigs(newConfigs)
      saveConfigs(newConfigs)
      setIsDeleting(null)
    }, 100)
  }

  // 切换状态
  const handleToggleStatus = (providerId: string) => {
    const config = configs[providerId]
    if (!config) return

    const newStatus: 'active' | 'inactive' = config.status === 'active' ? 'inactive' : 'active'
    const newConfigs: Record<string, ProviderConfig> = {
      ...configs,
      [providerId]: { ...config, status: newStatus },
    }
    setConfigs(newConfigs)
    saveConfigs(newConfigs)
  }

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }} className="min-h-screen">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* 页面头部 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-sm font-medium rounded-lg">
                {getConfiguredList().length} {t('configured')}
              </span>
            </div>
          </div>
        </div>

        {/* 厂商网格卡片列表 */}
        <div className="p-6">
          <div className="flex items-center mb-5">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">{t('selectProvider')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {SUPPORTED_PROVIDERS.map((provider) => {
              const configured = isProviderConfigured(provider.id)

              return (
                <div
                  key={provider.id}
                  className="group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:border-gray-300 bg-white"
                  style={{
                    borderColor: configured ? '#10B981' : '#E5E7EB',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ProviderIcon providerId={provider.id} name={provider.name} />
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-sm font-medium text-gray-900 truncate block"
                          title={provider.name}
                        >
                          {provider.name}
                        </span>
                        <span
                          className={`text-xs mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full ${
                            configured
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {configured ? t('configured') : t('notConfigured')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => openModal(provider)}
                      className={`ml-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                        configured
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow'
                      }`}
                    >
                      {configured ? t('edit') : t('configureApi')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-gray-100" />

        {/* 已配置的 API 列表 */}
        <div className="p-6">
          <div className="flex items-center mb-5">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">{t('configuredApis')}</h3>
          </div>

          {getConfiguredList().length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('provider')}
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('apiKey')}
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('createdAt')}
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {getConfiguredList().map((config) => {
                    const provider = getProviderById(config.providerId)
                    if (!provider) return null

                    return (
                      <tr
                        key={config.providerId}
                        className="hover:bg-gray-50/50 transition-colors"
                        style={{
                          opacity: isDeleting === config.providerId ? 0.5 : 1,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <ProviderIcon providerId={provider.id} name={provider.name} />
                            <span className="text-sm font-medium text-gray-900">{provider.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <code className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md">
                            {maskApiKey(config.apiKey)}
                          </code>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(config.providerId)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              config.status === 'active'
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                config.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                            {config.status === 'active' ? t('enabled') : t('disabled')}
                          </button>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{config.createdAt || '-'}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openModal(provider)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              {t('edit')}
                            </button>
                            <button
                              onClick={() => handleDelete(config.providerId)}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              {t('delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* 空状态提示 */
            <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">{t('emptyState')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('emptyStateHint')}</p>
            </div>
          )}
        </div>
      </div>

      {/* 添加/编辑 API 模态框 */}
      {showModal && editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* 模态框内容 */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* 头部 */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ProviderIcon providerId={editingProvider.id} name={editingProvider.name} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('configureApi')}
                  </h3>
                  <p className="text-sm text-gray-500">{editingProvider.name}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="relative">
                  <input
                    id="apiKey"
                    name="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={editingProvider.keyPlaceholder}
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showApiKey ? t('hideApiKey') : t('showApiKey')}
                  >
                    {showApiKey ? (
                      // 眼睛睁开图标 - 当前显示，点击隐藏
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      // 眼睛关闭图标 - 当前隐藏，点击显示
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {editingProvider.keyPlaceholder}
              </p>

              {editingProvider.website && (
                <a
                  href={editingProvider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  {t('visitWebsite')}
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKeyInput.trim()}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                {t('saveConfig')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
