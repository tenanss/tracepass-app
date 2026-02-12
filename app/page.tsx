import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-900">
      {/* Navbar Minimal */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black italic tracking-tighter">
          <span className="text-gray-900">TRACE</span>
          <span className="text-[#0062ff]">PASS</span>
        </h1>
        <Link href="/login" className="bg-[#0062ff] text-white px-6 py-2 rounded-full font-bold hover:bg-[#004ecc] transition-all shadow-md">
          Accedi
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          Il Passaporto Digitale <br /> 
          <span className="text-[#0062ff]">a portata di QR Code.</span>
        </h2>
        <p className="max-w-2xl text-lg text-gray-600 mb-10 font-medium">
          TracePass aiuta le aziende ad adeguarsi al regolamento *DPP 2026*. 
          Trasparenza, sostenibilità e conformità normativa in un'unica piattaforma.
        </p>
        <Link href="/register" className="bg-white text-[#0062ff] border-2 border-[#0062ff] px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#0062ff] hover:text-white transition-all shadow-lg">
          Inizia Ora Gratuitamente
        </Link>
      </header>

      {/* DPP 2026 Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {/* Card 1: Riparabilità */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="text-3xl mb-4 text-[#0062ff]">🛠️</div>
          <h3 className="text-xl font-bold mb-3 italic">Indice di Riparabilità</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            In linea con i requisiti 2026, gestiamo il *Repair Score* per ogni prodotto, 
            incentivando il riutilizzo e la riduzione degli sprechi.
          </p>
        </div>

        {/* Card 2: Materiali */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="text-3xl mb-4 text-[#0062ff]">🌿</div>
          <h3 className="text-xl font-bold mb-3 italic">Trasparenza Materiali</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Monitora la composizione, l'origine e l'impronta di carbonio. 
            Ogni dato è archiviato in modo sicuro e accessibile via QR.
          </p>
        </div>

        {/* Card 3: Circolarità */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="text-3xl mb-4 text-[#0062ff]">♻️</div>
          <h3 className="text-xl font-bold mb-3 italic">Ciclo di Vita</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Fornisci istruzioni chiare sul riciclo e sulla gestione delle sostanze *REACH* 
            per garantire un futuro circolare ai tuoi prodotti.
          </p>
        </div>
      </section>

<section className="bg-white py-20 border-y border-gray-100">
  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
    
{/* Visualizzazione QR Code "REALISTICO" in CSS */}
<div className="flex-1 flex justify-center">
  <div className="relative group">
    <div className="w-72 h-72 bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
      
      {/* Griglia QR realistica */}
      <div className="w-full h-full grid grid-cols-7 gap-1">
        {/* Angolo Top-Left (Quadrato grande) */}
        <div className="col-span-2 row-span-2 border-4 border-gray-900 rounded-sm p-1">
          <div className="w-full h-full bg-gray-900 rounded-xs"></div>
        </div>
        <div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div>
        {/* Angolo Top-Right (Quadrato grande) */}
        <div className="col-span-2 row-span-2 border-4 border-gray-900 rounded-sm p-1">
          <div className="w-full h-full bg-gray-900 rounded-xs"></div>
        </div>

        {/* Centro del QR (Pixel casuali) */}
        <div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-[#0062ff]"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div>
        <div className="bg-transparent"></div><div className="bg-[#0062ff] animate-pulse"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div>

        {/* Angolo Bottom-Left (Quadrato grande) */}
        <div className="col-span-2 row-span-2 border-4 border-gray-900 rounded-sm p-1">
          <div className="w-full h-full bg-gray-900 rounded-xs"></div>
        </div>
        <div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-gray-900"></div>
        <div className="bg-transparent"></div><div className="bg-gray-900"></div><div className="bg-transparent"></div><div className="bg-[#0062ff]"></div><div className="bg-gray-900"></div>
      </div>

      {/* Mini Logo al centro per brandizzare */}
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-100 font-black text-[9px] text-[#0062ff] tracking-tighter">
           TRACE
         </div>
      </div>
    </div>
    
    {/* Badge Repair Score (rimasto uguale) */}
    <div className="absolute -bottom-6 -right-4 bg-[#0062ff] text-white px-6 py-3 rounded-2xl shadow-xl transform rotate-3 font-black italic border-2 border-white">
      REPAIR SCORE 8.5
    </div>
  </div>
</div>

    {/* Testo Spiegazione Strategica */}
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
          La tua infrastruttura <br />
          <span className="text-[#0062ff]">per il DPP 2026.</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Non devi preoccuparti della burocrazia. *TracePass* ti fornisce gli strumenti per caricare i dati richiesti dall'UE in pochi click.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="bg-gray-100 p-3 rounded-2xl h-fit italic font-black text-[#0062ff]">01</div>
          <div>
            <h4 className="font-bold text-gray-900">Carichi i tuoi contenuti</h4>
            <p className="text-sm text-gray-500 font-medium">Carica i tuoi PDF tecnici e link video direttamente nella dashboard.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-100 p-3 rounded-2xl h-fit italic font-black text-[#0062ff]">02</div>
          <div>
            <h4 className="font-bold text-gray-900">Generiamo il passaporto</h4>
            <p className="text-sm text-gray-500 font-medium">Il sistema crea un QR CODE e una pagina ottimizzata per ogni prodotto.</p>
          </div>
        </div>
      </div>
      
      <Link href="/register" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg">
        Prova la Dashboard
      </Link>
    </div>

  </div>
</section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-400 text-xs">
        <p>© 2026 TracePass - Conformità DPP e Sostenibilità Digitale</p>
      </footer>
    </div>
  );
}