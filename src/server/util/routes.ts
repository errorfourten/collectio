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
router.get('/projects/:id', projectsController.getOne)
router.post('/projects', projectsController.create)
router.delete('/projects/:id', projectsController.remove)
router.put('/projects/:id', projectsController.update)

export default router
