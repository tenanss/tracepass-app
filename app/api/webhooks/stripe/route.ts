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
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const subscriptionId = session.subscription as string;

    if (customerEmail) {
      // Cerchiamo l'ID utente dalla tabella auth
      const { data: authUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (authUser) {
        // Inseriamo i dati nella tabella subscriptions (mappando i tuoi nomi colonne)
        const { error } = await supabase
          .from('subscriptions')
          .upsert({ 
            user_id: authUser.id,
            stripe_subscription_id: subscriptionId,
            status: 'active',
            plan_type: 'business', // Il nome della tua colonna nella foto 17
            current_period_end: new Date().toISOString(), // Qui andrebbe la data reale di Stripe
            stripe_customer_id: session.customer as string
          });

        if (error) console.error("❌ Errore DB:", error.message);
        else console.log(`✅ Abbonamento registrato per ${customerEmail}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}