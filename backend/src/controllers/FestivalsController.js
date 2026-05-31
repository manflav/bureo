import { Festival } from '../models/Festival.js'

export const getAll = async (req, res) => {
  try {
    const { fecha, provincia, categoria, q, lat, lng, km, fecha_inicio, fecha_fin } = req.query

    if (lat && lng) {
      const results = await Festival.findNearby(parseFloat(lat), parseFloat(lng), parseFloat(km) || 50)
      return res.json(results)
    }

    const results = await Festival.findAll({ fecha, provincia, categoria, q, fecha_inicio, fecha_fin })
    res.json(results)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al obtener fiestas' })
  }
}

export const getOne = async (req, res) => {
  try {
    const festival     = await Festival.findById(req.params.id)
    if (!festival) return res.status(404).json({ error: 'Fiesta no encontrada' })
    const gastronomia  = await Festival.findGastronomia(req.params.id)
    const vestimenta   = await Festival.findVestimenta(req.params.id)
    res.json({ ...festival, gastronomia, vestimenta })
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

export const getEnCurso = async (req, res) => {
  try {
    const results = await Festival.findEnCurso()
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener fiestas en curso' })
  }
}