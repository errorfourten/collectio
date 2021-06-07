import { Dataset, DatasetRawData } from '@util/types'
import { RequestHandler } from 'express'
import { v4 as uuid } from 'uuid'
import utils from './utils'

const datasets: Array<Dataset> = [
  {
    id: '1',
    name: 'Very cool dataset',
    dateCreated: new Date(2020, 11, 24, 10, 33, 30, 0),
    project: 'basic',
    attributes: [
      {
        name: 'size',
        options: [
          {
            name: 'small',
            quantity: 20
          },
          {
            name: 'medium',
            quantity: 60
          },
          {
            name: 'large',
            quantity: 20
          }
        ]
      }, {
        name: 'direction',
        options: [
          {
            name: 'left',
            quantity: 30
          },
          {
            name: 'right',
            quantity: 70
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Another dataset',
    dateCreated: new Date(2020, 12, 2, 20, 0, 0, 0),
    project: 'basic',
    attributes: [
      {
        name: 'size',
        options: [
          {
            name: 'small',
            quantity: 50
          },
          {
            name: 'medium',
            quantity: 20
          },
          {
            name: 'large',
            quantity: 30
          }
        ]
      }, {
        name: 'direction',
        options: [
          {
            name: 'left',
            quantity: 50
          },
          {
            name: 'right',
            quantity: 50
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Big dataset',
    dateCreated: new Date(2021, 1, 5, 0, 0, 0, 0),
    project: 'basic',
    attributes: [
      {
        name: 'size',
        options: [
          {
            name: 'small',
            quantity: 15
          },
          {
            name: 'medium',
            quantity: 45
          },
          {
            name: 'large',
            quantity: 40
          }
        ]
      }, {
        name: 'direction',
        options: [
          {
            name: 'left',
            quantity: 5
          },
          {
            name: 'right',
            quantity: 95
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'A new beginning',
    dateCreated: new Date(2020, 4, 2),
    project: 'complex',
    attributes: [
      {
        name: 'width',
        options: [
          {
            name: 'thin',
            quantity: 93
          },
          {
            name: 'thick',
            quantity: 302
          }
        ]
      }, {
        name: 'height',
        options: [
          {
            name: 'small',
            quantity: 39
          },
          {
            name: 'medium',
            quantity: 94
          },
          {
            name: 'tall',
            quantity: 23
          }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'This is the end',
    dateCreated: new Date(2020, 5, 2),
    project: 'complex',
    attributes: [
      {
        name: 'width',
        options: [
          {
            name: 'thin',
            quantity: 32
          },
          {
            name: 'thick',
            quantity: 89
          }
        ]
      }, {
        name: 'height',
        options: [
          {
            name: 'small',
            quantity: 19
          },
          {
            name: 'medium',
            quantity: 203
          },
          {
            name: 'tall',
            quantity: 45
          }
        ]
      }
    ]
  }
]

const getAll: RequestHandler = async (_req, res) => {
  res.send(datasets)
}

const addDataset = (dataset: DatasetRawData): Dataset => {
  const newDataset = {
    id: uuid(),
    dateCreated: new Date(),
    ...dataset
  }

  datasets.push(newDataset)
  return newDataset
}

const create: RequestHandler = async (req, res) => {
  try {
    const newDataset = utils.toNewDataset(req.body)
    const addedDataset = addDataset(newDataset)
    res.json(addedDataset)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

export default {
  getAll,
  create
}
