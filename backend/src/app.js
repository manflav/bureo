import express from 'express'
import cors from 'cors'
import festivalsRouter  from './routes/festivals.js'
import regionsRouter    from './routes/regions.js'
import categoriesRouter from './routes/categories.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/fiestas',    festivalsRouter)
app.use('/api/provincias', regionsRouter)
app.use('/api/categorias', categoriesRouter)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

export default app