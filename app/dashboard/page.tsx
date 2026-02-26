'use client'

import { useEffect, useState, useCallback } from 'react'
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
    name: '', repair_score: '5', origin: '', material_composition: '',
    carbon_footprint: '', substances_reach: '', recycling_instructions: '',
    tech_doc_url: '', video_url: ''     
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const adminEmail = 'tenanssimone@outlook.com';

  // Usiamo useCallback per poterla chiamare ovunque con sicurezza
  const refreshData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Forza il download dei prodotti
    const { data: productsData } = await supabase
      .from('products').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })

    // Forza il download della sottoscrizione SENZA cache
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('email', session.user.email)
      .maybeSingle()

    if (productsData) setProducts(productsData)
    if (sub) {
      console.log("Piano rilevato dal DB:", sub.plan_type); // Debug per noi
      setPlanType(sub.plan_type);
    }
  }, [supabase])

  const handleUpgrade = async (period: 'monthly' | 'yearly') => {
    const priceIds = {
      monthly: 'price_1T28vyE7LrcUGUCEt5fI9g2t',
      yearly: 'price_1T28vyE7LrcUGUCEo593b8v5'
    };
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceIds[period] }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { alert("Errore connessione Stripe"); }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return; }
      setUserEmail(session.user.email ?? null)
      
      // Controllo se torniamo da un successo di Stripe
      const params = new URLSearchParams(window.location.search)
      if (params.get('success')) {
        await refreshData()
        router.replace('/dashboard') // Pulisce l'URL
      } else {
        await refreshData()
      }
      setLoading(false)
    }
    checkAuth()
  }, [router, refreshData])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const productData = { 
      ...newProduct,
      repair_score: parseInt(newProduct.repair_score),
      user_id: session.user.id 
    }

    if (editingId) await supabase.from('products').update(productData).eq('id', editingId)
    else await supabase.from('products').insert([productData])
    
    setIsModalOpen(false)
    setEditingId(null)
    setNewProduct({ name: '', repair_score: '5', origin: '', material_composition: '', carbon_footprint: '', substances_reach: '', recycling_instructions: '', tech_doc_url: '', video_url: '' })
    await refreshData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Eliminare prodotto?")) {
      await supabase.from('products').delete().eq('id', id)
      await refreshData()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'tech_doc_url' | 'video_url') => {
    const file = e.target.files?.[0]
    if (!file) return
    const filePath = `${Math.random()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('product-assets').upload(filePath, file)
    if (error) return alert(error.message)
    const { data: { publicUrl } } = supabase.storage.from('product-assets').getPublicUrl(filePath)
    setNewProduct({ ...newProduct, [field]: publicUrl })
    alert("File caricato!")
  }

  const currentLimit = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] || 3;
  const isLimitReached = products.length >= currentLimit && userEmail !== adminEmail;

  if (loading) return <div className="min-h-screen bg-[#f1f3f5] flex items-center justify-center font-black uppercase text-slate-400 text-[10px]">TracePass Loading...</div>

  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-10">
        <div className="print:hidden mb-8 flex justify-between items-center bg-slate-900 p-6 rounded-2xl text-white">
          <h2 className="font-black uppercase italic">Modalità Stampa ({products.length})</h2>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="bg-[#0062ff] px-6 py-2 rounded-xl text-[10px] font-black uppercase">Stampa</button>
            <button onClick={() => setIsPrintMode(false)} className="bg-white/10 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Esci</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border p-6 flex flex-col items-center rounded-xl bg-white page-break-inside-avoid text-center">
              <QRCodeSVG value={`${window.location.origin}/product/${p.id}`} size={100} level="H" />
              <h3 className="mt-4 font-black uppercase italic text-[10px]">{p.name}</h3>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f3f5] font-sans text-slate-900 text-left">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black italic text-slate-800 uppercase">TRACE<span className="text-[#0062ff]">PASS</span></h1>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="text-[10px] font-black uppercase border px-4 py-2 rounded-xl">Esci</button>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-12">
          <h2 className="text-4xl font-black tracking-tight mb-2 text-slate-900 italic">Area Aziendale.</h2>
          <p className="text-slate-500 font-bold text-sm uppercase">Piano Attivo: {planType}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {isLimitReached ? (
            <div className="md:col-span-1 bg-yellow-400 p-8 rounded-[2.5rem] text-black shadow-xl flex flex-col justify-between min-h-[180px] border border-yellow-600">
              <span className="text-3xl">🚀</span>
              <div>
                <span className="text-[10px] font-black uppercase block mb-2 opacity-60 italic">Limite raggiunto</span>
                <button onClick={() => handleUpgrade('monthly')} className="w-full py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase">Sblocca Piano Business</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="md:col-span-1 bg-[#0062ff] p-8 rounded-[2.5rem] text-white shadow-xl min-h-[180px] flex flex-col justify-between group">
              <span className="text-3xl group-hover:rotate-90 transition-transform w-fit">+</span>
              <span className="text-sm font-black uppercase tracking-widest leading-tight">Crea Nuovo<br/>Passport</span>
            </button>
          )}

          <button onClick={() => setIsPrintMode(true)} className="md:col-span-1 bg-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl min-h-[180px] flex flex-col justify-between">
            <span className="text-3xl">⎙</span>
            <span className="text-sm font-black uppercase tracking-widest leading-tight text-left">Stampa<br/>Etichette QR</span>
          </button>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Slot Occupati</span>
            <span className={`text-5xl font-black italic ${products.length >= currentLimit ? 'text-red-500' : 'text-slate-900'}`}>{products.length}/{currentLimit}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-[3.5rem] border border-slate-100 p-9 flex flex-col justify-between min-h-[440px] shadow-sm">
              <div>
                <h3 className="text-2xl font-black uppercase italic mb-6 tracking-tighter text-slate-800">{p.name}</h3>
                <div className="space-y-3 text-[10px] font-bold uppercase text-slate-400">
                  <div className="flex justify-between border-b pb-1"><span>Origine</span><span className="text-slate-800">{p.origin}</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Carbon</span><span className="text-blue-500">{p.carbon_footprint}</span></div>
                </div>
              </div>
              <div className="grid gap-3 mt-8">
                <a href={`/product/${p.id}`} target="_blank" className="bg-[#0062ff] text-white text-center py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest">Vedi Passport</a>
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
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Nome Modello</label>
                <input required className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Origine</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.origin} onChange={(e) => setNewProduct({...newProduct, origin: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Carbon Footprint</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.carbon_footprint} onChange={(e) => setNewProduct({...newProduct, carbon_footprint: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Materiali Principali</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.material_composition} onChange={(e) => setNewProduct({...newProduct, material_composition: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Istruzioni Riciclo</label>
                <textarea className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold min-h-[80px]" value={newProduct.recycling_instructions} onChange={(e) => setNewProduct({...newProduct, recycling_instructions: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Sostanze (REACH)</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.substances_reach} onChange={(e) => setNewProduct({...newProduct, substances_reach: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-4">Repair Score</label>
                <select className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold" value={newProduct.repair_score} onChange={(e) => setNewProduct({...newProduct, repair_score: e.target.value})}>
                  <option value="5">5/5</option><option value="4">4/5</option><option value="3">3/5</option><option value="2">2/5</option><option value="1">1/5</option>
                </select>
              </div>
              <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100">
                <span className="text-[9px] font-black uppercase text-[#0062ff] block mb-4 italic tracking-widest">Allegati Digitali DPP 2026</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 ml-2">Scheda Tecnica (PDF)</label>
                    <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'tech_doc_url')} className="text-[9px] font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 ml-2">Video Tutorial</label>
                    <input placeholder="https://..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold" value={newProduct.video_url} onChange={(e) => setNewProduct({...newProduct, video_url: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 bg-[#0062ff] text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">Salva Passport</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-white text-slate-400 border border-slate-100 rounded-[2rem] text-[11px] font-black uppercase">Annulla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}