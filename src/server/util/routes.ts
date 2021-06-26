import Router from 'express'
import datasetsController from '@controllers/datasets'
import projectsController from '@controllers/projects'

const router = Router()

router.get('/datasets', datasetsController.getAll)
router.get('/datasets/:id', datasetsController.getOne)
router.post('/datasets', datasetsController.create)
router.delete('/datasets/:id', datasetsController.remove)
router.put('/datasets/:id', datasetsController.edit)

router.get('/projects', projectsController.getAll)
router.post('/projects', projectsController.create)

export default router
