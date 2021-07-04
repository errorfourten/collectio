import { NotFoundError } from '@util/errors'
import { NewProjectType, ProjectType } from '@util/types'
import mongoose from 'mongoose'

const Project = mongoose.model<ProjectType>('Project')

const allProjects = async () => {
  const projects = await Project.find({ parentProject: undefined })
  return projects
}

const oneProject = async (id: string) => {
  const project = await Project.findById(id)
  if (!project) throw new NotFoundError(`Project ${id} does not exist`)
  return project
}

const addProject = async (data: NewProjectType) => {
  const project = new Project({ name: data.name, parentProject: data.parentProject })
  const response = await project.save()
  return response
}

const deleteProject = async (id: string) => {
  const project = await Project.findById(id)
  if (!project) throw new NotFoundError(`Project ${id} does not exist`)
  await project.deleteOne()
}

const updateProject = async (id: string, data: NewProjectType) => {
  const project = await Project.findByIdAndUpdate(id, data, { new: true })
  if (!project) throw new NotFoundError(`Project ${id} does not exist`)
  return project
}

export default {
  allProjects,
  oneProject,
  addProject,
  deleteProject,
  updateProject
}
