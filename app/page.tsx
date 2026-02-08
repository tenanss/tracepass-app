'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { QRCodeSVG } from 'qrcode.react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    material_composition: '',
    carbon_footprint: '',
    origin: '',
    recycling_instructions: '',
    technical_sheet_url: '',
    repair_score: 5
  })

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('products').insert([formData])
    if (!error) {
      setFormData({ name: '', material_composition: '', carbon_footprint: '', origin: '', recycling_instructions: '', technical_sheet_url: '', repair_score: 5 })
      fetchProducts()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#e9ecef] p-8 font-sans text-slate-900">
      
      {/* HEADER ORIGINALE */}
      <div className="max-w-[1400px] mx-auto flex justify-between items-center mb-12 px-4">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-800 uppercase">TRACEPASS</h1>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">System Online</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* INSERIMENTO DATI (SINISTRA) */}
        <div className="lg:col-span-4 bg-[#f8f9fa] rounded-[3.5rem] p-12 shadow-sm border border-white/50 h-fit">
          <h2 className="text-2xl font-black uppercase mb-10 tracking-tight">Inserimento Dati</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Nome Prodotto" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none font-medium"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Materiali" className="p-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none font-medium"
                value={formData.material_composition} onChange={(e) => setFormData({...formData, material_composition: e.target.value})} />
              <input required placeholder="CO2 (kg)" className="p-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none font-medium"
                value={formData.carbon_footprint} onChange={(e) => setFormData({...formData, carbon_footprint: e.target.value})} />
            </div>

            <input placeholder="Origine (es: Italy IT)" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none font-medium"
              value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} />

            <input placeholder="URL PDF Scheda Tecnica" className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none font-medium"
              value={formData.technical_sheet_url} onChange={(e) => setFormData({...formData, technical_sheet_url: e.target.value})} />

            <textarea placeholder="Note Riciclo..." className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none font-medium h-24 resize-none"
              value={formData.recycling_instructions} onChange={(e) => setFormData({...formData, recycling_instructions: e.target.value})} />

            <div className="pt-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Riparabilità: {formData.repair_score}/5</p>
              <input type="range" min="1" max="5" className="w-full accent-blue-600" value={formData.repair_score}
                onChange={(e) => setFormData({...formData, repair_score: parseInt(e.target.value)})} />
            </div>

            <button disabled={loading} className="w-full py-6 bg-[#0062ff] text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
              Genera Passaporto
            </button>
          </form>
        </div>

        {/* ARCHIVIO DIGITALE (DESTRA) */}
        <div className="lg:col-span-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 px-6 text-right">Archivio Digitale</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((p) => (
              <div key={p.id} className="bg-[#f8f9fa] rounded-[3.5rem] p-10 shadow-sm border border-white group relative">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">{p.name}</h3>
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase tracking-tighter">EU Tracked</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Origine</p>
                    <p className="text-[11px] font-bold text-slate-700 italic">{p.origin || 'Italy (UE)'}</p>
                  </div>
                </div>

                {/* I TRE BOX: MATERIALI, CARBON, SOSTANZE */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white p-4 rounded-[1.8rem] text-center border border-slate-50 shadow-sm">
                    <span className="text-xl block mb-1">🌿</span>
                    <p className="text-[7px] font-black text-green-700 uppercase mb-1">Materiali</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">{p.material_composition}</p>
                  </div>
                  <div className="bg-white p-4 rounded-[1.8rem] text-center border border-slate-50 shadow-sm">
                    <span className="text-xl block mb-1">☁️</span>
                    <p className="text-[7px] font-black text-blue-700 uppercase mb-1">Carbon</p>
                    <p className="text-[11px] font-bold text-slate-700">{p.carbon_footprint}</p>
                  </div>
                  <div className="bg-white p-4 rounded-[1.8rem] text-center border border-slate-50 shadow-sm">
                    <span className="text-xl block mb-1">🛡️</span>
                    <p className="text-[7px] font-black text-blue-700 uppercase mb-1">Sostanze</p>
                    <p className="text-[10px] font-black text-green-600">REACH OK</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 mt-4">
                  <div className="bg-white p-2 rounded-[1.2rem] border border-slate-100 shadow-inner">
                    <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/${p.id}`} size={64} />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1.5 mb-4 px-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= (p.repair_score || 5) ? 'bg-green-500 shadow-sm' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    <a href={`/product/${p.id}`} target="_blank" className="block w-full text-center py-4 bg-[#0062ff] text-white rounded-[1.2rem] text-[11px] font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}