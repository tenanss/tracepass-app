'use client'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8 md:p-20 font-sans text-slate-800 leading-relaxed">
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Termini di Servizio</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Versione 1.0 — Febbraio 2026</p>

        <section className="space-y-8 text-sm text-left">
          <div>
            <h2 className="text-lg font-black uppercase mb-2">1. Accettazione dei Termini</h2>
            <p>Utilizzando <strong>TracePass</strong>, l'utente accetta di essere vincolato dai presenti termini. Il servizio è rivolto ad aziende e professionisti che necessitano di adempiere agli obblighi del Digital Product Passport.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-2">2. Responsabilità sui Contenuti</h2>
            <p>L'utente è l'unico responsabile della veridicità delle informazioni inserite (materiali, certificazioni, link). TracePass fornisce l'infrastruttura tecnologica ma non certifica la validità dei dati inseriti dai produttori.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-2">3. Proprietà Intellettuale</h2>
            <p>Il software, il design della dashboard e il marchio TracePass sono di proprietà esclusiva. L'utente mantiene la proprietà dei dati e dei file caricati sulla piattaforma.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-2">4. Limitazione di Responsabilità</h2>
            <p>TracePass non sarà responsabile per eventuali sanzioni derivanti da un uso improprio della piattaforma o dall'inserimento di dati incompleti rispetto alle normative vigenti nel proprio settore specifico.</p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase mb-2">5. Modifiche al Servizio</h2>
            <p>Ci riserviamo il diritto di aggiornare le funzionalità del sistema per riflettere i cambiamenti legislativi dell'Unione Europea in materia di Ecodesign (ESPR).</p>
          </div>
        </section>

        <button onClick={() => window.history.back()} className="mt-16 border border-slate-200 text-slate-400 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
          Chiudi Documento
        </button>
      </div>
    </div>
  )
}