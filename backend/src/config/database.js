import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'bureo',
  user:     process.env.DB_USER     || 'manuelflav',
  password: process.env.DB_PASSWORD || '',
})

export default pool