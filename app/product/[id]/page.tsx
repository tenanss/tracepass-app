import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function PublicProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productId = params.id;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <p className="text-slate-400 font-medium">Passaporto TracePass non trovato.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center p-6 font-sans text-slate-900">
      
      {/* HEADER NERO - Allineato alla Home (Senza corsivo, Senza linea blu) */}
      <div className="w-full max-w-md bg-[#111827] rounded-t-[2.5rem] pt-12 pb-14 px-10 text-center text-white shadow-xl relative">
        <div className="absolute top-8 left-0 w-full flex justify-center">
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold">TracePass • Verified</p>
        </div>
        <h1 className="text-3xl font-bold tracking-tight uppercase mt-4">
          {product.name}
        </h1>
      </div>

      {/* CARD BIANCA - Design "Airy" come la Home */}
      <div className="w-full max-w-md bg-white rounded-b-[2.5rem] shadow-2xl p-8 -mt-8 relative z-10 border-x border-b border-slate-100">
        
        {/* STATUS & STANDARD BOXES */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-[#f9fafb] rounded-2xl p-5 text-center border border-slate-50">
             <p className="text-[9px] uppercase text-slate-400 font-black tracking-widest mb-1">Status</p>
             <p className="text-[13px] font-bold text-green-600 flex items-center justify-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Compliant
             </p>
          </div>
          <div className="bg-[#f9fafb] rounded-2xl p-5 text-center border border-slate-50">
             <p className="text-[9px] uppercase text-slate-400 font-black tracking-widest mb-1">Standard</p>
             <p className="text-[13px] font-bold text-slate-600 uppercase">DPP 2026</p>
          </div>
        </div>

        {/* BOX DATI - IDENTICI ALLA HOME (🌿 MATERIALI & 💨 CARBON) */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* Box Materiali */}
          <div className="bg-[#f2fdf5] border border-[#e2f7e9] p-6 rounded-[2rem] text-center">
            <div className="text-xl mb-2">🌿</div>
            <p className="text-[9px] font-black text-green-700 uppercase tracking-widest mb-1">Materiali</p>
            <p className="text-[15px] font-bold text-slate-800 italic">
              {product.material_composition}
            </p>
          </div>

          {/* Box Carbon */}
          <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-6 rounded-[2rem] text-center">
            <div className="text-xl mb-2">💨</div>
            <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-1">Carbon</p>
            <p className="text-[15px] font-bold text-slate-800 italic">
              {product.carbon_footprint}
            </p>
          </div>
        </div>
{/* SEZIONE ORIGINE E SOSTANZE RIFINITA */}
<div className="mb-8 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex justify-around items-center text-center">
    <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Origine</p>
        <p className="text-[13px] font-bold text-slate-700 flex flex-col items-center">
           <span className="text-base mb-0.5">📍</span>
           {product.origin === 'EMPTY' || !product.origin ? 'Italy (UE)' : product.origin}
        </p>
    </div>
    <div className="w-px h-10 bg-slate-200"></div>
    <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sostanze</p>
        <p className="text-[13px] font-bold text-green-600 flex flex-col items-center">
           <span className="text-base mb-0.5">🛡️</span>
           REACH OK
        </p>
    </div>
</div>

        {/* REPAIR SCORE */}
        <div className="mb-10 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-[0.3em]">Repair Score</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => {
              const score = product.repair_score || 0;
              const isActive = step <= score;
              return (
                <div 
                  key={step}
                  className={`h-1.5 w-10 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-green-500 shadow-sm' : 'bg-slate-100'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* TASTO DOCUMENTAZIONE TECNICA (OBBLIGATORIO) */}
        {product.technical_sheet_url && (
          <a 
            href={product.technical_sheet_url} 
            target="_blank"
            className="w-full mb-6 py-4 bg-[#111827] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
          >
            <span>📄</span> Scarica Scheda Tecnica (PDF)
          </a>
        )}

        {/* RECYCLING & CIRCULARITY */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 text-center mb-8">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Riciclo & Circolarità</p>
            <p className="text-[13px] text-slate-500 font-medium italic">
              {product.recycling_instructions || "Informazioni standard per il riciclo dei tessuti."}
            </p>
        </div>

        {/* UID FOOTER */}
        <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-slate-300 uppercase tracking-tighter">
                UID: {product.id.substring(0, 15)}...
            </span>
        </div>
      </div>
      
      <p className="mt-10 text-slate-300 text-[9px] font-bold uppercase tracking-[0.5em]">
        TracePass Digital
      </p>
    </div>
  )
}