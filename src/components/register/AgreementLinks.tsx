import Link from 'next/link'

export function AgreementLinks({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <div className="flex items-start gap-2 text-[12.5px] leading-6 text-[#6b7280]">
      <input
        id="agreement"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-3.5 w-3.5 rounded border-[#d1d5db] accent-[#111827]"
      />
      <label htmlFor="agreement">
        {'我已阅读并同意'}
        <Link href="/agreement" className="mx-1 text-[#111827] underline decoration-[#d1d5db] underline-offset-4 transition hover:decoration-[#f97316]">
          {'用户协议'}
        </Link>
        和
        <Link href="/privacy" className="ml-1 text-[#111827] underline decoration-[#d1d5db] underline-offset-4 transition hover:decoration-[#f97316]">
          {'隐私政策'}
        </Link>
      </label>
    </div>
  )
}
