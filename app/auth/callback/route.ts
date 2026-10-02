import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/dashboard'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  if (!code) return NextResponse.redirect(new URL('/auth/login?error=missing_code', url.origin))
  let response = NextResponse.redirect(new URL(safeNext, url.origin))
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      get(name: string) { return request.cookies.get(name)?.value },
      set(name: string, value: string, options: CookieOptions) { response.cookies.set({ name, value, ...options }) },
      remove(name: string, options: CookieOptions) { response.cookies.set({ name, value: '', ...options }) },
    },
  })
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', url.origin))
  return response
}
