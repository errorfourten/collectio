import axios from 'axios'
import { Dataset, DatasetRawData } from 'Utilities/types'

const basePath = '/api/datasets'

export const getDatasets = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const postDataset = async (dataset: DatasetRawData) => {
  const response = await axios.post(basePath, dataset)
  return response.data as Dataset
}

export const deleteDataset = async (id: Dataset['id']) => {
  await axios.delete(`${basePath}/${id}`)
}

type EditedDataset = {
  id: Dataset['id'],
  dataset: DatasetRawData
}

export const putDataset = async (props: EditedDataset) => {
  const response = await axios.put(`${basePath}/${props.id}`, props.dataset)
  return response.data as Dataset
}
