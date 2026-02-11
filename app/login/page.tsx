'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  // Inizializzazione corretta per SSR
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Accesso negato: " + authError.message)
      setLoading(false)
    } else {
      // Con createBrowserClient, i cookie vengono gestiti automaticamente.
      // Facciamo un refresh totale per attivare il Middleware.
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-[#e9ecef] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-[3rem] p-10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black italic text-slate-800 uppercase">
            TRACE<span className="text-[#0062ff]">PASS</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

          <button 
            disabled={loading}
            className="py-4 bg-[#0062ff] text-white rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-all"
          >
            {loading ? 'Verifica...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}