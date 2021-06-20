import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatasetsView from 'Components/DatasetsView'
import { rest } from 'msw'
import { render } from './test-utils'
import { server } from './mock-server'

beforeEach(() => render(<DatasetsView />))

test('Loads all datasets', async () => {
  expect(await screen.findAllByRole('heading')).toHaveLength(5)
  expect(await screen.findByRole('button', { name: 'Create' })).toBeInTheDocument()
  expect(await screen.findAllByRole('button', { name: 'Details' })).toHaveLength(5)
})

test('Open Dataset Detail Modal', async () => {
  // Open first detail modal
  await waitFor(() => expect(screen.queryByText('Dataset Details')).not.toBeInTheDocument())
  userEvent.click((await screen.findAllByRole('button', { name: 'Details' }))[0])
  expect(await screen.findByText('Dataset Details')).toBeInTheDocument()
}, 2000)

test('Form validation in Dataset Form', async () => {
  // Open Modal
  await waitFor(() => expect(screen.queryByText('Create a New Dataset')).not.toBeInTheDocument())
  userEvent.click(await screen.findByRole('button', { name: 'Create' }))
  expect(screen.getByText('Create a New Dataset')).toBeInTheDocument()

  // Submit without entering required values
  const submitButton = screen.getByRole('button', { name: 'Submit' })
  userEvent.click(submitButton)
  expect(await screen.findByRole('alert')).toHaveTextContent(/required/i)

  // Get rid of error by typing something
  userEvent.type(screen.getByRole('textbox', { name: 'Dataset Name' }), 'Test Dataset')
  expect(await screen.findByRole('alert')).not.toBeInTheDocument()

  userEvent.type(screen.getByRole('textbox', { name: 'Project' }), 'Project')
  userEvent.type(screen.getByRole('textbox', { name: 'Notes' }), 'Test Notes')
  userEvent.click(screen.getByRole('button', { name: 'Add Attribute' }))
  userEvent.type(screen.getByRole('textbox', { name: 'Attributes #0 Name' }), 'Test Attribute')
  userEvent.type(screen.getByRole('textbox', { name: 'Attributes #0 Options #0 Name' }), 'Test Option')

  // Test option quantity errors
  const quantityInput = screen.getByRole('spinbutton', { name: 'Attributes #0 Options #0 Quantity' })
  userEvent.type(quantityInput, 'Wrong quantity')
  userEvent.click(submitButton)
  expect(await screen.findByRole('alert')).toHaveTextContent(/required/i)
  userEvent.clear(quantityInput)
  userEvent.type(quantityInput, '-1')
  userEvent.click(submitButton)
  expect(await screen.findByRole('alert')).toHaveTextContent(/Must be at least 0/i)
  userEvent.clear(quantityInput)
  userEvent.type(quantityInput, '999')

  // Modal should close if submitted successfully
  userEvent.click(submitButton)
  await waitFor(() => expect(screen.queryByText('Create a New Dataset')).not.toBeInTheDocument())
  expect(await screen.findByText(/Test Dataset/i))
}, 10000)

test('Server error message can show in Dataset Form', async () => {
  server.use(rest.post('http://localhost/api/datasets', async (_req, res, ctx) => (
    res(ctx.status(500), ctx.json('TEST SERVER ERROR'))
  )))

  userEvent.click(await screen.findByRole('button', { name: 'Create' }))
  userEvent.type(screen.getByRole('textbox', { name: 'Dataset Name' }), 'Test Dataset')
  userEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(screen.getByText(/TEST SERVER ERROR/i)).toBeInTheDocument())
})

test('Add and remove attributes in Dataset Form', async () => {
  // Open Modal
  await waitFor(() => expect(screen.queryByText('Create a New Dataset')).not.toBeInTheDocument())
  userEvent.click(await screen.findByRole('button', { name: 'Create' }))
  expect(screen.getByText('Create a New Dataset')).toBeInTheDocument()

  // Test 'Add Attribute' Button
  expect(screen.queryByRole('textbox', { name: 'Attributes #0 Name' })).not.toBeInTheDocument()
  userEvent.click(screen.getByRole('button', { name: 'Add Attribute' }))
  expect(await screen.findByRole('textbox', { name: 'Attributes #0 Name' })).toBeInTheDocument()
  expect(await screen.findByRole('textbox', { name: 'Attributes #0 Options #0 Name' })).toBeInTheDocument()
  expect(await screen.findByRole('spinbutton', { name: 'Attributes #0 Options #0 Quantity' })).toBeInTheDocument()

  // Test 'Add Option' Button
  expect(screen.queryByRole('textbox', { name: 'Attributes #0 Options #1 Name' })).not.toBeInTheDocument()
  expect(screen.queryByRole('spinbutton', { name: 'Attributes #0 Options #1 Quantity' })).not.toBeInTheDocument()
  userEvent.click(screen.getByRole('button', { name: 'Attributes #0 Add Option' }))
  expect(await screen.findByRole('textbox', { name: 'Attributes #0 Options #1 Name' })).toBeInTheDocument()
  expect(await screen.findByRole('spinbutton', { name: 'Attributes #0 Options #1 Quantity' })).toBeInTheDocument()

  // Add another attribute
  expect(screen.queryByRole('textbox', { name: 'Attributes #1 Name' })).not.toBeInTheDocument()
  userEvent.click(screen.getByRole('button', { name: 'Add Attribute' }))
  expect(await screen.findByRole('textbox', { name: 'Attributes #1 Name' })).toBeInTheDocument()
  expect(await screen.findByRole('textbox', { name: 'Attributes #1 Options #0 Name' })).toBeInTheDocument()
  expect(await screen.findByRole('spinbutton', { name: 'Attributes #1 Options #0 Quantity' })).toBeInTheDocument()

  // Ensure that no attributes and options are linked
  userEvent.type(screen.getByRole('textbox', { name: 'Attributes #1 Name' }), 'Attributes #1 Name')
  userEvent.type(screen.getByRole('textbox', { name: 'Attributes #1 Options #0 Name' }), 'Attributes #1 Options #0 Name')
  userEvent.type(screen.getByRole('spinbutton', { name: 'Attributes #1 Options #0 Quantity' }), '999')
  expect(await screen.findAllByDisplayValue(/Attributes #1 Name/i)).toHaveLength(1)
  expect(await screen.findAllByDisplayValue(/Attributes #1 Options #0 Name/i)).toHaveLength(1)
  expect(await screen.findAllByDisplayValue(/999/i)).toHaveLength(1)

  // Remove option
  userEvent.click(screen.getByRole('button', { name: 'Remove Attributes #0 Options #1' }))
  await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Attributes #0 Options #1 Name' })).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('spinbutton', { name: 'Attributes #0 Options #1 Quantity' })).not.toBeInTheDocument())

  // // Remove attribute
  userEvent.click(screen.getByRole('button', { name: 'Attributes #1 Add Option' }))
  userEvent.click(screen.getByRole('button', { name: 'Remove Attributes #1' }))
  await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Attributes #1 Name' })).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Attributes #1 Options #0 Name' })).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Attributes #1 Options #0 Quantity' })).not.toBeInTheDocument())
}, 15000)
