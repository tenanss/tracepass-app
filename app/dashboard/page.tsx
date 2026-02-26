'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

const PLAN_LIMITS = {
  starter: 3,
  business: 20,
  enterprise: 9999
};

export default function DashboardPage() {
  const router = useRouter()
  
  const [planType, setPlanType] = useState<string>('starter')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPrintMode, setIsPrintMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    repair_score: '5',
    origin: '',
    material_composition: '',
    carbon_footprint: '',
    substances_reach: '',
    recycling_instructions: '',
    tech_doc_url: '', 
    video_url: ''     
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const adminEmail = 'tenanssimone@outlook.com';

  const refreshData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('email', session.user.email)
      .maybeSingle()

    if (productsData) setProducts(productsData)
    if (sub) setPlanType(sub.plan_type)
  }

  useEffect(() => {
    const checkAuthAndSub = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return; }
      setUserEmail(session.user.email ?? null)
      await refreshData()
      setLoading(false)
    }
    checkAuthAndSub()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const productData = { 
      name: newProduct.name,
      repair_score: parseInt(newProduct.repair_score),
      origin: newProduct.origin,
      material_composition: newProduct.material_composition,
      carbon_footprint: newProduct.carbon_footprint,
      substances_reach: newProduct.substances_reach,
      recycling_instructions: newProduct.recycling_instructions,
      tech_doc_url: newProduct.tech_doc_url,
      video_url: newProduct.video_url,
      user_id: session.user.id 
    }

    if (editingId) {
      await supabase.from('products').update(productData).eq('id', editingId)
    } else {
      await supabase.from('products').insert([productData])
    }
    
    setIsModalOpen(false)
    setEditingId(null)
    setNewProduct({ name: '', repair_score: '5', origin: '', material_composition: '', carbon_footprint: '', substances_reach: '', recycling_instructions: '', tech_doc_url: '', video_url: '' })
    await refreshData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      await supabase.from('products').delete().eq('id', id)
      await refreshData() 
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'tech_doc_url' | 'video_url') => {
    const file = e.target.files?.[0]
    if (!file) return
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`
    const { error } = await supabase.storage.from('product-assets').upload(filePath, file)
    if (error) { alert(error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-assets').getPublicUrl(filePath)
    setNewProduct({ ...newProduct, [field]: publicUrl })
    alert("File caricato!")
  }

  // LOGICA TASTO
  const currentLimit = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] || 3;
  const showUpgradeButton = products.length >= currentLimit && userEmail !== adminEmail;

  if (loading) return <div className="min-h-screen bg-[#f1f3f5] flex items-center justify-center font-black uppercase text-slate-400 text-[10px]">TracePass Loading...</div>

  return (
    <div className="min-h-screen bg-[#f1f3f5] font-sans text-slate-900 text-left">
      <nav className="bg-white/80 border-b border-slate-200 sticky top-0 z-50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black italic text-slate-800 uppercase">TRACE<span className="text-[#0062ff]">PASS</span></h1>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="text-[10px] font-black uppercase border px-4 py-2 rounded-xl">Esci</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {showUpgradeButton ? (
            <div className="md:col-span-1 bg-yellow-400 p-8 rounded-[2.5rem] text-black shadow-xl flex flex-col justify-between min-h-[180px]">
              <span className="text-3xl">🚀</span>
              <button onClick={() => window.location.href='/#pricing'} className="w-full py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase">Passa a Business</button>
            </div>
          ) : (
            <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="md:col-span-1 bg-[#0062ff] p-8 rounded-[2.5rem] text-white shadow-xl min-h-[180px] flex flex-col justify-between">
              <span className="text-3xl">+</span>
              <span className="text-sm font-black uppercase">Crea Nuovo</span>
            </button>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 text-[10px] font-black uppercase">Slot Occupati</span>
            <span className={`text-5xl font-black italic ${products.length >= currentLimit ? 'text-red-500' : 'text-slate-900'}`}>{products.length}/{currentLimit}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col justify-between min-h-[400px]">
              <div>
                <h3 className="text-2xl font-black uppercase italic mb-4">{p.name}</h3>
                <div className="space-y-2 text-[10px] font-bold uppercase text-slate-400">
                  <div className="flex justify-between border-b pb-1"><span>Origine</span><span className="text-slate-800">{p.origin}</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Carbon</span><span className="text-blue-500">{p.carbon_footprint}</span></div>
                </div>
              </div>
              <div className="grid gap-3 mt-6">
                <a href={`/product/${p.id}`} target="_blank" className="bg-[#0062ff] text-white text-center py-4 rounded-2xl text-[9px] font-black uppercase">Vedi Passport</a>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setEditingId(p.id); setNewProduct({...p, repair_score: p.repair_score.toString()}); setIsModalOpen(true); }} className="bg-slate-50 text-slate-400 py-4 rounded-2xl text-[9px] font-black uppercase">Modifica</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-50 text-red-400 py-4 rounded-2xl text-[9px] font-black uppercase">Elimina</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#f8f9fa] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl my-auto">
            <h3 className="text-2xl font-black uppercase italic text-center mb-8">Gestione Passport</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Nome Modello</label>
                <input required className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Origine</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.origin} onChange={(e) => setNewProduct({...newProduct, origin: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Carbon Footprint</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.carbon_footprint} onChange={(e) => setNewProduct({...newProduct, carbon_footprint: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Materiali Principali</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.material_composition} onChange={(e) => setNewProduct({...newProduct, material_composition: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Istruzioni Riciclo</label>
                <textarea className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold min-h-[80px]" value={newProduct.recycling_instructions} onChange={(e) => setNewProduct({...newProduct, recycling_instructions: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Sostanze (REACH)</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.substances_reach} onChange={(e) => setNewProduct({...newProduct, substances_reach: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Repair Score</label>
                <select className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.repair_score} onChange={(e) => setNewProduct({...newProduct, repair_score: e.target.value})}>
                  <option value="5">5/5</option><option value="4">4/5</option><option value="3">3/5</option><option value="2">2/5</option><option value="1">1/5</option>
                </select>
              </div>
              <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100">
                <span className="text-[9px] font-black uppercase text-[#0062ff] block mb-4">Allegati Digitali</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Scheda Tecnica (PDF)</label>
                    <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'tech_doc_url')} className="text-[9px] italic" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Link Video Tutorial</label>
                    <input placeholder="https://..." className="w-full p-3 rounded-xl bg-slate-50 border-none text-[10px] font-bold" value={newProduct.video_url} onChange={(e) => setNewProduct({...newProduct, video_url: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 bg-[#0062ff] text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest">Salva Prodotto</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-white text-slate-400 border border-slate-100 rounded-[2rem] text-[11px] font-black uppercase">Annulla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}