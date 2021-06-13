import { RequestHandler } from 'express'
import service from '@services/datasets'
import utils from './utils'

const getAll: RequestHandler = async (_req, res) => {
  const datasets = service.allDatasets()
  res.json(datasets)
}

const getOne: RequestHandler = async (req, res) => {
  try {
    const id = utils.parseUUID(req.params.id)
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
  try {
    const id = utils.parseUUID(req.params.id)
    service.removeDataset(id)
    res.status(204).send()
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const edit: RequestHandler = async (req, res) => {
  try {
    const id = utils.parseUUID(req.params.id)
    if (!service.findDataset(id)) {
      res.status(404).send('Dataset not found')
    }

    const dataset = utils.toDataset(req.body)
    service.editDataset(id, dataset)
    res.json(dataset)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

export default {
  getAll,
  getOne,
  create,
  remove,
  edit
}
