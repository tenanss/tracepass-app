'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

// 1. DEFINIZIONE LIMITI PIANI
const PLAN_LIMITS = {
  starter: 3,
  business: 20,
  enterprise: 9999
};

export default function DashboardPage() {
  const router = useRouter()
  
  // STATI PER LA GESTIONE QUOTA
  const [planType, setPlanType] = useState<string>('starter')
  const [canAddProduct, setCanAddProduct] = useState<boolean>(true)
  
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

  // --- FUNZIONE REFRESH POTENZIATA (Sincronizza prodotti e piano senza F5) ---
  const refreshData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // 1. Carica i prodotti dell'utente
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // 2. Carica il piano attuale (per gestire il passaggio a Business)
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('email', session.user.email)
      .maybeSingle()

    if (productsData) setProducts(productsData)
    
    if (sub) {
      setPlanType(sub.plan_type)
      const isDevAdmin = session.user.email === adminEmail
      const limit = PLAN_LIMITS[sub.plan_type as keyof typeof PLAN_LIMITS] || 3
      setCanAddProduct(isDevAdmin || (productsData ? productsData.length < limit : true))
    }
  }

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
      else alert("Errore Stripe: " + data.error);
    } catch (err) {
      console.error("Errore chiamata API checkout:", err);
      alert("Errore di connessione. Riprova.");
    }
  };

  // --- EFFETTO PER IL RITORNO DA STRIPE ---
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      const timer = setTimeout(() => {
        refreshData();
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000); // 2 secondi per dare tempo al webhook
      return () => clearTimeout(timer);
    }
  }, []);

  // --- EFFETTO PRINCIPALE + REALTIME ---
  useEffect(() => {
    let subscriptionChannel: any;

    const checkAuthAndSub = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      let { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('status, plan_type')
        .eq('email', session.user.email)
        .maybeSingle()

      const isDevAdmin = session.user.email === adminEmail

      // Automatismo per nuovi utenti se il trigger non è scattato
      if (!sub && !subError && !isDevAdmin) {
        const { data: newSub, error: insertError } = await supabase
          .from('subscriptions')
          .insert([{
            email: session.user.email,
            plan_type: 'starter',
            status: 'active'
          }])
          .select()
          .single()

        if (!insertError) sub = newSub
      }

      if (!isDevAdmin && sub && sub.status !== 'active') {
        router.push('/#pricing')
        return
      }

      // Sincronizziamo i dati iniziali
      await refreshData()
      setLoading(false)

      // ATTIVAZIONE REALTIME: ascolta cambi sulla tabella subscriptions per l'utente corrente
      subscriptionChannel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'subscriptions',
            filter: `email=eq.${session.user.email}`
          },
          () => {
            refreshData();
          }
        )
        .subscribe()
    }

    checkAuthAndSub()

    return () => {
      if (subscriptionChannel) supabase.removeChannel(subscriptionChannel)
    }
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

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('products').update(productData).eq('id', editingId)
      error = err
    } else {
      const { error: err } = await supabase.from('products').insert([productData])
      error = err
    }

    if (error) {
      alert("Errore salvataggio: " + error.message)
    } else {
      setIsModalOpen(false)
      setEditingId(null)
      setNewProduct({ 
        name: '', repair_score: '5', origin: '', material_composition: '', 
        carbon_footprint: '', substances_reach: '', recycling_instructions: '',
        tech_doc_url: '', video_url: '' 
      })
      await refreshData() 
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) alert("Errore eliminazione: " + error.message)
      else await refreshData() 
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'tech_doc_url' | 'video_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error } = await supabase.storage
      .from('product-assets')
      .upload(filePath, file)

    if (error) {
      alert("Errore upload: " + error.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-assets')
      .getPublicUrl(filePath)

    setNewProduct({ ...newProduct, [field]: publicUrl })
    alert("File caricato correttamente!")
  }

  const handleEditClick = (product: any) => {
    setEditingId(product.id)
    setNewProduct({
      name: product.name || '',
      repair_score: product.repair_score ? product.repair_score.toString() : '5',
      origin: product.origin || '',
      material_composition: product.material_composition || '',
      carbon_footprint: product.carbon_footprint || '',
      substances_reach: product.substances_reach || '',
      recycling_instructions: product.recycling_instructions || '',
      tech_doc_url: product.tech_doc_url || '',
      video_url: product.video_url || ''
    })
    setIsModalOpen(true)
  }

  const showRedAlert = products.length >= (PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] || 3);

  if (loading) return <div className="min-h-screen bg-[#f1f3f5] flex items-center justify-center font-black uppercase text-slate-400 text-[10px] tracking-widest animate-pulse text-center">TracePass Loading...</div>

  // --- MODALITÀ STAMPA ---
  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-10">
        <div className="print:hidden mb-8 flex justify-between items-center bg-slate-900 p-6 rounded-2xl text-white">
          <div>
            <h2 className="font-black uppercase italic">Modalità Stampa Etichette</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Verranno generate {products.length} etichette</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="bg-[#0062ff] px-6 py-2 rounded-xl text-[10px] font-black uppercase">Conferma Stampa</button>
            <button onClick={() => setIsPrintMode(false)} className="bg-white/10 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Esci</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border border-slate-200 p-6 flex flex-col items-center text-center rounded-xl bg-white shadow-sm page-break-inside-avoid">
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">TracePass Certified</span>
              <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/${p.id}`} size={100} level="H" />
              <h3 className="mt-4 font-black uppercase italic text-sm tracking-tighter">{p.name}</h3>
              <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase">ID: {p.id.slice(0,13)}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f3f5] font-sans text-slate-900 text-left">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase">
            TRACE<span className="text-[#0062ff]">PASS</span>
          </h1>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
            Disconnetti Sistema
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Benvenuto nell'Area Aziendale.</h2>
          <p className="text-slate-500 font-medium italic text-sm uppercase">Digital Product Passport System — Piano: {planType}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {canAddProduct ? (
            <button 
              onClick={() => { setEditingId(null); setNewProduct({name:'', repair_score:'5', origin:'', material_composition:'', carbon_footprint:'', substances_reach:'', recycling_instructions:'', tech_doc_url: '', video_url: ''}); setIsModalOpen(true); }} 
              className="md:col-span-1 bg-[#0062ff] p-8 rounded-[2.5rem] text-white shadow-xl hover:bg-blue-700 transition-all flex flex-col justify-between min-h-[180px] group text-left"
            >
              <span className="text-3xl group-hover:rotate-90 transition-transform w-fit">+</span>
              <span className="text-sm font-black uppercase tracking-widest leading-tight">Crea Nuovo<br/>Prodotto</span>
            </button>
          ) : (
            <div className="md:col-span-1 bg-amber-100 p-8 rounded-[2.5rem] text-amber-800 shadow-sm flex flex-col justify-between min-h-[180px] text-left border border-amber-200">
              <span className="text-3xl">⚠️</span>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest block mb-1">Limite Raggiunto</span>
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleUpgrade('monthly')} className="text-[10px] font-black underline uppercase text-amber-900 text-left hover:text-black transition-colors">Business Mensile</button>
                  <button onClick={() => handleUpgrade('yearly')} className="text-[10px] font-black underline uppercase text-amber-900 text-left hover:text-black transition-colors">Business Annuale</button>
                </div>
              </div>
            </div>
          )}
          
          <button onClick={() => setIsPrintMode(true)} className="md:col-span-1 bg-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl hover:bg-black transition-all flex flex-col justify-between min-h-[180px] text-left">
            <span className="text-3xl">⎙</span>
            <span className="text-sm font-black uppercase tracking-widest leading-tight">Stampa Etichette<br/>In Serie</span>
          </button>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Slot Occupati</span>
            <span className={`text-5xl font-black italic leading-none transition-colors duration-300 ${showRedAlert ? 'text-red-500' : 'text-slate-900'}`}>
              {products.length}/{PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] || 3}
            </span>
          </div>
        </div>

        {/* LISTA PRODOTTI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="flex justify-between items-start mb-6 text-left">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">{p.name}</h3>
                  <span className="bg-slate-100 text-slate-400 text-[9px] px-3 py-1 rounded-full font-bold uppercase italic leading-none">
                    DP-{p.id.slice(0,5)}
                  </span>
                </div>
                <div className="space-y-3 mb-6 text-[10px] font-bold uppercase text-slate-400 text-left">
                  <div className="flex justify-between border-b pb-1"><span>Origine</span><span className="text-slate-800">{p.origin}</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Materiali</span><span className="text-slate-800 italic">{p.material_composition}</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Carbon</span><span className="text-blue-500">{p.carbon_footprint}</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Repair Score</span><span className="text-green-500 italic">{p.repair_score}/5</span></div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <a href={`/product/${p.id}`} target="_blank" className="bg-[#0062ff] text-white text-center py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all w-full">Vedi Passport</a>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleEditClick(p)} className="bg-slate-50 text-slate-400 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-100 font-bold">Modifica</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-50 text-red-400 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100 font-bold">Elimina</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODALE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#f8f9fa] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl my-auto animate-in fade-in zoom-in duration-300 text-left">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800 mb-8 text-center leading-none">
                {editingId ? 'Modifica Passport' : 'Nuovo Digital Passport'}
            </h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Nome Modello</label>
                <input required className="w-full p-5 rounded-2xl bg-[#eef2ff] border-none text-sm font-bold italic" value={newProduct.name || ''} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Origine</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-100 text-sm font-bold italic" value={newProduct.origin || ''} onChange={(e) => setNewProduct({...newProduct, origin: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Carbon Footprint</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-100 text-sm font-bold italic" value={newProduct.carbon_footprint || ''} onChange={(e) => setNewProduct({...newProduct, carbon_footprint: e.target.value})} />
              </div>
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="md:col-span-2 mb-2">
                    <span className="text-[9px] font-black uppercase text-[#0062ff] tracking-widest">Asset Digitali DPP 2026</span>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Carica Manuale PDF</label>
                    <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'tech_doc_url')} className="w-full text-[10px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#eef2ff] file:text-[#0062ff] hover:file:bg-blue-100 cursor-pointer italic" />
                    {newProduct.tech_doc_url && <p className="text-[7px] text-green-500 mt-2 italic truncate">{newProduct.tech_doc_url}</p>}
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">URL Video Tutorial</label>
                    <input placeholder="https://youtube.com/..." className="w-full p-4 rounded-xl bg-[#f1f3f5] border-none text-[12px] font-bold italic" value={newProduct.video_url || ''} onChange={(e) => setNewProduct({...newProduct, video_url: e.target.value})} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Materiali Principali</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-100 text-sm font-bold italic" value={newProduct.material_composition || ''} onChange={(e) => setNewProduct({...newProduct, material_composition: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-[#0062ff] ml-4 mb-2 block tracking-widest">Riciclo & Circolarità</label>
                <textarea className="w-full p-5 rounded-2xl bg-white border border-slate-100 text-sm font-bold italic min-h-[100px]" value={newProduct.recycling_instructions || ''} onChange={(e) => setNewProduct({...newProduct, recycling_instructions: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Sostanze (REACH)</label>
                <input className="w-full p-5 rounded-2xl bg-white border border-slate-100 text-sm font-bold italic" value={newProduct.substances_reach || ''} onChange={(e) => setNewProduct({...newProduct, substances_reach: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Repair Score</label>
                <select className="w-full p-5 rounded-2xl bg-white border border-slate-100 text-sm font-bold italic shadow-inner" value={newProduct.repair_score} onChange={(e) => setNewProduct({...newProduct, repair_score: e.target.value})}>
                  <option value="5">5/5</option><option value="4">4/5</option><option value="3">3/5</option><option value="2">2/5</option><option value="1">1/5</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 bg-[#0062ff] text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl transition-all">
                    {editingId ? 'Salva Modifiche' : 'Genera e Salva'}
                </button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="px-8 bg-white text-slate-400 border border-slate-100 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em]">Annulla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}