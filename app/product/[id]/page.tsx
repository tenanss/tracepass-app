'use client'

import { createClient } from '@supabase/supabase-js'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState, use, useRef } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PublicProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handlePrint = () => { window.print() }

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `QRCode-${product?.name}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#e9ecef] flex items-center justify-center font-black uppercase text-slate-400">Loading...</div>

  return (
    <div className="min-h-screen bg-[#e9ecef] p-4 md:p-12 font-sans text-slate-900 flex flex-col items-center justify-center print:bg-white print:p-0">
      
      {/* FORZATURA COLORI STAMPA */}
      <style jsx global>{`
        @media print {
          .print-force {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      {/* HEADER LOGO */}
      <div className="w-full max-w-[700px] flex justify-between items-center mb-8 px-6 print:hidden">
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">
          TRACE<span className="text-[#0062ff]">PASS</span>
        </h1>
        <div className="flex items-center gap-2 text-right">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest leading-tight">
            System Online<br/>& Secure
          </p>
        </div>
      </div>

      {/* CARD PRINCIPALE */}
      <div className="w-full max-w-[700px] bg-[#f8f9fa] rounded-[4rem] p-10 md:p-16 shadow-sm border border-white relative print:shadow-none print:border-none print:bg-white">
        
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 mb-2 leading-none">
              {product?.name}
            </h2>
            <span className="text-[10px] bg-blue-50 text-[#0062ff] px-3 py-1 rounded-full font-black uppercase tracking-tighter border border-blue-100 print-force">
              EU Tracked
            </span>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origine</p>
            <p className="text-[12px] font-bold text-slate-700 italic">{product?.origin || 'Italy (UE)'}</p>
          </div>
        </div>

        {/* BOX DATI (STILE IMMAGINE 11/12) */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-6 rounded-[2.5rem] text-center border border-slate-50 shadow-sm">
            <span className="text-3xl block mb-2">🌿</span>
            <p className="text-[8px] font-black text-green-700 uppercase mb-1 tracking-widest">Materiali</p>
            <p className="text-[14px] font-bold text-slate-700 italic">{product?.material_composition}</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] text-center border border-slate-50 shadow-sm">
            <span className="text-3xl block mb-2">☁️</span>
            <p className="text-[8px] font-black text-blue-700 uppercase mb-1 tracking-widest">Carbon</p>
            <p className="text-[14px] font-bold text-slate-700 italic">{product?.carbon_footprint}</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] text-center border border-slate-50 shadow-sm">
            <span className="text-3xl block mb-2">🛡️</span>
            <p className="text-[8px] font-black text-blue-700 uppercase mb-1 tracking-widest">Sostanze</p>
            <p className="text-[11px] font-black text-green-600 uppercase print-force">Reach Ok</p>
          </div>
        </div>

        {/* CIRCOLARITÀ */}
        <div className="text-center mb-12 bg-white/30 p-8 rounded-[3rem] border border-white/50">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Riciclo & Circolarità</h3>
          <p className="text-[14px] text-slate-500 font-medium italic leading-relaxed px-4">
            {product?.recycling_instructions || "Informazioni standard per il riciclo dei tessuti."}
          </p>
        </div>

        {/* QR E REPAIR SCORE (CORRETTO PER STAMPA) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-8 border-t border-slate-100">
          <div ref={qrRef} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-inner">
             <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : ''} size={110} />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex justify-between items-end mb-4 px-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repair Score</p>
                <p className="text-[11px] font-black text-slate-800 italic">{product?.repair_score}/5</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div 
                  key={s} 
                  className={`h-2.5 flex-1 rounded-full print-force ${
                    s <= (product?.repair_score || 5) 
                    ? 'bg-green-500' 
                    : 'bg-slate-200'
                  }`} 
                  style={{ backgroundColor: s <= (product?.repair_score || 5) ? '#22c55e' : '#e2e8f0' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AZIONI RAPIDE (STAMPABILI/NAVIGABILI) */}
      <div className="w-full max-w-[700px] grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 px-6 print:hidden">
        <button onClick={handlePrint} className="py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          🖨️ Stampa Documento
        </button>
        <button onClick={downloadQRCode} className="py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          💾 Scarica QR Code
        </button>
        
        {/* PULSANTE PDF RIPRISTINATO */}
        {product?.technical_sheet_url ? (
          <a href={product.technical_sheet_url} target="_blank" className="py-4 bg-[#0062ff] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            📄 Scheda Tecnica
          </a>
        ) : (
          <div className="py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center cursor-not-allowed">
            PDF non disponibile
          </div>
        )}
      </div>

      <p className="mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em] print:hidden">
        Verified by TracePass System
      </p>
    </div>
  )
}