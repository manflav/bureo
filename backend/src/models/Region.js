import pool from '../config/database.js'

export const Region = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM provincias ORDER BY nombre')
    return result.rows
  }
}