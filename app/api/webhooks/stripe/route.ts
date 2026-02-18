import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

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
    return NextResponse.json({ error: 'Firma fallita' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Stripe ci restituisce l'ID utente se lo abbiamo passato come client_reference_id
    // Altrimenti usiamo l'email per identificare la riga (se la colonna email esiste in subscriptions)
    const customerEmail = session.customer_details?.email;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    console.log(`Tentativo di inserimento per: ${customerEmail}`);

    const { error } = await supabase
      .from('subscriptions')
      .upsert({ 
        // Se la tua tabella usa l'email come chiave o se hai l'user_id
        // Qui usiamo i nomi delle colonne che abbiamo visto nel tuo SQL Editor
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: 'active',
        plan_type: 'business', 
        current_period_end: new Date().toISOString(), // In produzione usa il timestamp di Stripe
        // Nota: Assicurati che la colonna per l'identificazione utente sia corretta
      }, { onConflict: 'stripe_subscription_id' }); 

    if (error) {
      console.error("❌ Errore inserimento Subscriptions:", error.message);
    } else {
      console.log("✅ Riga inserita con successo in Subscriptions!");
    }
  }

  return NextResponse.json({ received: true });
}