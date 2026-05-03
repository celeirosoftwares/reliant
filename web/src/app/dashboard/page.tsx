'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import OverviewClient from '@/components/dashboard/OverviewClient'

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [plan, setPlan] = useState('free')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('reliant_api_key, reliant_api_url, plan')
        .eq('id', session.user.id)
        .single()
      if (profile?.reliant_api_key) {
        setApiKey(profile.reliant_api_key)
        setApiUrl(profile.reliant_api_url || 'https://reliant-production.up.railway.app')
        setPlan(profile.plan || 'free')
        setReady(true)
      }
    })
  }, [])

  if (!ready) return null

  return <OverviewClient apiKey={apiKey} apiUrl={apiUrl} plan={plan} />
}
