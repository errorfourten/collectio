import { NewProjectType, ProjectType } from '@util/types'
import mongoose from 'mongoose'

const Project = mongoose.model<ProjectType>('Project')

const allProjects = async () => {
  const projects = await Project.find({ top: true })
  return projects
}

const addProject = async (data: NewProjectType): Promise<ProjectType> => {
  const project = new Project({ name: data.name })

  if (data.parentProject) {
    const parentProject = await Project.findById(data.parentProject).populate('subProjects')
    if (!parentProject) throw new Error(`Parent project ${data.parentProject} does not exist`)

    if (parentProject.subProjects.find((project) => project.name === data.name)) {
      throw new Error(`Parent project ${parentProject.name} already has project ${data.name}`)
    }

    parentProject.subProjects.push(project._id)
    parentProject.save()
  } else {
    const topProjects = await Project.find({ top: true })

    if (topProjects.find((project) => project.name === data.name)) {
      throw new Error(`Top projects already has project ${data.name}`)
    }

    project.top = true
  }

  const response = await project.save()
  return response
}

// const addProject = (newProjectData: NewProjectType): ProjectType => {
//   const newProject = { id: uuid(), name: newProjectData.name, dateCreated: new Date() }

//   const recursivelyAddToProjects = (toSearch: ProjectType[]): ProjectType | undefined => (
//     toSearch.find((project) => {
//       if (newProjectData.parentProject === project.id) {
//         if (project.subProjects) {
//           const nameExists = project.subProjects.find((project) => project.name === newProjectData.name)
//           if (nameExists) throw new Error(`Dataset name ${newProjectData.name} already exists for parent project ${project.name}`)
//           project.subProjects.push(newProject)
//         } else {
//           // eslint-disable-next-line no-param-reassign
//           project.subProjects = [newProject]
//         }
//         return true
//       }
//       if (project.subProjects) {
//         return recursivelyAddToProjects(project.subProjects)
//       }
//       return false
//     })
//   )

//   if (newProjectData.parentProject) {
//     const found = recursivelyAddToProjects(projects)
//     if (!found) throw new Error(`Unable to find parentProject ${newProjectData.parentProject}`)
//   } else {
//     const nameExists = projects.find((project) => project.name === newProjectData.name)
//     if (nameExists) throw new Error(`Dataset name ${newProjectData.name} already exists`)
//     projects.push(newProject)
//   }

//   return newProject
// }

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
  // deleteProject
}
