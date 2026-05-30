import { Festival } from '../models/Festival.js'

export const getAll = async (req, res) => {
  try {
    const { fecha, provincia, categoria, q, lat, lng, km } = req.query

    if (lat && lng) {
      const results = await Festival.findNearby(parseFloat(lat), parseFloat(lng), parseFloat(km) || 50)
      return res.json(results)
    }

    const results = await Festival.findAll({ fecha, provincia, categoria, q })
    res.json(results)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al obtener fiestas' })
  }
}

export const getOne = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id)
    if (!festival) return res.status(404).json({ error: 'Fiesta no encontrada' })
    res.json(festival)
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener fiesta' })
  }
}

export const getDestacadas = async (req, res) => {
  try {
    const results = await Festival.findDestacadas()
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener destacadas' })
  }
}