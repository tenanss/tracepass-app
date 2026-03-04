'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'; 

export default function LoginPage() {
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
            /* MODIFICA: Aggiunto text-black e placeholder color per visibilità mobile */
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-black placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            /* MODIFICA: Aggiunto text-black e placeholder color per visibilità mobile */
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-black placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="py-4 bg-[#0062ff] text-white rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Verifica...' : 'Accedi'}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-gray-400 font-medium">
          Non hai un account?{" "}
          <Link href="/register" className="text-[#0062ff] font-bold hover:underline ml-1">
            Registrati ora
          </Link>
        </p>
      </div>
    </div>
  )
}