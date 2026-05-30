import { Region } from '../models/Region.js'

export const getAll = async (req, res) => {
  try {
    const results = await Region.findAll()
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener provincias' })
  }
}