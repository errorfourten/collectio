import service from '@services/projects'
import { RequestHandler } from 'express'

const getAll: RequestHandler = async (_req, res) => {
  const projects = service.allProjects()
  res.json(projects)
}

export default {
  getAll
}
