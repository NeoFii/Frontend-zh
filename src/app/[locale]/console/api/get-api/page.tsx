'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function GetApiPage() {
  const t = useTranslations('console.api')
  const [apiKey, setApiKey] = useState('sk-demo-xxxxxxxxxxxxxxxxxxxxxxxx')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleRegenerate = () => {
    setIsLoading(true)
    // 模拟重新生成 API Key
    setTimeout(() => {
      setApiKey(`sk-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`)
      setIsLoading(false)
    }, 1000)
  }

  // 隐藏 API Key 中间部分
  const maskedKey = apiKey.length > 16
    ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 8)}`
    : apiKey

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-normal text-gray-900">{t('title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('getApiSubtitle') || 'Get your API key to start calling the interface'}</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-normal rounded-lg transition-colors"
        >
          {isLoading ? t('generating') || 'Generating...' : t('regenerateKey') || 'Regenerate Key'}
        </button>
      </div>

      {/* API Key 展示卡片 */}
      <div className="p-6 border border-gray-100 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">{t('yourApiKey') || 'Your API Key'}</p>
            <code
              className="text-base text-gray-900 font-mono"
              style={{ fontFamily: 'MiSans, sans-serif', letterSpacing: '0.5px' }}
            >
              {maskedKey}
            </code>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('copied')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t('copy')}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>{t('createdAt') || 'Created'}: 2026-01-15</p>
            <p className="mt-1">{t('lastUsed') || 'Last used'}: 2026-02-26</p>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-600">{t('enabled')}</span>
          </div>
        </div>
      </div>

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
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
