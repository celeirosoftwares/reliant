'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    console.log('Login result:', { data, error })

    if (error) {
      setError(`Erro: ${error.message}`)
      setLoading(false)
      return
    }

    if (!data.session) {
      setError('Sessão não criada. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark}>R</div>
          <span className={styles.logoText}>Reliant</span>
        </Link>

        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.sub}>Acesse seu dashboard</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="joao@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>

        <p className={styles.footer}>
          Não tem conta?{' '}
          <Link href="/auth/signup" className={styles.link}>Criar grátis</Link>
        </p>
      </div>
    </div>
  )
}
