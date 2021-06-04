import axios from 'axios'

const basePath = '/api/datasets'

export const getDatasets = async () => {
  const response = await axios.get(basePath)
  return response.data
}
