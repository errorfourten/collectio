import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { v4 as uuid } from 'uuid'
import utils from '@controllers/utils'
import mockData from './mock-data'

const API_LINK = 'http://localhost/api'

const handlers = [
  rest.get(`${API_LINK}/datasets`, async (_req, res, ctx) => (
    res(ctx.json(mockData))
  )),

  rest.post(`${API_LINK}/datasets`, async (req, res, ctx) => {
    try {
      if (req.body) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataset = utils.toNewDataset(req.body as any)
        const newDataset = {
          id: uuid(),
          dateCreated: new Date(),
          ...dataset
        }
        mockData.push(newDataset)
        return res(ctx.json(newDataset))
      }
      return res(ctx.status(500), ctx.json('No data provided'))
    } catch (e) {
      return res(ctx.status(500), ctx.json(e))
    }
  })
]

export const server = setupServer(...handlers)

beforeEach(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
