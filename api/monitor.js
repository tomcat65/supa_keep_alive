import { checkAllProjects } from '../lib/monitoring.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const results = await checkAllProjects()
    return res.status(200).json(results)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
