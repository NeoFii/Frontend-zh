/**
 * 协议链接组件
 * 用户协议和隐私政策链接
 */

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface AgreementLinksProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function AgreementLinks({ checked, onChange }: AgreementLinksProps) {
  const t = useTranslations('auth.register')

  return (
    <div className="flex items-start">
      <input
        id="agreement"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 mt-1 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
      />
      <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
        {t('agreementPrefix')}
        <Link href="/agreement" className="text-gray-900 underline hover:text-gray-700">{t('userAgreement')}</Link>
        和
        <Link href="/privacy" className="text-gray-900 underline hover:text-gray-700">{t('privacyPolicy')}</Link>
      </label>
    </div>
  )
}
