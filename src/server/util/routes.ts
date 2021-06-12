import Router from 'express'
import datasetsController from '@controllers/datasets'

const router = Router()

router.get('/datasets', datasetsController.getAll)
router.post('/datasets', datasetsController.create)
router.delete('/datasets/:id', datasetsController.remove)

export default router
