'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function DemoProductPassport() {
  // Dati statici per la Demo - Esempio di un prodotto Premium
  const product = {
    id: "DEMO-2026-TRCPSS",
    name: "Eco-Watch Series 1",
    repair_score: 4.8,
    origin: "Basilea, Svizzera",
    carbon_footprint: "2.4kg CO2e",
    material_composition: "90% Acciaio riciclato, 10% Vetro zaffiro sintetico.",
    recycling_instructions: "Smontare il cinturino. La batteria al litio deve essere smaltita presso i centri di raccolta RAEE autorizzati.",
    substances_reach: "Esente da piombo e nichel secondo direttiva REACH 2026.",
    tech_doc_url: "#", 
    video_url: "#"
  }

  const handlePrint = () => { window.print() }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans pb-20 print:bg-white">
      
      {/* NAVBAR DEMO */}
      <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 border-b border-slate-100 print:hidden">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-lg font-black italic tracking-tighter text-slate-800 uppercase">
                TRACE<span className="text-[#0062ff]">PASS</span>
            </h1>
            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest leading-none">Anteprima Live Demo</span>
          </div>
          <button onClick={handlePrint} className="bg-[#0062ff] text-white text-[9px] px-5 py-2 rounded-full font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100">
            STAMPA DPP
          </button>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-6 space-y-6">
        
        {/* QR CODE SECTION */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-white flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase text-[#0062ff] tracking-[0.3em] mb-8 block">Certificato Digitale 2026</span>
            <div className="p-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-xl mb-6 ring-8 ring-slate-50/50">
                <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : ''} size={200} level={"H"} />
            </div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Product Unique ID</p>
            <code className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{product.id}</code>
        </div>

        {/* INFO PRODOTTO */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-white">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[#0062ff] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Modello Certificato</p>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">{product.name}</h2>
            </div>
            <div className="bg-[#eef2ff] px-5 py-4 rounded-3xl text-center border border-blue-50">
                <span className="block text-[8px] font-black uppercase text-[#0062ff] mb-1">Repair Score</span>
                <span className="text-3xl font-black text-[#0062ff] italic leading-none">{product.repair_score}/5</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100/50 text-left">
              <span className="block text-[9px] font-black uppercase text-slate-400 mb-2">Origine</span>
              <span className="font-bold text-sm italic">{product.origin}</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100/50 text-left">
              <span className="block text-[9px] font-black uppercase text-slate-400 mb-2">Impronta CO2</span>
              <span className="font-bold text-sm italic text-[#0062ff]">{product.carbon_footprint}</span>
            </div>
          </div>
        </div>

        {/* MATERIALI & CIRCOLARITÀ */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-white space-y-8 text-left">
            <div className="text-left">
                <h4 className="text-[10px] font-black uppercase text-[#0062ff] tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#0062ff] rounded-full"></span> Composizione Materiali
                </h4>
                <p className="text-slate-600 font-bold italic text-sm text-left">{product.material_composition}</p>
            </div>
            <div className="h-[1px] bg-slate-50"></div>
            <div className="text-left">
                <h4 className="text-[10px] font-black uppercase text-green-500 tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Istruzioni Riciclo
                </h4>
                <p className="text-slate-600 font-bold italic text-sm text-left">{product.recycling_instructions}</p>
            </div>
        </div>

        {/* ASSET DIGITALI DEMO */}
        <div className="grid grid-cols-1 gap-4 print:hidden">
            <div className="bg-slate-900 text-white p-7 rounded-[2.5rem] flex justify-between items-center group cursor-pointer hover:bg-black transition-all shadow-xl">
                <div>
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Demo Link</p>
                    <span className="font-black italic uppercase text-lg tracking-tight">Manuale Tecnico PDF</span>
                </div>
                <span className="text-2xl">→</span>
            </div>
            <div className="bg-[#0062ff] text-white p-7 rounded-[2.5rem] flex justify-between items-center shadow-2xl shadow-blue-200 cursor-pointer hover:scale-[1.02] transition-all">
                <div>
                    <p className="text-[9px] font-black uppercase text-blue-200 tracking-widest mb-1 italic">Demo Link</p>
                    <span className="font-black italic uppercase text-lg tracking-tight">Video Istruzioni</span>
                </div>
                <span className="text-xl animate-pulse">▶</span>
            </div>
        </div>
      </main>
    </div>
  )
}