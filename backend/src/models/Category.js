import pool from '../config/database.js'

export const Category = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nombre')
    return result.rows
  }
}