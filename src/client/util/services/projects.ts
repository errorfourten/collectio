import axios from 'axios'
import { NewProjectType, ProjectType } from 'Utilities/types'

const basePath = '/api/projects'

export const getProjects = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const postProject = async (project: NewProjectType) => {
  const response = await axios.post(basePath, project)
  return response.data as ProjectType
}

export const deleteProject = async (id: ProjectType['id']) => {
  await axios.delete(`${basePath}/${id}`)
}
