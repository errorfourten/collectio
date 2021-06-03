import { Dataset } from '@util/types'
import { RequestHandler } from 'express'

const data: Array<Dataset> = [
  {
    id: '1',
    name: 'Very cool dataset',
    dateCreated: new Date(2020, 11, 24, 10, 33, 30, 0),
    project: 'basic',
    attributes: {
      size: {
        small: 20,
        medium: 60,
        large: 20
      },
      direction: {
        left: 30,
        right: 70
      }
    }
  },
  {
    id: '2',
    name: 'Another dataset',
    dateCreated: new Date(2020, 12, 2, 20, 0, 0, 0),
    project: 'basic',
    attributes: {
      size: {
        small: 50,
        medium: 20,
        large: 30
      },
      direction: {
        left: 50,
        right: 50
      }
    }
  },
  {
    id: '3',
    name: 'Big dataset',
    dateCreated: new Date(2021, 1, 5, 0, 0, 0, 0),
    project: 'basic',
    attributes: {
      size: {
        small: 15,
        medium: 45,
        large: 40
      },
      direction: {
        left: 5,
        right: 95
      }
    }
  },
  {
    id: '4',
    name: 'A new beginning',
    dateCreated: new Date(2020, 4, 2),
    project: 'complex',
    attributes: {
      width: {
        thin: 93,
        thick: 302
      },
      height: {
        short: 39,
        medium: 94,
        tall: 23
      }
    }
  },
  {
    id: '5',
    name: 'This is the end',
    dateCreated: new Date(2020, 5, 2),
    project: 'complex',
    attributes: {
      width: {
        thin: 32,
        thick: 89
      },
      height: {
        short: 19,
        medium: 203,
        tall: 45
      }
    }
  }
]

const getAll: RequestHandler = async (_req, res) => {
  res.send(data)
}

export default {
  getAll
}
