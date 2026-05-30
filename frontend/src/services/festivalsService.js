import { get } from './api.js'

export const getFiestas = (filters = {}) => {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v)
  ).toString()
  return get(`/fiestas${params ? '?' + params : ''}`)
}

export const getFiestaById    = (id) => get(`/fiestas/${id}`)
export const getFiestasDestacadas = ()  => get('/fiestas/destacadas')
export const getProvincias    = ()      => get('/provincias')
export const getCategorias    = ()      => get('/categorias')