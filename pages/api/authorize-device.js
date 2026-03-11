import { createServerClient } from '../../src/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerClient()

  // Check auth
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { userCode } = req.body

  if (!userCode || typeof userCode !== 'string') {
    return res.status(400).json({ error: 'userCode is required' })
  }

  // Normalize user code (remove dashes, uppercase)
  const normalizedCode = userCode.replace(/-/g, '').toUpperCase()
  const formattedCode = `${normalizedCode.slice(0, 4)}-${normalizedCode.slice(4)}`

  // Find the device code entry
  const { data: deviceData, error: findError } = await supabase
    .from('device_codes')
    .select('*')
    .eq('user_code', formattedCode)
    .single()

  if (findError || !deviceData) {
    return res.status(400).json({ error: 'Invalid or expired code' })
  }

  // Check expiration
  if (new Date(deviceData.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Code has expired' })
  }

  // Check if already authorized
  if (deviceData.authorized) {
    return res.status(400).json({ error: 'Code already used' })
  }

  // Authorize the device
  const { error: updateError } = await supabase
    .from('device_codes')
    .update({
      authorized: true,
      user_id: user.id,
    })
    .eq('id', deviceData.id)

  if (updateError) {
    return res.status(500).json({ error: 'Failed to authorize device' })
  }

  return res.status(200).json({ success: true })
}
