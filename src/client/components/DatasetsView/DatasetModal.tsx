import React, { useState } from 'react'
import { Modal, Button, Header } from 'semantic-ui-react'
import { Dataset } from 'Utilities/types'

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
  const [open, setOpen] = useState(false)

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
      <Modal.Content style={{ minHeight: '' }}>
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
    </Modal>
  )
}

export default DatasetModal
