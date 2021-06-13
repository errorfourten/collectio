import { Dataset, DatasetRawData } from '@util/types'
import { v4 as uuid } from 'uuid'

let datasets: Array<Dataset> = [
  {
    id: 'ce01c3be-648a-4bc4-b6ad-62e8e84aa91e',
    name: 'Very cool dataset',
    dateCreated: new Date(2020, 11, 24, 10, 33, 30, 0),
    project: 'basic',
    description: 'This is the best dataset ever created',
    notes: 'Need to take note of what is constitutes as cool',
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
    id: '459ed74c-0b1a-4db6-a852-c0dd602e55e7',
    name: 'Another dataset',
    dateCreated: new Date(2020, 12, 2, 20, 0, 0, 0),
    project: 'basic',
    description: 'Just another generic one',
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
    id: '2394ca32-8d0e-4e05-919b-6ffc83ffe804',
    name: 'Big dataset',
    dateCreated: new Date(2021, 1, 5, 0, 0, 0, 0),
    project: 'basic',
    notes: 'Gigantic dataset needs a lot of data',
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
    id: 'ec07515b-3202-47c5-9a4b-965fce23d44b',
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
    id: '3c8bcb95-17ec-4f2e-b16f-d435fdaf0ddf',
    name: 'This is the end',
    dateCreated: new Date(2020, 5, 2),
    project: 'complex',
    description: 'Last ever dataset?',
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

const allDatasets = () => (datasets)

const findDataset = (id: Dataset['id']) => (datasets.find((d) => d.id === id))

const addDataset = (dataset: DatasetRawData): Dataset => {
  const newDataset = {
    id: uuid(),
    dateCreated: new Date(),
    ...dataset
  }

  datasets.push(newDataset)
  return newDataset
}

const removeDataset = (id: Dataset['id']) => {
  datasets = datasets.filter((dataset) => dataset.id !== id)
}

const editDataset = (id: string, editedDataset: Dataset) => {
  datasets = datasets.map((dataset) => (dataset.id === id ? editedDataset : dataset))
}

export default {
  allDatasets,
  findDataset,
  addDataset,
  removeDataset,
  editDataset
}
