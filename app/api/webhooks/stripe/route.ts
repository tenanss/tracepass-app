import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Inizializziamo il client Supabase con la Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Errore firma Webhook: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Gestione evento: Pagamento Completato
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Recuperiamo l'email del cliente che ha pagato
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      console.log(`✅ Pagamento confermato per: ${customerEmail}`);

      // AGGIORNIAMO IL PIANO SU SUPABASE
      // Assicurati che la tua tabella si chiami 'profiles' e abbia una colonna 'plan'
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'business' })
        .eq('email', customerEmail);

      if (error) {
        console.error("❌ Errore aggiornamento Supabase:", error.message);
      } else {
        console.log(`🚀 Database aggiornato: ${customerEmail} è ora Business!`);
      }
    }
  }

  return NextResponse.json({ received: true });
}