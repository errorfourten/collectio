import service from '@services/projects'
import datasetService from '@services/datasets'
import { RequestHandler } from 'express'
import utils from '@controllers/utils'

const getAll: RequestHandler = async (_req, res) => {
  const projects = await service.allProjects()
  res.json(projects)
}

const getOne: RequestHandler = async (req, res, next) => {
  try {
    const project = await service.oneProject(req.params.id)
    res.json(project)
  } catch (error) {
    next(error)
  }
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
    const project = await service.oneProject(req.params.id)
    const allSubProjects = utils.getAllSubProjects(project)
    await datasetService.deleteDatasetByFilter({ project: { $in: allSubProjects } })

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
  getOne,
  create,
  remove,
  update
}
