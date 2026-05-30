import { Router } from 'express'
import { getAll, getOne, getDestacadas } from '../controllers/festivalsController.js'

const router = Router()
router.get('/',            getAll)
router.get('/destacadas',  getDestacadas)
router.get('/:id',         getOne)
export default router