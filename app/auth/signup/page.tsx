'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const origin = window.location.origin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: origin + '/auth/callback?next=/dashboard' },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.session) { router.replace('/dashboard'); router.refresh(); return }
    setMessage('Account created. Check your email to confirm your account, then log in.')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-ink text-center">Sign Up for JULEX OS</h1>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-700 text-sm">{message}</p>}
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required autoComplete="name" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required autoComplete="email" />
          <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required minLength={6} autoComplete="new-password" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-gilt text-white rounded-lg hover:bg-gilt/90 disabled:opacity-60">{loading ? 'Creating account…' : 'Sign Up'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <Link href="/auth/login" className="text-gilt">Login</Link></p>
      </div>
    </div>
  )
}
