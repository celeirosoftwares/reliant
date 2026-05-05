import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PLAN_BY_PRICE: Record<string, string> = {
  [process.env.STRIPE_PRICE_STARTER!]: 'starter',
  [process.env.STRIPE_PRICE_PRO!]: 'pro',
  [process.env.STRIPE_PRICE_SCALE!]: 'scale',
}

// Supabase admin client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Stripe webhook:', event.type)

  switch (event.type) {

    // Payment successful — upgrade plan
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (userId && plan) {
        await supabase
          .from('profiles')
          .update({
            plan,
            stripe_subscription_id: session.subscription,
          })
          .eq('id', userId)

        console.log(`✅ Upgraded user ${userId} to ${plan}`)
      }
      break
    }

    // Subscription renewed — keep plan active
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any
      const subscriptionId = invoice.subscription

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.user_id
        const priceId = subscription.items.data[0]?.price.id
        const plan = PLAN_BY_PRICE[priceId]

        if (userId && plan) {
          await supabase
            .from('profiles')
            .update({ plan })
            .eq('id', userId)

          console.log(`✅ Renewed plan ${plan} for user ${userId}`)
        }
      }
      break
    }

    // Payment failed — downgrade to free
    case 'invoice.payment_failed': {
      const invoice = event.data.object as any
      const subscriptionId = invoice.subscription

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.user_id

        if (userId) {
          await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', userId)

          console.log(`⚠️ Payment failed — downgraded user ${userId} to free`)
        }
      }
      break
    }

    // Subscription canceled — downgrade to free
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      const userId = subscription.metadata?.user_id

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', userId)

        console.log(`❌ Subscription canceled — downgraded user ${userId} to free`)
      }
      break
    }

    // Subscription paused/unpaid
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any
      const userId = subscription.metadata?.user_id

      if (userId && subscription.status === 'past_due') {
        await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('id', userId)

        console.log(`⚠️ Subscription past_due — downgraded user ${userId} to free`)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
