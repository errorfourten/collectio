import { Dataset, DatasetRawData, ProjectType } from '@util/types'
import mongoose from 'mongoose'

const Dataset = mongoose.model<Dataset>('Dataset')
const Project = mongoose.model<ProjectType>('Project')

const initialDatasets: DatasetRawData[] = [
  {
    name: 'Very cool dataset',
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
    name: 'Another dataset',
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
    name: 'Big dataset',
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
    name: 'A new beginning',
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
    name: 'This is the end',
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

const resetDatasets = async () => {
  await Dataset.deleteMany({})

  const promises = initialDatasets.map(async (dataset) => {
    // Project needs to be created if does not exist
    let projectId = null
    if (dataset.project) {
      const project = await Project.findOne({ name: dataset.project })
      if (project) {
        projectId = project.id
      } else {
        const newProject = await Project.create({ name: dataset.project })
        projectId = newProject.id
      }
    }

    const currentDate = new Date()
    const datasetObj = {
      ...dataset,
      createdAt: currentDate,
      modifiedAt: currentDate,
      ...(dataset.project && { project: projectId })
    }

    return datasetObj
  })

  const datasets = await Promise.all(promises)
  await Dataset.create(datasets)
}

const notExistingId = async () => {
  const newDataset = new Dataset({ name: 'non existent dataset' })
  const dataset = await newDataset.save()
  await dataset.deleteOne()

  return dataset.id
}

const datasetsInDb = async () => {
  const datasets = await Dataset.find({})
  return datasets.map((dataset) => dataset.toJSON())
}

export default {
  initialDatasets,
  resetDatasets,
  notExistingId,
  datasetsInDb
}
