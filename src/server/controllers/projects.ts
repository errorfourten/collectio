import service from '@services/projects'
import { RequestHandler } from 'express'
import utils from '@controllers/utils'

const getAll: RequestHandler = async (_req, res) => {
  const projects = await service.allProjects()
  res.json(projects)
}

const create: RequestHandler = async (req, res) => {
  try {
    const newProject = utils.toNewProject(req.body)
    const addedProject = await service.addProject(newProject)
    res.status(201).json(addedProject)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const remove: RequestHandler = async (req, res) => {
  try {
    await service.deleteProject(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(404).send()
  }
}

const update: RequestHandler = async (req, res) => {
  try {
    const project = utils.toNewProject(req.body)
    const updatedProject = await service.updateProject(req.params.id, project)
    res.status(200).json(updatedProject)
  } catch (error) {
    res.status(404).send()
  }
}

export default {
  getAll,
  create,
  remove,
  update
}
