import axios from 'axios'
import { Dataset, DatasetRawData } from 'Types'

const basePath = '/api/datasets'

export const getDatasets = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const postDataset = async (dataset: DatasetRawData) => {
  const response = await axios.post(basePath, dataset)
  return response.data as Dataset
}
