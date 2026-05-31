import pool from '../config/database.js'

export const Festival = {

  findAll: async (filters = {}) => {
    let sql = `
      SELECT f.*, 
             m.nombre as municipio,
             p.nombre as provincia,
             c.nombre as categoria
      FROM fiestas f
      JOIN municipios m  ON f.municipio_id  = m.id
      JOIN provincias p  ON m.provincia_id  = p.id
      JOIN categorias c  ON f.categoria_id  = c.id
      WHERE 1=1
    `
    const params = []
    let i = 1

    if (filters.fecha_inicio && filters.fecha_fin) {
    sql += ` AND f.fecha_inicio >= $${i} AND f.fecha_fin <= $${i+1}`
    params.push(filters.fecha_inicio, filters.fecha_fin)
    i += 2
    } else if (filters.fecha_inicio) {
    sql += ` AND f.fecha_fin >= $${i}`
    params.push(filters.fecha_inicio)
    i++
    } else if (filters.fecha_fin) {
    sql += ` AND f.fecha_inicio <= $${i}`
    params.push(filters.fecha_fin)
    i++
    }
    if (filters.provincia) {
      sql += ` AND p.nombre ILIKE $${i}`
      params.push(filters.provincia)
      i++
    }
    if (filters.categoria) {
      sql += ` AND c.nombre ILIKE $${i}`
      params.push(filters.categoria)
      i++
    }
    if (filters.q) {
      sql += ` AND (f.nombre ILIKE $${i} OR m.nombre ILIKE $${i})`
      params.push(`%${filters.q}%`)
      i++
    }

    sql += ' ORDER BY f.fecha_inicio ASC'
    const result = await pool.query(sql, params)
    return result.rows
  },

  findById: async (id) => {
    const result = await pool.query(`
      SELECT f.*,
             m.nombre as municipio,
             p.nombre as provincia,
             c.nombre as categoria
      FROM fiestas f
      JOIN municipios m ON f.municipio_id  = m.id
      JOIN provincias p ON m.provincia_id  = p.id
      JOIN categorias c ON f.categoria_id  = c.id
      WHERE f.id = $1
    `, [id])
    return result.rows[0]
  },

  findNearby: async (lat, lng, km = 50) => {
    const result = await pool.query(`
      SELECT f.*,
             m.nombre as municipio,
             p.nombre as provincia,
             c.nombre as categoria,
             ST_Distance(f.ubicacion, ST_GeogFromText($3)) / 1000 as distancia_km
      FROM fiestas f
      JOIN municipios m ON f.municipio_id = m.id
      JOIN provincias p ON m.provincia_id = p.id
      JOIN categorias c ON f.categoria_id = c.id
      WHERE ST_DWithin(f.ubicacion, ST_GeogFromText($3), $4)
      ORDER BY distancia_km ASC
    `, [lat, lng, `POINT(${lng} ${lat})`, km * 1000])
    return result.rows
  },

  findDestacadas: async () => {
    const result = await pool.query(`
      SELECT f.*,
             m.nombre as municipio,
             p.nombre as provincia,
             c.nombre as categoria
      FROM fiestas f
      JOIN municipios m ON f.municipio_id = m.id
      JOIN provincias p ON m.provincia_id = p.id
      JOIN categorias c ON f.categoria_id = c.id
      WHERE f.es_destacada = TRUE
      ORDER BY f.fecha_inicio ASC
    `)
    return result.rows
  },

  findEnCurso: async () => {
    const hoy = new Date().toISOString().slice(0, 10)
    const result = await pool.query(`
      SELECT f.*,
            m.nombre as municipio,
            p.nombre as provincia,
            c.nombre as categoria
      FROM fiestas f
      JOIN municipios m ON f.municipio_id = m.id
      JOIN provincias p ON m.provincia_id = p.id
      JOIN categorias c ON f.categoria_id = c.id
      WHERE f.fecha_inicio <= $1 AND (f.fecha_fin >= $1 OR f.fecha_fin IS NULL)
      ORDER BY f.fecha_inicio ASC
    `, [hoy])
    return result.rows
  },

  findGastronomia: async (id) => {
    const result = await pool.query(
      'SELECT * FROM gastronomia WHERE fiesta_id = $1', [id]
    )
    return result.rows
  },

  findVestimenta: async (id) => {
    const result = await pool.query(
      'SELECT * FROM vestimenta WHERE fiesta_id = $1', [id]
    )
    return result.rows
  },
}