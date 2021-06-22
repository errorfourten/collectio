import axios from 'axios'

const basePath = '/api/projects'

export const getProjects = async () => {
  const response = await axios.get(basePath)
  return response.data
}
