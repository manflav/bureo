import { Router } from 'express'
import { getAll } from '../controllers/categoriesController.js'

const router = Router()
router.get('/', getAll)
export default router