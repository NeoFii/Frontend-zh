'use client'

import { useTranslations } from 'next-intl'

export default function InterfaceKeyPage() {
  const t = useTranslations('console.account')

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-normal text-gray-900">{t('interfaceKey.title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('interfaceKey.subtitle')}</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-normal rounded-lg transition-colors">
          {t('interfaceKey.createNew')}
        </button>
      </div>

      <div className="space-y-4">
        {[
          { name: t('interfaceKey.default'), key: 'sk-xxxxx...xxxxxxxx', created: '2026-01-15', lastUsed: '2026-02-23' },
          { name: t('interfaceKey.testEnv'), key: 'sk-yyyyy...yyyyyyyy', created: '2026-02-01', lastUsed: '2026-02-20' },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div>
              <p className="font-normal text-gray-900">{item.name}</p>
              <code className="text-sm text-gray-500" style={{ fontFamily: 'MiSans, sans-serif' }}>{item.key}</code>
              <p className="text-xs text-gray-400 mt-1">{t('interfaceKey.createdOn')} {item.created} · {t('interfaceKey.lastUsed')} {item.lastUsed}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {t('interfaceKey.copy')}
              </button>
              <button className="px-3 py-1.5 text-sm text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                {t('interfaceKey.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
