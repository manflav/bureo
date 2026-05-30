import { Category } from '../models/Category.js'

export const getAll = async (req, res) => {
  try {
    const results = await Category.findAll()
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
}