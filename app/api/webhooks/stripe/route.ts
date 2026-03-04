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
  
  // FIX HEADERS: Usiamo await per le versioni recenti di Next.js
  const headerList = await headers();
  const signature = headerList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Errore firma Webhook: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // --- 1. PRIMO ACQUISTO (Upgrade a Business) ---
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      // Recuperiamo la scadenza reale dall'oggetto subscription di Stripe
      const subscriptionDetail = await stripe.subscriptions.retrieve(session.subscription as string) as any;
const expiryDate = new Date(subscriptionDetail.current_period_end * 1000).toISOString();

      const { error } = await supabase
        .from('subscriptions')
        .upsert({ 
          email: customerEmail,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          status: 'active',
          plan_type: 'business',
          subscription_expiry: expiryDate // ✅ Salviamo nella nuova colonna creata oggi
        }, { onConflict: 'email' });

      if (error) console.error("❌ Errore Supabase (Insert):", error.message);
    }
  }

  // --- 2. AGGIORNAMENTO (Rinnovi o Cambio piano) ---
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any;
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        subscription_expiry: periodEnd, // ✅ Aggiorniamo la scadenza al rinnovo
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) console.error("❌ Errore Supabase (Update):", error.message);
  }

  // --- 3. CANCELLAZIONE (Ritorno a Starter) ---
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;

    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        plan_type: 'starter', 
        status: 'canceled',
        subscription_expiry: null // Puliamo la data se l'abbonamento termina
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) console.error("❌ Errore Supabase (Delete):", error.message);
  }

  return NextResponse.json({ received: true });
}