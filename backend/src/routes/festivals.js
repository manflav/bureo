import { Router } from 'express'
import { getAll, getOne, getDestacadas, getEnCurso } from '../controllers/festivalsController.js'

const router = Router()

router.get('/',           getAll)
router.get('/destacadas', getDestacadas)
router.get('/en-curso',   getEnCurso)
router.get('/:id',        getOne)

export default router