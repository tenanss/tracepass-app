import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
success_url: `${req.headers.get('origin')}/success`,
cancel_url: `${req.headers.get('origin')}/#pricing`,
    });

    // Restituiamo l'URL creato da Stripe al frontend
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("ERRORE STRIPE SERVER:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}