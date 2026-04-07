'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Eye, EyeSlash } from '@phosphor-icons/react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400)) // UX delay
    const ok = login(email, password)
    setLoading(false)
    if (ok) router.push('/dashboard')
    else setError('Invalid credentials. Please try again.')
  }

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">The Nocturne Scholar</p>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Welcome back</h1>
          <p className="text-sm font-label text-on-surface-variant mt-2">Sign in to your principal dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
              placeholder="principal@academy.edu"
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(163,166,255,0.08)] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 pr-12 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(163,166,255,0.08)] transition-all duration-200"
              />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                {showPass ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs font-label text-tertiary">{error}</p>}
          <button type="submit" disabled={loading}
            className="mt-2 py-3 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-container transition-opacity duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
