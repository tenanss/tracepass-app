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
      setFormData({ name: '', material_composition: '', carbon_footprint: '', origin: '', recycling_instructions: '', repair_score: 5 })
      fetchProducts()
    }
    setLoading(false)
  }

  const deleteProduct = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo passaporto?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-orange-400';
    return 'bg-emerald-500';
  }

  return (
    <main className="min-h-screen bg-[#f4f7f9] p-4 md:p-12 font-sans text-slate-900">
      {/* HEADER CORRETTO */}
<header className="max-w-7xl mx-auto mb-12 flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
  <div className="flex flex-col">
    <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
      Trace<span className="text-blue-600 not-italic">Pass</span>
    </h1>
    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mt-2 leading-none">
      Management Console
    </p>
  </div>
  <div className="text-right">
       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">System Status</p>
       <p className="text-xs font-bold text-green-500 flex items-center justify-end">
         <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Online & Secure
       </p>
  </div>
</header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* FORM INSERIMENTO */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 sticky top-8">
            <h2 className="text-xl font-black mb-6 text-slate-800 uppercase tracking-tight">Inserimento Dati</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm" 
                placeholder="Nome Prodotto" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm" 
                  placeholder="Materiali" value={formData.material_composition} onChange={(e) => setFormData({...formData, material_composition: e.target.value})} />
                <input className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm" 
                  placeholder="CO2" value={formData.carbon_footprint} onChange={(e) => setFormData({...formData, carbon_footprint: e.target.value})} />
              </div>

              <input className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm italic" 
                placeholder="Origine (es: Made in Italy 🇮🇹)" value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} />

              <textarea className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm h-20 resize-none" 
                placeholder="Note Riciclo..." value={formData.recycling_instructions} onChange={(e) => setFormData({...formData, recycling_instructions: e.target.value})} />

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Riparabilità: {formData.repair_score}/5</label>
                <input type="range" min="1" max="5" className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  value={formData.repair_score} onChange={(e) => setFormData({...formData, repair_score: parseInt(e.target.value)})} />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg uppercase tracking-widest text-xs">
                {loading ? 'Salvataggio...' : 'Genera Passaporto'}
              </button>
            </form>
          </div>
        </div>

        {/* ARCHIVIO CON TITOLI CENTRATI */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-xl transition-all relative group overflow-hidden">
                
                <button onClick={() => deleteProduct(p.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>

                {/* TITOLO CENTRATO E NON CORSIVO */}
                <div className="mb-6 text-center">
                  <h3 className="font-bold text-slate-800 text-2xl uppercase tracking-tight truncate px-4 leading-none">{p.name}</h3>
                  <div className="inline-block mt-2 bg-blue-50 text-blue-600 text-[9px] px-3 py-0.5 rounded-full font-black uppercase border border-blue-100 tracking-tighter">
                    {p.origin || 'EU Tracked'}
                  </div>
                </div>

  <div className="grid grid-cols-2 gap-4 mb-6">
  {/* Box Materiali - Verde Pastello delicato */}
  <div className="bg-emerald-50/50 p-4 rounded-2xl text-center border border-emerald-100/50 group-hover:bg-emerald-50 transition-colors">
    <span className="text-2xl block mb-1">🌿</span>
    <p className="text-[8px] font-black text-emerald-600/70 uppercase tracking-tighter">Materiali</p>
    <p className="text-sm font-bold text-slate-700">{p.material_composition || 'N/D'}</p>
  </div>

  {/* Box CO2 - Blu Pastello delicato */}
  <div className="bg-blue-50/50 p-4 rounded-2xl text-center border border-blue-100/50 group-hover:bg-blue-50 transition-colors">
    <span className="text-2xl block mb-1">💨</span>
    <p className="text-[8px] font-black text-blue-600/70 uppercase tracking-tighter">Carbon</p>
    <p className="text-sm font-bold text-slate-700">{p.carbon_footprint || 'N/D'}</p>
  </div>
</div>

                <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[60px] text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Riciclo & Circolarità</p>
                  <p className="text-[11px] text-slate-600 font-medium italic leading-tight">{p.recycling_instructions || 'Informazioni standard.'}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm group-hover:border-blue-400 transition-colors">
                       <QRCodeSVG value={`http://localhost:3000/product/${p.id}`} size={60} />
                    </div>
                    <div>
                      <p className="text-[8px] font-mono text-slate-300">UID: {p.id.substring(0,8)}</p>
                      <div className="flex gap-1 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i < p.repair_score ? getScoreColor(p.repair_score) : 'bg-slate-100'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
<a 
  href={`/product/${p.id}`} 
  target="_blank" 
  className="text-[10px] font-black bg-blue-600 text-white px-4 py-3 rounded-xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md active:scale-95"
>
  View
</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}