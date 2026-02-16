'use client'

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 selection:bg-blue-100">
      
      {/* Sfondo Decorativo Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0062ff]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar Minimal */}
      <nav className="relative flex justify-between items-center p-8 max-w-7xl mx-auto z-10">
        <h1 className="text-2xl font-black italic tracking-tighter">
          <span className="text-gray-900 uppercase">TRACE</span>
          <span className="text-[#0062ff] uppercase">PASS</span>
        </h1>
        <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#0062ff] transition-colors">Login</Link>
            <Link href="/register" className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#0062ff] transition-all shadow-xl shadow-gray-200 active:scale-95">
              Get Started
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center text-center pt-24 pb-16 px-4 z-10">
        <div className="bg-blue-50 text-[#0062ff] text-[10px] font-black px-4 py-2 rounded-full mb-6 uppercase tracking-[0.3em] animate-fade-in">
          Ecodesign for Sustainable Products Regulation
        </div>
        <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
          Il futuro è <br /> 
          <span className="text-[#0062ff] italic">trasparente.</span>
        </h2>
        <p className="max-w-2xl text-xl text-gray-500 mb-12 font-medium leading-relaxed">
          TracePass è l'infrastruttura definitiva per il <span className="text-gray-900 font-bold italic">Digital Product Passport 2026</span>. 
          Trasforma la conformità normativa in un vantaggio competitivo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="bg-[#0062ff] text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200">
              Crea il tuo primo DPP
            </Link>
            <Link 
  href="/product/demo" 
  className="bg-white text-gray-900 border border-gray-100 px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-sm group flex items-center gap-2"
>
  Guarda Demo <span className="group-hover:translate-x-1 transition-transform">→</span>
</Link>
        </div>
      </header>

      {/* DPP 2026 Features Grid - Stilizzata "Bento" */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6 z-10">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-white hover:border-blue-100 transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">🛠️</div>
          <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Repair Score</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Calcolo istantaneo dell'indice di riparabilità secondo i nuovi standard UE. Documentazione tecnica sempre accessibile.
          </p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white transform md:-translate-y-4">
          <div className="w-12 h-12 bg-[#0062ff] rounded-2xl flex items-center justify-center text-2xl mb-8">🌿</div>
          <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Eco-Tracking</h3>
          <p className="text-blue-100/60 font-medium leading-relaxed">
            Monitoraggio preciso dell'impronta di carbonio e della composizione chimica REACH per ogni lotto di produzione.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-white hover:border-blue-100 transition-all group">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">♻️</div>
          <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Circular Economy</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Istruzioni per il fine-vita e canali di riciclo dedicati. Rendi il tuo prodotto eterno attraverso i dati.
          </p>
        </div>
      </section>

      {/* Sezione QR Code Strategica (Mantenuta e Migliorata) */}
      <section className="relative bg-white py-32 border-y border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#0062ff]/20 blur-[60px] rounded-full scale-75 group-hover:scale-100 transition-transform"></div>
              <div className="relative w-80 h-80 bg-white rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-50 p-12 flex items-center justify-center transition-transform group-hover:rotate-2 duration-700">
                
                <div className="w-full h-full grid grid-cols-7 gap-1 opacity-80">
                  <div className="col-span-2 row-span-2 border-[5px] border-gray-900 rounded-lg p-1">
                    <div className="w-full h-full bg-gray-900 rounded-sm"></div>
                  </div>
                  <div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div>
                  <div className="col-span-2 row-span-2 border-[5px] border-gray-900 rounded-lg p-1">
                    <div className="w-full h-full bg-gray-900 rounded-sm"></div>
                  </div>
                  <div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-[#0062ff]"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div>
                  <div className="bg-transparent"></div><div className="bg-[#0062ff] animate-pulse"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div>
                  <div className="col-span-2 row-span-2 border-[5px] border-gray-900 rounded-lg p-1">
                    <div className="w-full h-full bg-gray-900 rounded-sm"></div>
                  </div>
                  <div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div>
                  <div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-[#0062ff]"></div><div className="bg-gray-900"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-50 font-black text-[10px] text-[#0062ff] tracking-tighter">
                     TRACEPASS
                   </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-4 bg-[#0062ff] text-white px-8 py-4 rounded-[1.5rem] shadow-2xl transform -rotate-3 font-black italic border-[4px] border-white text-sm">
                VERIFIED DPP 2026
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-10">
            <div>
              <h2 className="text-5xl font-black tracking-tighter text-gray-900 mb-6 leading-none">
                Da un file PDF <br />
                <span className="text-[#0062ff]">all'etichetta smart.</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                TracePass automatizza la creazione della documentazione obbligatoria. Carichi gli asset, noi pensiamo al resto.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex gap-6 items-start">
                <div className="bg-blue-50 p-4 rounded-2xl font-black text-[#0062ff] text-sm italic shadow-sm">01</div>
                <div>
                  <h4 className="font-black uppercase italic text-sm text-gray-900 mb-1">Upload Intelligente</h4>
                  <p className="text-sm text-gray-500 font-medium italic">Archiviazione sicura di manuali tecnici e video guide su Cloud certificato.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-blue-50 p-4 rounded-2xl font-black text-[#0062ff] text-sm italic shadow-sm">02</div>
                <div>
                  <h4 className="font-black uppercase italic text-sm text-gray-900 mb-1">Stampa in Serie</h4>
                  <p className="text-sm text-gray-500 font-medium italic">Esporta migliaia di codici pronti per la tua linea di produzione in un click.</p>
                </div>
              </div>
            </div>
            
            <Link href="/register" className="inline-block bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#0062ff] transition-all shadow-xl shadow-gray-200">
              Inizia la trasformazione
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 bg-[#f8f9fa] border-t border-gray-100 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <h1 className="text-xl font-black italic tracking-tighter text-gray-400 uppercase">
                TRACE<span className="text-gray-300">PASS</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                © 2026 TracePass — Ecodesign Compliant System
            </p>
         <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
    <Link href="/privacy" className="hover:text-[#0062ff] transition-colors">Privacy</Link>
    <Link href="/terms" className="hover:text-[#0062ff] transition-colors">Terms</Link>
    <a href="mailto:support@tracepass.com" className="hover:text-[#0062ff] transition-colors">Support</a>
</div>
        </div>
      </footer>
    </div>
  );
}