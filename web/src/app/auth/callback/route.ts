import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

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

  const response = NextResponse.redirect(`${origin}/dashboard`)

  // Use SSR client that reads cookies (needed for PKCE code_verifier)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('Callback error:', error?.message)
    return NextResponse.redirect(
      `${origin}/auth/login?error=callback_failed&msg=${encodeURIComponent(error?.message || 'unknown')}`
    )
  }

  const user = data.user

  // Create Reliant project if not exists
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
      }
    } catch (err) {
      console.error('Error creating Reliant project:', err)
    }
  }

  return response
}