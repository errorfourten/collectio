import React, { useState } from 'react'
import { Modal, Button, Header } from 'semantic-ui-react'
import { Dataset } from 'Types'

const DatasetAttributes = ({ attributes }: {attributes: Dataset['attributes']}) => {
  if (!attributes) { return null }

  const attributeHeaders = Object.keys(attributes)
  return (
    <ul>
      {attributeHeaders.map((header) => (
        <li key={header}>
          <>
            {header}
            <ul>
              {
                Object.keys(attributes[header]).map((name) => (
                  <li key={name}>{name}</li>
                ))
              }
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
          <Header>Dataset Details</Header>
          <Header as="h4">Project</Header>
          <p>{dataset.project}</p>
          {
            dataset.attributes && (
            <>
              <Header as="h4">Attributes</Header>
              <DatasetAttributes attributes={dataset.attributes} />
            </>
            )
          }
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default DatasetModal
