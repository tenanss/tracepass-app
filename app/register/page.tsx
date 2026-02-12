"use client";
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Controlla l'email per confermare l'iscrizione!");
    }
    setLoading(false);
  };

  return (
    // Sfondo grigio identico al login
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9ecef] px-4">
      
      {/* Card perfetta - Non toccare */}
      <div className="max-w-sm w-full bg-white p-10 rounded-[3.5rem] shadow-sm flex flex-col items-center border border-gray-50">
        
        {/* Logo TRACEPASS - Non toccare */}
        <div className="mb-4">
           <h1 className="text-2xl font-black italic tracking-tighter">
             <span className="text-[#1f2937]">TRACE</span>
             <span className="text-[#0062ff]">PASS</span>
           </h1>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-8">
          Registrazione Gratuita
        </h2>
        
        <form onSubmit={handleRegister} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
              Email / Email aziendale
            </label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 bg-[#eef2ff] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0062ff]/20 text-base text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-[#eef2ff] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0062ff]/20 text-base text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-2xl shadow-lg text-base font-bold text-white bg-[#0062ff] hover:bg-[#004ecc] transition-all disabled:opacity-50 mt-4 uppercase tracking-widest"
          >
            {loading ? "CARICAMENTO..." : "REGISTRATI"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-[10px] text-center font-bold uppercase">{error}</p>
        )}
        
        {message && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
             <p className="text-[#0062ff] text-xs text-center font-bold italic">{message}</p>
          </div>
        )}

        <p className="mt-10 text-center text-[13px] text-gray-400 font-medium">
          Hai già un account?{" "}
          <Link href="/login" className="text-[#0062ff] font-bold hover:underline ml-1">
            Accedi qui
          </Link>
        </p>
      </div>
    </div>
  );
}