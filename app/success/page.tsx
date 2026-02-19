import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      {/* Container con bordo più spesso (border-4) e ombra profonda (shadow-2xl) */}
      <div className="bg-white border-4 border-blue-600 p-8 sm:p-12 rounded-[2.5rem] max-w-lg w-full shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] transform transition-all">
        
        {/* Icona Verde */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 p-5 rounded-full shadow-inner">
            <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black mb-4 text-blue-900 tracking-tight">
          Pagamento Riuscito!
        </h1>
        
        <p className="text-slate-600 mb-10 text-base sm:text-lg leading-relaxed font-medium">
          Grazie per aver scelto <span className="text-blue-600 font-bold">TracePass Business</span>. 
          Il tuo account è stato aggiornato. Ora puoi iniziare a generare i tuoi passaporti digitali.
        </p>

        {/* Tasto Blu con ombra coordinata */}
        <div className="w-full">
          <Link 
            href="/dashboard"
            className="block w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-200 uppercase tracking-wider text-sm"
          >
            Vai alla Dashboard
          </Link>
        </div>
      </div>
      
      <p className="mt-10 text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">
        Controlla la tua email per la ricevuta
      </p>
    </div>
  );
}