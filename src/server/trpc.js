import { initTRPC } from '@trpc/server'
import { createServerClient } from '../lib/supabase'

// Create context for each request
export const createContext = async ({ req, res }) => {
  const supabase = createServerClient()

  // Extract auth token from header if present
  const authHeader = req.headers.authorization
  let user = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data } = await supabase.auth.getUser(token)
    user = data?.user ?? null
  }

  return {
    req,
    res,
    supabase,
    user,
  }
}

// Initialize tRPC
const t = initTRPC.context().create()

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('UNAUTHORIZED')
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})
