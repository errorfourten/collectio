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
  const project = await Project.findByIdAndDelete(id)
  console.log(project)
  if (!project) throw new Error(`Project ${id} does not exist`)
}

// const deleteProject = (toDeleteId: ProjectType['id']) => {
//   // not the most efficient way since it doesn't return immediately when found
//   projects = projects.filter(function recursiveFilter(project): boolean | number {
//     if (project.subProjects) {
//       project.subProjects = project.subProjects.filter(recursiveFilter)
//     }
//     if (project.id !== toDeleteId) return true
//     return false
//   })

//   // if (!found) throw new Error(`Unable to find project ${toDeleteId}`)
// }

export default {
  allProjects,
  addProject,
  deleteProject
}
