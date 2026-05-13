import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Anon client for code exchange (required by Supabase)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client for DB operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  // Exchange code using ANON client
  const { data, error } = await supabaseAnon.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('Callback error:', error?.message, error?.status)
    return NextResponse.redirect(`${origin}/auth/login?error=callback_failed&msg=${encodeURIComponent(error?.message || 'unknown')}`)
  }

  const user = data.user

  // Check if user already has a Reliant project
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('reliant_api_key')
    .eq('id', user.id)
    .single()

  if (!profile?.reliant_api_key) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_RELIANT_API_URL || 'https://reliant-production.up.railway.app'
      const res = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.email }),
      })

      if (res.ok) {
        const project = await res.json()
        if (project.api_key) {
          await supabaseAdmin
            .from('profiles')
            .update({
              reliant_api_key: project.api_key,
              reliant_project_id: project.id,
              reliant_api_url: apiUrl,
            })
            .eq('id', user.id)
          console.log(`✅ Created Reliant project for ${user.email}: ${project.id}`)
        }
      } else {
        console.error('Failed to create Reliant project:', await res.text())
      }
    } catch (err) {
      console.error('Error creating Reliant project:', err)
    }
  }

  const response = NextResponse.redirect(`${origin}/dashboard`)

  if (data.session) {
    response.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in,
      path: '/',
    })
    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
  }

  return response
}