import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Create Reliant project for new user
      const profile = await supabase
        .from('profiles')
        .select('reliant_api_key')
        .eq('id', data.user.id)
        .single()

      if (!profile.data?.reliant_api_key) {
        try {
          // Create project in Reliant API
          const res = await fetch(`${process.env.NEXT_PUBLIC_RELIANT_API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: data.user.email }),
          })
          const project = await res.json()

          if (project.api_key) {
            await supabase.from('profiles').update({
              reliant_api_key: project.api_key,
              reliant_project_id: project.id,
            }).eq('id', data.user.id)
          }
        } catch (e) {
          console.error('Failed to create Reliant project:', e)
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`)
}
