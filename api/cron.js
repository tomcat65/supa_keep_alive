import { checkAllProjects } from '../lib/monitoring.js'

export default async function handler(req, res) {
  // Verify the request is from Vercel Cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const results = await checkAllProjects()
    return res.status(200).json(results)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
