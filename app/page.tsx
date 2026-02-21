'use client'

import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  const [isAnnual, setIsAnnual] = React.useState(true);

  const handleCheckout = async () => {
    // ID prezzi Stripe 
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
        window.location.href = data.url;
      } else {
        console.error("Errore: URL non ricevuto dal server");
      }
    } catch (err) {
      console.error("Errore Stripe:", err);
    }
  };

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
{/* Nuovo Titolo H2 per Produttori */}
<h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
  Il Passaporto Digitale <br />
  per i <span className="text-[#0062ff] italic">tuoi prodotti.</span>
</h2>

{/* Nuovo Paragrafo Descrittivo */}
<p className="max-w-2xl text-xl text-gray-500 mb-12 font-medium leading-relaxed">
  Proteggi l'autenticità del tuo brand. TracePass permette ai produttori di certificare ogni lotto, eliminando la contraffazione e digitalizzando la tracciabilità per il cliente finale.
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
          <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Anticontraffazione Garantita</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Ogni prodotto è dotato di un passaporto digitale unico, con QR code dinamico e autenticazione crittografica per garantire l'autenticità.
          </p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white transform md:-translate-y-4">
          <div className="w-12 h-12 bg-[#0062ff] rounded-2xl flex items-center justify-center text-2xl mb-8">🌿</div>
          <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Tracciabilità Trasparente</h3>
          <p className="text-blue-100/60 font-medium leading-relaxed">
            Mostra ai tuoi clienti l'intero ciclo di vita del prodotto, dall'origine dei materiali alla destinazione finale, promuovendo la fiducia e la sostenibilità.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-white hover:border-blue-100 transition-all group">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">♻️</div>
          <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Connessione Diretta</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Aggiorna in tempo reale le informazioni del passaporto digitale, consentendo ai consumatori di accedere a dati aggiornati su riparabilità, riciclabilità e opzioni di smaltimento.
          </p>
        </div>
      </section>

      {/* Sezione QR Code Strategica */}
      <section className="relative bg-white py-32 border-y border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#0062ff]/20 blur-[60px] rounded-full scale-75 group-hover:scale-100 transition-transform"></div>
              <div className="relative w-80 h-80 bg-white rounded-[4rem] shadow-2xl border border-gray-50 p-10 flex items-center justify-center transition-transform group-hover:rotate-2 duration-700">
                
                <div className="w-full h-full grid grid-cols-7 gap-1 opacity-80">
                   {[...Array(49)].map((_, i) => {
                    const isEye = (i < 3 && i % 7 < 3) || (i % 7 > 3 && i < 7) || (i >= 42 && i % 7 < 3);
                    return (
                      <div key={i} className={`rounded-sm ${isEye || i % 4 === 0 ? 'bg-gray-900' : 'bg-gray-100'} ${i === 24 ? 'bg-[#0062ff]' : ''}`}></div>
                    );
                  })}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-50 font-black text-[10px] text-[#0062ff] tracking-tighter uppercase">
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
            
            <div className="w-full flex justify-center md:justify-start">
              <Link href="/register" className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#0062ff] transition-all shadow-xl shadow-gray-200 active:scale-95">
                Inizia Ora
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Sezione Pricing 3.0 */}
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
          
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all group">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full">Starter</span>
              <div className="mt-6 mb-8">
                <span className="text-5xl font-black tracking-tighter">€0</span>
                <span className="text-gray-400 font-bold ml-2">/sempre</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-600 italic"><span className="text-blue-500 font-bold">✓</span> 3 Passaporti Digitali</li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-600 italic"><span className="text-blue-500 font-bold">✓</span> QR Code Statici</li>
              </ul>
            </div>
            <Link href="/register" className="w-full text-center py-4 rounded-2xl border-2 border-gray-900 font-black uppercase text-[10px] tracking-widest group-hover:bg-gray-900 group-hover:text-white transition-all">
              Inizia Gratis
            </Link>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between transform md:-translate-y-4 border-4 border-[#0062ff] hover:scale-[1.05] transition-all">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full">Consigliato</span>
              <div className="mt-6 mb-8 text-white">
                <span className="text-5xl font-black tracking-tighter">
                  {isAnnual ? '€39' : '€49'}
                </span>
                <span className="text-blue-200/50 font-bold ml-2">/mese</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium text-blue-50 italic">🚀 Passaporti Illimitati</li>
                <li className="flex items-center gap-3 text-sm font-medium text-blue-50 italic">🚀 Analytics Avanzate</li>
                <li className="flex items-center gap-3 text-sm font-medium text-blue-50 italic">🚀 QR Code Dinamici</li>
              </ul>
            </div>
            <button 
              onClick={handleCheckout} 
              className="w-full text-center py-4 rounded-2xl bg-[#0062ff] text-white font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
            >
              Scegli Business
            </button>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all group">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full">Enterprise</span>
              <div className="mt-6 mb-8">
                <span className="text-5xl font-black tracking-tighter italic">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-600 italic"><span className="text-blue-500 font-bold">🛠</span> Accesso API illimitato</li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-600 italic"><span className="text-blue-500 font-bold">🛠</span> Integrazione ERP/SAP</li>
              </ul>
            </div>
            <a href="mailto:sales@tracepass.com" className="w-full text-center py-4 rounded-2xl border-2 border-gray-200 font-black uppercase text-[10px] tracking-widest text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-all">
              Contattaci
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 bg-[#f8f9fa] border-t border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <h1 className="text-xl font-black italic tracking-tighter text-gray-400 uppercase">
                TRACE<span className="text-gray-300">PASS</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                ©️ 2026 TracePass — Ecodesign Compliant System
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