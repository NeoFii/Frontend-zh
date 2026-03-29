/**
 * 注册表单组件
 * 处理注册逻辑和表单输入
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { PasswordStrength } from './PasswordStrength'
import { PasswordRequirements } from './PasswordRequirements'
import { AgreementLinks } from './AgreementLinks'
import { FormAlert } from '@/components/ui/FormAlert'
import { CodeCountdown } from '@/components/ui/CodeCountdown'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken } from '@/lib/token'
import { sendVerificationCode, register } from '@/lib/api/auth'
import { validateEmail } from '@/lib/utils/validation'
import { PasswordInput } from '@/components/ui/PasswordInput'

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { t } = useTranslation('auth.register')
  const { t: tValidation } = useTranslation('auth.validation')
  const { t: tErrors } = useTranslation('auth.errors')
  const { t: tLogin } = useTranslation('auth.login')
  const { login: saveUser } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [error, setError] = useState('')

  // 视觉控制台状态
  const [targetText, setTargetText] = useState('等待执行新用户注册协议...')
  const [displayedText, setDisplayedText] = useState('')

  const [form, setForm] = useState({
    invitationCode: '', email: '', code: '', password: '', confirmPassword: '', agreement: false,
  })

  // 控制台打字机效果逻辑
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < targetText.length) {
        setDisplayedText(prev => prev + targetText.charAt(i));
        i++;
      } else clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [targetText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  // 发送验证码逻辑（增强了错误捕获）
  const handleSendCode = async () => {
    if (!validateEmail(form.email)) {
      setError(tValidation('invalidEmail'));
      setTargetText('>> 协议终止：无效的邮件地址。');
      return;
    }

    setCodeLoading(true);
    setTargetText('>> 正在请求邮箱验证码...');

    try {
      const res = await sendVerificationCode(form.email)
      if (res.code === 200) {
        setTargetText('>> 邮箱验证码下发成功。');
      } else {
        // 捕获后端返回的特定错误信息
        setError(res.message || tErrors('sendFailed'));
        setTargetText('>> 验证码下发失败：' + (res.message || '拒绝访问'));
      }
    } catch (err: any) {
      // 增强型错误捕获
      const errMsg = err.response?.data?.message || tErrors('sendFailed');
      setError(errMsg);
      setTargetText('>> 链路异常：' + errMsg);
    } finally {
      setCodeLoading(false);
    }
  }

  // 严谨的本地表单验证
  const validateForm = (): boolean => {
    if (!form.invitationCode.trim()) {
      setError(tValidation('enterInvitationCode'));
      setTargetText('>> 拒绝执行：需要有效的受邀序列号。');
      return false;
    }
    if (!form.agreement) {
      setError(tValidation('agreeToTerms'));
      setTargetText('>> 拒绝执行：需接受合规性协议。');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError(tValidation('passwordMismatch'));
      setTargetText('>> 错误：两次输入的密钥不一致。');
      return false;
    }
    if (form.password.length < 8) {
      setError(tValidation('passwordTooShort'));
      setTargetText('>> 错误：密钥强度不足（需8位以上）。');
      return false;
    }
    return true;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTargetText('>> 正在构建账户信息并尝试注册...');

    try {
      const res = await register({
        invitation_code: form.invitationCode.trim(),
        email: form.email,
        verification_code: form.code,
        password: form.password,
        confirm_password: form.confirmPassword,
      })

      if (res.code === 201) {
        setTargetText('>> 注册成功。正在分配路由权限...');
        if (res.data.access_token && res.data.expires_in) {
          setAccessToken(res.data.access_token, res.data.expires_in)
          saveUser({
            uid: res.data.uid,
            email: res.data.email,
            status: 1,
            email_verified_at: null,
            last_login_at: null,
            created_at: res.data.created_at,
          })
          router.push('/console/account/basic-information')
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(res.message || tErrors('registerFailed'));
        setTargetText('>> 拒绝注册：' + (res.message || '后端拒绝'));
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || tErrors('registerFailedRetry');
      setError(errMsg);
      setTargetText('>> 致命错误：' + errMsg);
    } finally {
      setLoading(false);
    }
  }

  // 样式定义
  const cyberInputClass = "w-full px-4 py-3 bg-white/70 border border-slate-300 border-l-[3px] rounded transition-all focus:border-tech-accent focus:bg-white focus:outline-none font-tech-mono text-xs tracking-wider text-tech-text placeholder-slate-400"
  const cyberLabelClass = "absolute -top-2 left-3 bg-white px-1 text-[9px] font-tech-mono text-tech-muted font-bold z-10 uppercase tracking-widest"

  return (
    <form onSubmit={handleRegister} className="space-y-5 relative z-10">
      {/* 视觉反馈控制台 */}
      <div className="bg-slate-100/80 border border-slate-200 p-2.5 rounded font-tech-mono text-[10px] shadow-inner relative overflow-hidden">
        <div className="flex items-center text-tech-text">
          <span className="text-tech-accent font-bold mr-2">SYS&gt;</span>
          <span>{displayedText}</span>
          <span className="w-1 h-3 bg-tech-accent ml-1 animate-blink"></span>
        </div>
      </div>

      <FormAlert error={error} />

      {/* 邀请码输入 */}
      <div className="relative group">
        <div className={cyberLabelClass}>{t('invitationCode')}</div>
        <input name="invitationCode" type="text" required value={form.invitationCode} onChange={handleChange} onFocus={() => setTargetText('请输入受邀序列号...')} className={cyberInputClass} placeholder="ENTER INVITE CODE" />
      </div>

      {/* 邮箱输入 */}
      <div className="relative group">
        <div className={cyberLabelClass}>{t('email')}</div>
        <input name="email" type="email" required value={form.email} onChange={handleChange} onFocus={() => setTargetText('请输入有效邮箱地址...')} className={cyberInputClass} placeholder="EMAIL@EXAMPLE.COM" />
      </div>

      {/* 验证码输入 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className={cyberLabelClass}>{t('code')}</div>
          <input name="code" type="text" required maxLength={6} value={form.code} onChange={handleChange} onFocus={() => setTargetText('请输入邮箱验证码...')} className={`${cyberInputClass} text-center tracking-[0.4em]`} placeholder="000000" />
        </div>
        <CodeCountdown onSendCode={handleSendCode} disabled={codeLoading} sendingText={tLogin('sending')} getCodeText={tLogin('getCode')} />
      </div>

      {/* 密码输入 */}
      <div className="relative">
        <div className={cyberLabelClass}>{t('password')}</div>
        <PasswordInput name="password" value={form.password} onChange={handleChange} onFocus={() => setTargetText('请输入高强度密钥...')} placeholder="PASSWORD" required minLength={8} className={cyberInputClass} />
        <PasswordStrength password={form.password} />
        <PasswordRequirements password={form.password} />
      </div>

      {/* 确认密码 */}
      <div className="relative">
        <div className={cyberLabelClass}>{t('confirmPassword')}</div>
        <PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onFocus={() => setTargetText('请再次核对密钥...')} placeholder="RE-ENTER PASSWORD" required className={cyberInputClass} />
      </div>

      <AgreementLinks checked={form.agreement} onChange={(c) => { setForm(f => ({ ...f, agreement: c })); setError(''); }} />

      <button type="submit" disabled={loading} className="relative w-full mt-4 bg-tech-text text-white py-3.5 rounded font-tech-mono text-xs tracking-[0.4em] font-bold hover:bg-black transition-all group overflow-hidden disabled:opacity-50">
        <span className="relative z-10">{loading ? t('submitting') : t('submit')}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
      </button>
    </form>
  )
}