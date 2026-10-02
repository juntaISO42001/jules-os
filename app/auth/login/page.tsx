'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    const next = searchParams.get('next')
    const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
    router.replace(safeNext)
    router.refresh()
  }

  const callbackError = searchParams.get('error')
  const displayError = error || (callbackError ? 'Authentication could not be completed. Please try again.' : '')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-ink text-center">Login to JULEX OS</h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {displayError && <p className="text-red-500 text-sm">{displayError}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required autoComplete="email" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required autoComplete="current-password" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-ink text-white rounded-lg hover:bg-ink/90 disabled:opacity-60">{loading ? 'Logging in…' : 'Login'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">Don't have an account? <Link href="/auth/signup" className="text-gilt">Sign Up</Link></p>
      </div>
    </div>
  )
}
