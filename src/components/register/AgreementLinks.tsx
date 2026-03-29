import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export function AgreementLinks({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) {
  const { t } = useTranslation('auth.register')
  return (
    <div className="flex items-center font-tech-mono text-[10px] text-tech-muted gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-tech-accent w-3 h-3" />
      <label>
        {t('agreementPrefix') || 'AGREE TO '}
        <Link href="/agreement" className="text-tech-text underline">[ TERMS ]</Link> AND <Link href="/privacy" className="text-tech-text underline">[ PRIVACY ]</Link>
      </label>
    </div>
  )
}