import Router from 'express'
import datasetsController from '@controllers/datasets'

const router = Router()

router.get('/datasets', datasetsController.getAll)

export default router
