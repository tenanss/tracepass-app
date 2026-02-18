'use client'

import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  const [isAnnual, setIsAnnual] = React.useState(true);

  const handleCheckout = async () => {
    // ID prezzi Stripe (Verifica che siano corretti nella tua Dashboard)
    const STRIPE_MONTHLY_ID = "price_1T28vyE7LrcUGUCEt5fI9g2t"; 
    const STRIPE_YEARLY_ID = "price_1T28vyE7LrcUGUCEo593b8v5";

    const selectedPriceId = isAnnual ? STRIPE_YEARLY_ID : STRIPE_MONTHLY_ID;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedPriceId }),
      });

      const data = await response.json();
      
      if (data.url) {
        // Usa l'URL diretto fornito dal server per evitare errori di sessione
        window.location.href = data.url;
      } else {
        console.error("Errore: URL non ricevuto dal server", data.error);
        alert("Errore nella comunicazione con Stripe. Controlla il terminale.");
      }
    } catch (err) {
      console.error("Errore critico durante il checkout:", err);
    }
  }; // <--- Questa era la parentesi mancante che bloccava tutto!

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 selection:bg-blue-100">
      
      {/* Sfondo Decorativo Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0062ff]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar Minimal */}
      <nav className="relative flex justify-between items-center p-4 md:p-8 max-w-7xl mx-auto z-50 gap-2">
        <h1 className="text-lg md:text-2xl font-black italic tracking-tighter flex-shrink-0">
          <span className="text-gray-900 uppercase">TRACE</span>
          <span className="text-[#0062ff] uppercase">PASS</span>
        </h1>
        
        <div className="flex items-center gap-2 md:gap-6">
            <Link href="/login" className="hidden md:block text-xs md:text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#0062ff] transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-gray-900 text-white px-4 py-2.5 md:px-8 md:py-3 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-[#0062ff] transition-all shadow-lg active:scale-95 whitespace-nowrap">
              Get Started
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center text-center pt-24 pb-16 px-4 z-10">
        <div className="bg-blue-50 text-[#0062ff] text-[10px] font-black px-4 py-2 rounded-full mb-6 uppercase tracking-[0.3em]">
          Ecodesign for Sustainable Products Regulation
        </div>
        <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
          Il futuro è <br /> 
          <span className="text-[#0062ff] italic">trasparente.</span>
        </h2>
        <p className="max-w-2xl text-xl text-gray-500 mb-12 font-medium leading-relaxed">
          TracePass è l'infrastruttura definitiva per il <span className="text-gray-900 font-bold italic">Digital Product Passport 2026</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="bg-[#0062ff] text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200">
              Crea il tuo primo DPP
            </Link>
            <Link href="/product/demo" className="bg-white text-gray-900 border border-gray-100 px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
              Guarda Demo <span>→</span>
            </Link>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32 z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6 leading-[0.9]">
            Piani su misura per la <br />
            <span className="text-[#0062ff]">tua conformità.</span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-xs font-black uppercase tracking-widest ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Mensile</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-gray-200 rounded-full p-1 relative transition-all duration-300"
            >
              <div className={`w-6 h-6 bg-[#0062ff] rounded-full transition-all duration-300 shadow-lg ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-xs font-black uppercase tracking-widest ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
              Annuale <span className="text-[#0062ff] ml-1 text-[10px] bg-blue-50 px-2 py-1 rounded-lg">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Piano Starter */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all group">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full">Starter</span>
              <div className="mt-6 mb-8"><span className="text-5xl font-black">€0</span></div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-gray-600 italic">
                <li>✓ 3 Passaporti Digitali</li>
                <li>✓ QR Code Statici</li>
              </ul>
            </div>
            <Link href="/register" className="w-full text-center py-4 rounded-2xl border-2 border-gray-900 font-black uppercase text-[10px] tracking-widest hover:bg-gray-900 hover:text-white transition-all">
              Inizia Gratis
            </Link>
          </div>

          {/* Piano Business */}
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between transform md:-translate-y-4 border-4 border-[#0062ff] hover:scale-[1.05] transition-all">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full">Consigliato</span>
              <div className="mt-6 mb-8 text-white">
                <span className="text-5xl font-black">{isAnnual ? '€39' : '€49'}</span>
                <span className="text-blue-200/50 font-bold ml-2">/mese</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-blue-50 italic">
                <li>🚀 Passaporti Illimitati</li>
                <li>🚀 QR Code Dinamici</li>
              </ul>
            </div>
            <button 
              onClick={handleCheckout} 
              className="w-full text-center py-4 rounded-2xl bg-[#0062ff] text-white font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg"
            >
              Scegli Business
            </button>
          </div>

          {/* Piano Enterprise */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all group">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full">Enterprise</span>
              <div className="mt-6 mb-8"><span className="text-5xl font-black italic">Custom</span></div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-gray-600 italic">
                <li>🛠 Integrazione ERP/SAP</li>
                <li>🛠 API Illimitate</li>
              </ul>
            </div>
            <a href="mailto:sales@tracepass.com" className="w-full text-center py-4 rounded-2xl border-2 border-gray-200 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
              Contattaci
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 bg-[#f8f9fa] border-t border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <h1 className="text-xl font-black italic tracking-tighter text-gray-400 uppercase">TRACEPASS</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">©️ 2026 TracePass</p>
        </div>
      </footer>
    </div>
  );
}