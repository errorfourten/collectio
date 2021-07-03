import { NewProjectType, ProjectType } from '@util/types'
import mongoose from 'mongoose'

const Project = mongoose.model<ProjectType>('Project')

const allProjects = async () => {
  const projects = await Project.find({ parentProject: undefined })
  return projects
}

const addProject = async (data: NewProjectType): Promise<ProjectType> => {
  const project = new Project({ name: data.name, parentProject: data.parentProject })
  const response = await project.save()
  return response
}

const deleteProject = async (id: string) => {
  const project = await Project.findById(id)
  if (!project) throw new Error(`Project ${id} does not exist`)
  await project.deleteOne()
}

export default {
  allProjects,
  addProject,
  deleteProject
}
