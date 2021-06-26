import service from '@services/projects'
import { RequestHandler } from 'express'
import utils from '@controllers/utils'

const getAll: RequestHandler = async (_req, res) => {
  const projects = service.allProjects()
  res.json(projects)
}

const create: RequestHandler = async (req, res) => {
  try {
    const newProject = utils.toNewProject(req.body)
    const addedProject = service.addProject(newProject)
    res.status(201).json(addedProject)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

export default {
  getAll,
  create
}
