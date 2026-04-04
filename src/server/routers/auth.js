import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import crypto from 'crypto'

// Generate a random code in XXXX-YYYY format (cryptographically secure)
function generateUserCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude ambiguous chars
  const bytes = crypto.randomBytes(8)
  let code = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-'
    code += chars[bytes[i] % chars.length]
  }
  return code
}

// Generate a secure device code
function generateDeviceCode() {
  return crypto.randomBytes(32).toString('hex')
}

export const authRouter = router({
  // CLI calls this to start the device flow
  requestDeviceCode: publicProcedure
    .input(
      z.object({
        clientId: z.string().max(100).regex(/^[a-zA-Z0-9_-]*$/).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deviceCode = generateDeviceCode()
      const userCode = generateUserCode()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      // Store in database
      const { error } = await ctx.supabase.from('device_codes').insert({
        device_code: deviceCode,
        user_code: userCode,
        expires_at: expiresAt.toISOString(),
        authorized: false,
        client_id: input.clientId || 'cli',
      })

      if (error) {
        console.error('Failed to create device code:', error.message)
        throw new Error('Failed to create device code')
      }

      return {
        deviceCode,
        userCode,
        expiresIn: 900, // 15 minutes in seconds
        interval: 5, // Poll every 5 seconds
        verificationUri: `${process.env.NEXT_PUBLIC_APP_URL || 'https://glock.dev'}/auth/device`,
        verificationUriComplete: `${process.env.NEXT_PUBLIC_APP_URL || 'https://glock.dev'}/auth/device?code=${userCode}`,
      }
    }),

  // CLI polls this to check if user has authorized
  pollDeviceAuth: publicProcedure
    .input(
      z.object({
        deviceCode: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Look up device code
      const { data: deviceData, error } = await ctx.supabase
        .from('device_codes')
        .select('*')
        .eq('device_code', input.deviceCode)
        .single()

      if (error || !deviceData) {
        return { status: 'invalid', error: 'Invalid device code' }
      }

      // Check expiration
      if (new Date(deviceData.expires_at) < new Date()) {
        return { status: 'expired', error: 'Device code has expired' }
      }

      // Check if authorized
      if (!deviceData.authorized || !deviceData.user_id) {
        return { status: 'pending' }
      }

      // Get user info from Supabase Auth
      const { data: { user: authUser }, error: userError } = await ctx.supabase.auth.admin.getUserById(
        deviceData.user_id
      )

      if (userError || !authUser) {
        return { status: 'error', error: 'Failed to get user data' }
      }

      // Generate a CLI token
      const cliToken = crypto.randomBytes(32).toString('hex')

      // Store CLI token associated with user (insert new token each time)
      const { error: tokenError } = await ctx.supabase.from('cli_tokens').insert({
        user_id: authUser.id,
        token: cliToken,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })

      if (tokenError) {
        return { status: 'error', error: 'Failed to create CLI token' }
      }

      // Clean up device code
      await ctx.supabase
        .from('device_codes')
        .delete()
        .eq('device_code', input.deviceCode)

      return {
        status: 'authorized',
        accessToken: cliToken,
        user: {
          id: authUser.id,
          email: authUser.email,
        },
      }
    }),

  // Browser calls this after user logs in to authorize the device
  authorizeDevice: protectedProcedure
    .input(
      z.object({
        userCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Normalize user code (remove dashes, uppercase)
      const normalizedCode = input.userCode.replace(/-/g, '').toUpperCase()
      const formattedCode = `${normalizedCode.slice(0, 4)}-${normalizedCode.slice(4)}`

      // Find the device code entry
      const { data: deviceData, error: findError } = await ctx.supabase
        .from('device_codes')
        .select('*')
        .eq('user_code', formattedCode)
        .single()

      if (findError || !deviceData) {
        throw new Error('Invalid or expired code')
      }

      // Check expiration
      if (new Date(deviceData.expires_at) < new Date()) {
        throw new Error('Code has expired')
      }

      // Check if already authorized
      if (deviceData.authorized) {
        throw new Error('Code already used')
      }

      // Authorize the device
      const { error: updateError } = await ctx.supabase
        .from('device_codes')
        .update({
          authorized: true,
          user_id: ctx.user.id,
        })
        .eq('id', deviceData.id)

      if (updateError) {
        throw new Error('Failed to authorize device')
      }

      return { success: true }
    }),

  // Validate a CLI token
  validate: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('cli_tokens')
        .select('user_id, expires_at')
        .eq('token', input.token)
        .single()

      if (error || !data) {
        return { valid: false }
      }

      // Check expiration
      if (new Date(data.expires_at) < new Date()) {
        return { valid: false, expired: true }
      }

      // Get user info from Supabase Auth
      const { data: { user: authUser } } = await ctx.supabase.auth.admin.getUserById(data.user_id)

      return {
        valid: true,
        user: authUser ? { id: authUser.id, email: authUser.email } : null,
      }
    }),

  // Revoke a CLI token (logout)
  revoke: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from('cli_tokens')
        .delete()
        .eq('token', input.token)

      return { success: !error }
    }),
})
