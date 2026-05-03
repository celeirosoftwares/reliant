'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function Home() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/auth/signup'
      }
    })
  }, [])

  return null
}
