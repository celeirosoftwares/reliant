'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✉️</div>
          <h1 className={styles.title}>Verifique seu email</h1>
          <p className={styles.sub}>
            Enviamos um link de confirmação para <strong>{email}</strong>.<br />
            Clique no link para ativar sua conta.
          </p>
          <Link href="/auth/login" className={styles.link}>
            Voltar para o login →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark}>R</div>
          <span className={styles.logoText}>Reliant</span>
        </Link>

        <h1 className={styles.title}>Criar conta</h1>
        <p className={styles.sub}>Comece grátis. Sem cartão de crédito.</p>

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nome completo</label>
            <input
              className={styles.input}
              type="text"
              placeholder="João Silva"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
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
              placeholder="mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta →'}
          </button>
        </form>

        <p className={styles.footer}>
          Já tem conta?{' '}
          <Link href="/auth/login" className={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
