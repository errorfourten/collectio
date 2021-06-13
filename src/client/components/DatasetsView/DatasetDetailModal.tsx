import React, { useState } from 'react'
import { Modal, Button, Header } from 'semantic-ui-react'
import { Dataset } from 'Utilities/types'
import { deleteDataset } from 'Utilities/services/dataset'
import { useMutation, useQueryClient } from 'react-query'

const DatasetAttributes = ({ attributes }: {attributes: Dataset['attributes']}) => {
  if (!attributes) { return null }

  return (
    <ul>
      {attributes.map((attribute) => (
        <li key={attribute.name}>
          <>
            {attribute.name}
            <ul>
              {attribute.options.map((option) => (
                <li key={option.name}>{option.name}: {option.quantity}</li>
              ))}
            </ul>
          </>
        </li>
      ))}
    </ul>
  )
}

const DatasetModal = ({ dataset }: {dataset: Dataset}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const deleteMutation = useMutation(deleteDataset, {
    onSuccess: () => {
      queryClient.setQueryData<Dataset[]>('datasets', (oldData) => {
        if (oldData) { return oldData.filter((data) => data.id !== dataset.id) }
        return []
      })
    }
  })

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    deleteMutation.mutate(dataset.id)
    setConfirmOpen(false)
    setOpen(false)
  }

  return (
    <Modal
      closeIcon
      size="small"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button floated="right">Details</Button>}
    >
      <Modal.Header>
        {dataset.name}
      </Modal.Header>

      <Modal.Content style={{ minHeight: '0px' }}>
        <Modal.Description>
          {dataset.description && <i>{dataset.description}</i>}
          <Header>Dataset Details</Header>
          <Header as="h4">Project</Header>
          <p>{dataset.project}</p>
          {dataset.attributes && (
            <>
              <Header as="h4">Attributes</Header>
              <DatasetAttributes attributes={dataset.attributes} />
            </>
          )}
          {dataset.notes && (
            <>
              <Header as="h4">Notes</Header>
              <p style={{ whiteSpace: 'pre-line' }}>{dataset.notes}</p>
            </>
          )}
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button
          negative
          content="Delete"
          icon="trash"
          onClick={() => setConfirmOpen(true)}
        />
      </Modal.Actions>

      <Modal
        size="tiny"
        centered
        onClose={() => setConfirmOpen(false)}
        onOpen={() => setConfirmOpen(true)}
        open={confirmOpen}
        dimmer={{ style: { justifyContent: 'center' } }}
      >
        <Modal.Header>Delete Dataset</Modal.Header>
        <Modal.Content style={{ minHeight: '0px' }}>
          <p>Are you sure you want to delete <b>{dataset.name}</b>?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setConfirmOpen(false)}>No</Button>
          <Button positive onClick={handleDelete}>Yes</Button>
        </Modal.Actions>
      </Modal>

    </Modal>
  )
}

export default DatasetModal
