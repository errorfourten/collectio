import { RequestHandler } from 'express'
import service from '@services/datasets'
import { UserInputError } from '@util/errors'
import utils from './utils'

const getAll: RequestHandler = async (_req, res) => {
  const datasets = await service.allDatasets()
  res.json(datasets)
}

const getOne: RequestHandler = async (req, res, next) => {
  try {
    const dataset = await service.oneDatasetById(req.params.id)
    res.json(dataset)
  } catch (error) {
    next(error)
  }
}

const create: RequestHandler = async (req, res, next) => {
  try {
    const newDataset = utils.toDataset(req.body)
    const addedDataset = await service.addDataset(newDataset)
    res.status(201).json(addedDataset)
  } catch (error) {
    next(error)
  }
}

const remove: RequestHandler = async (req, res, next) => {
  try {
    await service.deleteDatasetById(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

const update: RequestHandler = async (req, res, next) => {
  try {
    const dataset = utils.toDataset(req.body)

    if (req.body.id && req.body.id !== req.params.id) {
      throw new UserInputError('URL ID and object ID do not match.')
    }

    const updatedDataset = await service.updateDataset(req.params.id, dataset)
    res.json(updatedDataset)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll,
  getOne,
  create,
  remove,
  update
}
