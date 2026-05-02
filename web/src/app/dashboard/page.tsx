import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import OverviewClient from '@/components/dashboard/OverviewClient'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('reliant_api_key, reliant_api_url, plan')
    .eq('id', user.id)
    .single()

  if (!profile?.reliant_api_key) {
    return (
      <div style={{ padding: '48px 32px' }}>
        <div style={{ fontFamily: 'var(--font-ui-mono)', color: 'var(--text-3)', fontSize: '14px' }}>
          Configurando sua conta... Recarregue a página em alguns instantes.
        </div>
      </div>
    )
  }

  return (
    <OverviewClient
      apiKey={profile.reliant_api_key}
      apiUrl={profile.reliant_api_url || 'https://reliant-production.up.railway.app'}
      plan={profile.plan}
    />
  )
}
