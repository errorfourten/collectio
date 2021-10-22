import { Dataset, DatasetRawData } from '@util/types'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../index'
import testHelpers from './testHelpers'

const api = supertest(app)

beforeEach(async () => {
  await testHelpers.resetDatasets()
})

afterAll(() => {
  mongoose.connection.close()
})

describe('Datasets', () => {
  describe('GET', () => {
    test('Can get all datasets', async () => {
      const response = await api
        .get('/datasets')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toBe(5)
    })

    test('Can get one dataset', async () => {
      const response = await api.get('/datasets')
      const oneDatasetId = response.body[0].id

      await api
        .get(`/datasets/${oneDatasetId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Fails with 404 on invalid ID', async () => {
      const id = await testHelpers.notExistingId()
      await api
        .get(`/datasets/${id}`)
        .expect(404)
    })
  })

  describe('POST', () => {
    test('Succeeds with right parameters', async () => {
      const initialDatasets = await api.get('/datasets')

      const newDataset: DatasetRawData = {
        name: 'test dataset',
        description: 'test description',
        notes: 'test notes',
        attributes: [
          {
            name: 'test attribute',
            options: [
              {
                name: 'test name',
                quantity: 0
              }
            ]
          }
        ]
      }

      const resultDataset = await api
        .post('/datasets')
        .send(newDataset)
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const afterDatasets = await api.get('/datasets')

      expect(resultDataset.body).toHaveProperty('id')
      expect(resultDataset.body).toHaveProperty('createdAt')
      expect(resultDataset.body).toMatchObject(newDataset)
      expect(afterDatasets.body.length).toEqual(initialDatasets.body.length + 1)
    })

    test('Fails if missing necessary attributes', async () => {
      const initialDatasets = await api.get('/datasets')

      await api
        .post('/datasets')
        .send({})
        .set('Content-Type', 'application/json')
        .expect(400)

      const afterDatasets = await api.get('/datasets')
      expect(initialDatasets.body).toEqual(afterDatasets.body)
    })
  })

  describe('DELETE', () => {
    test('Succeeds with right parameters', async () => {
      const initialDatasets = await api.get('/datasets')
      const datasetToRemove = initialDatasets.body[0]

      await api
        .delete(`/datasets/${datasetToRemove.id}`)
        .expect(204)

      const afterDatasets = await api.get('/datasets')
      expect(afterDatasets.body).not.toContain(datasetToRemove)
      expect(afterDatasets.body.length).toEqual(initialDatasets.body.length - 1)
    })

    test('Fails with 404 if ID does not exist', async () => {
      const initialDatasets = await api.get('/datasets')
      const id = await testHelpers.notExistingId()

      await api
        .delete(`/datasets/${id}`)
        .expect(404)

      const afterDatasets = await api.get('/datasets')
      expect(initialDatasets.body).toEqual(afterDatasets.body)
    })
  })

  describe('PUT', () => {
    test('Succeeds with right parameters', async () => {
      const initialDatasets = await api.get('/datasets')
      const datasetToEdit = initialDatasets.body[0] as Dataset

      const editedDataset = { ...datasetToEdit }
      editedDataset.name = 'edited name'
      editedDataset.notes = 'edited notes'

      await api
        .put(`/datasets/${datasetToEdit.id}`)
        .send(editedDataset)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const afterDataset = await api.get(`/datasets/${datasetToEdit.id}`)
      expect(afterDataset.body).toEqual({ ...editedDataset, updatedAt: expect.any(String) })
    })

    test('Succeeds without ID in request body', async () => {
      const initialDatasets = await api.get('/datasets')
      const datasetToEdit = initialDatasets.body[0]

      const editedDataset = { ...datasetToEdit }
      delete editedDataset.id
      editedDataset.name = 'edited name'
      editedDataset.notes = 'edited notes'

      await api
        .put(`/datasets/${datasetToEdit.id}`)
        .send(editedDataset)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const afterDataset = await api.get(`/datasets/${datasetToEdit.id}`)
      expect(afterDataset.body).toHaveProperty('id', datasetToEdit.id)
    })

    test('Fails if ID in body is not same as request URL', async () => {
      const initialDatasets = await api.get('/datasets')
      const datasetToEdit = initialDatasets.body[0]

      const editedDataset = { ...datasetToEdit }
      editedDataset.id = 'WRONG ID'
      editedDataset.name = 'edited name'
      editedDataset.notes = 'edited notes'

      await api
        .put(`/datasets/${datasetToEdit.id}`)
        .send(editedDataset)
        .set('Content-Type', 'application/json')
        .expect(400)

      const afterDataset = await api.get(`/datasets/${datasetToEdit.id}`)
      expect(afterDataset.body).toEqual(datasetToEdit)
    })

    test('Fails with 404 if request url is not found', async () => {
      const initialDatasets = await api.get('/datasets')
      const { id, ...datasetToEdit } = initialDatasets.body[0]
      const nonExistentId = await testHelpers.notExistingId()

      await api
        .put(`/datasets/${nonExistentId}`)
        .send(datasetToEdit)
        .set('Content-Type', 'application/json')
        .expect(404)
    })

    test('Fails with 400 if necessary attribute is missing from body', async () => {
      const initialDatasets = await api.get('/datasets')
      const { name, ...datasetToEdit } = initialDatasets.body[0]

      await api
        .put(`/datasets/${datasetToEdit.id}`)
        .send(datasetToEdit)
        .set('Content-Type', 'application/json')
        .expect(400)
    })
  })
})
