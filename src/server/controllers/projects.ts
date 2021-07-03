import service from '@services/projects'
import { RequestHandler } from 'express'
import utils from '@controllers/utils'

const getAll: RequestHandler = async (_req, res) => {
  const projects = await service.allProjects()
  res.json(projects)
}

const create: RequestHandler = async (req, res, next) => {
  try {
    const newProject = utils.toNewProject(req.body)
    const addedProject = await service.addProject(newProject)
    res.status(201).json(addedProject)
  } catch (error) {
    next(error)
  }
}

const remove: RequestHandler = async (req, res, next) => {
  try {
    await service.deleteProject(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

const update: RequestHandler = async (req, res, next) => {
  try {
    const project = utils.toNewProject(req.body)
    const updatedProject = await service.updateProject(req.params.id, project)
    res.status(200).json(updatedProject)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll,
  create,
  remove,
  update
}
