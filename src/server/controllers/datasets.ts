import { RequestHandler } from 'express'
import service from '@services/datasets'
import utils from './utils'

const getAll: RequestHandler = async (_req, res) => {
  const datasets = service.allDatasets()
  res.json(datasets)
}

const getOne: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const dataset = service.findDataset(id)
    if (dataset) {
      res.json(dataset)
    } else {
      res.status(404).send('Dataset not found')
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const create: RequestHandler = async (req, res) => {
  try {
    const newDataset = utils.toNewDataset(req.body)
    const addedDataset = service.addDataset(newDataset)
    res.status(201).json(addedDataset)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const remove: RequestHandler = async (req, res) => {
  const { id } = req.params

  try {
    if (service.findDataset(id)) {
      service.removeDataset(id)
      res.status(204).send()
    } else {
      res.status(404).send()
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const edit: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    if (!service.findDataset(id)) {
      return res.status(404).send('Dataset not found')
    }

    let dataset = null
    if (req.body.id === undefined) {
      dataset = utils.toDataset({ ...req.body, id })
    } else {
      dataset = utils.toDataset(req.body)
    }

    if (dataset.id !== id) {
      throw new Error(`ID in dataset ${dataset.id} is not the same as resource ID ${id}`)
    }

    service.editDataset(id, dataset)
    return res.json(dataset)
  } catch (e) {
    return res.status(400).send(e.message)
  }
}

export default {
  getAll,
  getOne,
  create,
  remove,
  edit
}
