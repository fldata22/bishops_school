'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { GraduationCap } from '@phosphor-icons/react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const ok = login(email, password)
    setLoading(false)
    if (ok) router.push('/dashboard')
    else setError('Invalid credentials')
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <div className="w-full max-w-xs space-y-8">

        {/* Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap size={28} weight="fill" className="text-on-primary" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Sign in</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            required autoComplete="email" placeholder="admin@school.com"
            className="w-full px-4 py-3 rounded-xl text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 outline-none border border-white/8 focus:border-primary/50 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="current-password" placeholder="Password"
            className="w-full px-4 py-3 rounded-xl text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 outline-none border border-white/8 focus:border-primary/50 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          {error && <p className="text-xs font-label text-error pl-1">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-dim hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 mt-1">
            {loading ? 'Signing in…' : 'Continue'}
          </button>
        </form>

      </div>
    </div>
  )
}
