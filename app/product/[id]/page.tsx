'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

export default function PublicProductPassport() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setProduct(data)
      } catch (err) {
        console.error('Errore nel caricamento del prodotto:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id, supabase])

  const handlePrint = () => { window.print() }

  if (loading) return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#0062ff] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black italic text-slate-400 uppercase tracking-[0.2em] text-[10px]">Verifica TracePass in corso...</p>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-8 text-center">
      <div className="max-w-sm bg-white p-10 rounded-[3rem] shadow-xl border border-red-50">
        <h1 className="font-black text-red-500 uppercase italic mb-2 tracking-tighter">Errore Sistema</h1>
        <p className="text-slate-500 text-sm font-bold">Passaporto Digitale non trovato o ID non valido.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans pb-20 print:bg-white">
      
      {/* 1. NAVBAR - Azioni e Branding */}
      <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 border-b border-slate-100 print:hidden">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-black italic tracking-tighter text-slate-800 uppercase">
            TRACE<span className="text-[#0062ff]">PASS</span>
          </h1>
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-600 text-[8px] px-3 py-2 rounded-full font-black uppercase tracking-widest hidden sm:block">Verified 2026</span>
            <button onClick={handlePrint} className="bg-[#0062ff] text-white text-[9px] px-5 py-2 rounded-full font-black uppercase tracking-[0.1em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              STAMPA DPP
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-6 space-y-6">
        
        {/* 2. QR CODE SECTION - Requisito Tracciabilità DPP */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-white flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase text-[#0062ff] tracking-[0.3em] mb-8 block">Certificato Digitale di Tracciabilità</span>
            <div className="p-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-xl mb-6 ring-8 ring-slate-50/50">
                <QRCodeSVG 
                    value={typeof window !== 'undefined' ? window.location.href : ''} 
                    size={200}
                    level={"H"}
                    includeMargin={false}
                />
            </div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Product Unique ID</p>
            <code className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{product.id}</code>
        </div>

        {/* 3. HERO CARD - Informazioni Prodotto */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-white">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[#0062ff] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Modello Certificato</p>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">
                {product.name || 'Prodotto Senza Nome'}
              </h2>
            </div>
            <div className="bg-[#eef2ff] px-5 py-4 rounded-3xl text-center border border-blue-50 shadow-inner">
                <span className="block text-[8px] font-black uppercase text-[#0062ff] mb-1 leading-none">Repair<br/>Score</span>
                <span className="text-3xl font-black text-[#0062ff] italic leading-none">{product.repair_score || '0'}/5</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100/50">
              <span className="block text-[9px] font-black uppercase text-slate-400 mb-2">Origine</span>
              <span className="font-bold text-sm italic text-slate-700">{product.origin || 'N/D'}</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100/50">
              <span className="block text-[9px] font-black uppercase text-slate-400 mb-2">Impronta CO2</span>
              <span className="font-bold text-sm italic text-[#0062ff]">{product.carbon_footprint || 'N/D'}</span>
            </div>
          </div>
        </div>

        {/* 4. CIRCOLARITÀ E MATERIALI - Requisiti Normativi */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-white space-y-8">
            <div>
                <h4 className="text-[10px] font-black uppercase text-[#0062ff] tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#0062ff] rounded-full"></span> Composizione Materiali
                </h4>
                <p className="text-slate-600 font-bold italic text-sm leading-relaxed">
                    {product.material_composition || 'Informazione sulla composizione non disponibile.'}
                </p>
            </div>
            
            <div className="h-[1px] bg-slate-50"></div>
            
            <div>
                <h4 className="text-[10px] font-black uppercase text-green-500 tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Istruzioni Riciclo & Fine Vita
                </h4>
                <p className="text-slate-600 font-bold italic text-sm leading-relaxed">
                    {product.recycling_instructions || 'Istruzioni per il fine vita non specificate.'}
                </p>
            </div>

            <div className="h-[1px] bg-slate-50"></div>

            <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span> Sostanze (REACH)
                </h4>
                <p className="text-slate-600 font-bold italic text-sm">
                    {product.substances_reach || 'Conforme alle normative REACH.'}
                </p>
            </div>
        </div>

        {/* 5. ASSET DIGITALI - Documentazione e Video (Obbligatori DPP 2026) */}
        <div className="grid grid-cols-1 gap-4 print:hidden">
            {product.tech_doc_url ? (
                <a href={product.tech_doc_url} target="_blank" className="bg-slate-900 text-white p-7 rounded-[2.5rem] flex justify-between items-center group hover:bg-black transition-all shadow-xl shadow-slate-200">
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Certificazione</p>
                        <span className="font-black italic uppercase text-lg tracking-tight">Manuale Tecnico PDF</span>
                    </div>
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
            ) : (
                <div className="bg-slate-100 p-6 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 italic">Documentazione Tecnica in fase di caricamento</span>
                </div>
            )}

            {product.video_url && (
                <a href={product.video_url} target="_blank" className="bg-[#0062ff] text-white p-7 rounded-[2.5rem] flex justify-between items-center shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all">
                    <div>
                        <p className="text-[9px] font-black uppercase text-blue-200 tracking-widest mb-1">Video Tutorial</p>
                        <span className="font-black italic uppercase text-lg tracking-tight">Istruzioni Smontaggio</span>
                    </div>
                    <span className="text-xl animate-pulse">▶</span>
                </a>
            )}
        </div>

        {/* 6. FOOTER STAMPA - Visibile solo su carta */}
        <div className="hidden print:block text-center pt-20 border-t border-dashed border-slate-200">
            <h3 className="font-black italic uppercase text-slate-800 text-lg mb-2">TRACEPASS AUTHENTIC</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Passaporto Digitale Generato il {new Date().toLocaleDateString('it-IT')}
            </p>
            <p className="text-[8px] text-slate-300 mt-4">Conforme al Regolamento UE 2024/2026 Ecodesign for Sustainable Products</p>
        </div>

      </main>
    </div>
  )
}