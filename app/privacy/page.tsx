'use client'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-20 font-sans text-slate-800 leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Privacy Policy</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Ultimo aggiornamento: 16 Febbraio 2026</p>

        <section className="space-y-8 text-sm">
          <div>
            <h2 className="text-lg font-black uppercase mb-3 text-[#0062ff]">1. Titolare del Trattamento</h2>
            <p>Il titolare del trattamento dei dati è <strong>TracePass</strong>. Per qualsiasi domanda relativa alla privacy, puoi contattarci all'indirizzo support@tracepass.com.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-3 text-[#0062ff]">2. Dati Raccolti</h2>
            <p>Raccogliamo dati tecnici relativi ai prodotti per la creazione del <strong>Digital Product Passport (DPP)</strong> secondo il regolamento UE 2026/2024. Questo include: composizione materiali, origine, carbon footprint e documentazione tecnica.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-3 text-[#0062ff]">3. Finalità del Trattamento</h2>
            <p>I dati sono trattati esclusivamente per fornire il servizio di tracciabilità digitale, permettere la scansione dei QR Code da parte degli utenti finali e garantire la conformità normativa dei produttori.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-3 text-[#0062ff]">4. Conservazione e Sicurezza</h2>
            <p>Utilizziamo infrastrutture cloud sicure (Supabase/PostgreSQL) con crittografia dei dati. I file PDF caricati sono conservati in bucket protetti e resi accessibili solo tramite i link generati dal sistema.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-3 text-[#0062ff]">5. Diritti dell'Utente</h2>
            <p>In conformità al GDPR, l'utente ha il diritto di accedere, rettificare o cancellare i propri dati in qualsiasi momento attraverso la Dashboard di TracePass.</p>
          </div>
        </section>

        <button onClick={() => window.history.back()} className="mt-16 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#0062ff] transition-all">
          ← Torna alla navigazione
        </button>
      </div>
    </div>
  )
}