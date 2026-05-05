import { FastifyRequest, FastifyReply } from 'fastify'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function checkUsageLimit(
  userId: string,
  reply: FastifyReply
): Promise<boolean> {
  const period = new Date().toISOString().slice(0, 7) // YYYY-MM

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/increment_usage`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_user_id: userId,
        p_period: period,
      }),
    }
  )

  if (!res.ok) {
    console.error('Usage check failed:', await res.text())
    return true // fail open — don't block if usage check fails
  }

  const data = await res.json()

  if (!data.allowed) {
    reply.status(429).send({
      error: 'Usage Limit Exceeded',
      message: `You have reached your monthly limit of ${data.limit.toLocaleString()} executions on the ${data.plan} plan.`,
      current_usage: data.count,
      limit: data.limit,
      plan: data.plan,
      upgrade_url: 'https://reliant-eight.vercel.app/dashboard/upgrade',
    })
    return false
  }

  return true
}
