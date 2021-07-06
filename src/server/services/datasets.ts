import { NotFoundError } from '@util/errors'
import { Dataset, DatasetRawData } from '@util/types'
import mongoose from 'mongoose'

const Dataset = mongoose.model<Dataset>('Dataset')

const allDatasets = async () => {
  const datasets = await Dataset.find({})
  return datasets
}

const oneDatasetById = async (id: Dataset['id']) => {
  const dataset = await Dataset.findById(id)
  if (!dataset) throw new NotFoundError(`Dataset ${id} does not exist`)
  return dataset
}

const filteredDatasets = async (filter: Record<string, unknown>) => {
  const datasets = await Dataset.find(filter)
  return datasets
}

const addDataset = async (data: DatasetRawData) => {
  const dataset = new Dataset(data)
  const response = await dataset.save()
  return response
}

const deleteDatasetById = async (id: Dataset['id']) => {
  const response = await Dataset.findByIdAndDelete(id)
  if (!response) throw new NotFoundError(`Dataset ${id} does not exist`)
}

const deleteDatasetByFilter = async (filter: Record<string, unknown>) => {
  const response = await Dataset.deleteMany(filter)
  return response
}

const updateDataset = async (id: string, data: DatasetRawData) => {
  const dataset = await Dataset.findByIdAndUpdate(id, data, { new: true })
  if (!dataset) throw new NotFoundError(`Dataset ${id} does not exist`)
  return dataset
}

export default {
  allDatasets,
  oneDatasetById,
  filteredDatasets,
  addDataset,
  deleteDatasetById,
  deleteDatasetByFilter,
  updateDataset
}
