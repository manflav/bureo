import pkg from 'pg'
import fetch from 'node-fetch'
const { Pool } = pkg

const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'bureo',
  user:     'manuelflav',
  password: '',
})

const QUERY = `
[out:json][timeout:60];
area["name"="Andalucía"]["admin_level"="4"]->.andalucia;
relation["admin_level"="8"](area.andalucia);
out center tags;
`

// Mapa de provincias por código INE
const PROVINCIAS = {
  '04': 1, // Almería
  '11': 2, // Cádiz
  '14': 3, // Córdoba
  '18': 4, // Granada
  '21': 5, // Huelva
  '23': 6, // Jaén
  '29': 7, // Málaga
  '41': 8, // Sevilla
}

async function importar() {
  console.log('Descargando municipios de OpenStreetMap...')

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(QUERY),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

  const data = await res.json()
  const elementos = data.elements

  console.log(`${elementos.length} municipios encontrados`)

  let insertados = 0
  let omitidos = 0

  for (const el of elementos) {
    const nombre = el.tags?.name
    const lat    = el.center?.lat
    const lng    = el.center?.lon

    // Código INE: ref:es:ine tiene formato '01001' — primeros 2 dígitos = provincia
    const ine    = el.tags?.['ref:es:ine'] || el.tags?.['ine:municipio']
    const codProv = ine ? ine.substring(0, 2) : null
    const provId  = codProv ? PROVINCIAS[codProv] : null

    if (!nombre || !lat || !lng || !provId) {
      omitidos++
      continue
    }

    try {
      await pool.query(`
        INSERT INTO municipios (nombre, provincia_id, lat, lng, ubicacion)
        VALUES ($1, $2, $3, $4, ST_GeogFromText($5))
        ON CONFLICT DO NOTHING
      `, [nombre, provId, lat, lng, `POINT(${lng} ${lat})`])
      insertados++
    } catch (e) {
      console.error(`Error en ${nombre}:`, e.message)
      omitidos++
    }
  }

  console.log(`✅ ${insertados} municipios insertados`)
  console.log(`⚠️  ${omitidos} omitidos`)
  await pool.end()
}

importar()