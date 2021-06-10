import React, { useState } from 'react'
import {
  Modal, Button, Header, Segment, Form
} from 'semantic-ui-react'
import { Dataset, DatasetRawData } from 'Utilities/types'
import { postDataset } from 'Utilities/services/dataset'
import { useQueryClient, useMutation } from 'react-query'
import {
  Formik, Field, FieldArray, useFormikContext
} from 'formik'

interface OptionsProps {
  attributeIndex: number
}

const Options = ({ attributeIndex }: OptionsProps) => {
  const { values } = useFormikContext<DatasetRawData>()

  return (
    <FieldArray
      name={`attributes.${attributeIndex}.options`}
      render={
        (arrayHelpers) => (
          values.attributes && (
            <div>
              <Header as="h5" dividing>Options</Header>
              {values.attributes[attributeIndex].options.map((_option, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Form.Group key={`attributes.${attributeIndex}.options.${index}`}>
                  <Form.Field width={8}>
                    <Field name={`attributes.${attributeIndex}.options.${index}.name`} placeholder="Option" autoFocus={index === 0 ? null : 'true'} />
                  </Form.Field>
                  <Form.Field width={5}>
                    <Field name={`attributes.${attributeIndex}.options.${index}.quantity`} placeholder="Quantity" type="number" />
                  </Form.Field>
                  {
                    index !== 0 && <Form.Button icon="cancel" type="button" onClick={() => arrayHelpers.remove(index)} />
                  }
                </Form.Group>
              ))}
              <Form.Button type="button" onClick={() => arrayHelpers.push({ name: '', quantity: '' })}>Add Option</Form.Button>
            </div>
          )
        )
      }
    />
  )
}

const Attributes = () => {
  const { values } = useFormikContext<DatasetRawData>()

  return (
    <FieldArray
      name="attributes"
      render={
        (arrayHelpers) => (
          values.attributes && (
            <div style={{ marginBottom: '1em' }}>
              <Header as="h5" dividing>Attributes</Header>
              {values.attributes.map((_attribute, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Segment key={index} style={{ marginBottom: '2em' }}>
                  <Form.Group>
                    <Form.Field width={8}>
                      <Field name={`attributes.${index}.name`} placeholder="Attribute" autoFocus="true" />
                    </Form.Field>
                    <Form.Button negative icon="cancel" type="button" onClick={() => arrayHelpers.remove(index)} />
                  </Form.Group>
                  <Options attributeIndex={index} />
                </Segment>
              ))}
              <Form.Button primary type="button" onClick={() => arrayHelpers.push({ name: '', options: [{ name: '', quanaity: '' }] })}>Add Attribute</Form.Button>
            </div>
          )
        )
      }
    />
  )
}

const AddDatasetFormModal = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation(postDataset, {
    onSuccess: (data) => {
      queryClient.setQueryData<Dataset[]>('datasets', (oldData) => {
        if (oldData) { return [...oldData, data] }
        return [data]
      })
    }
  })

  const handleSubmit = (values: DatasetRawData) => {
    mutation.mutate(values)
    setOpen(false)
  }

  const initialValues: DatasetRawData = {
    name: '',
    project: '',
    attributes: []
  }

  return (
    <Modal
      size="tiny"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button primary>Create</Button>}
    >
      <i
        role="button"
        tabIndex={0}
        aria-label="Close Modal"
        className="close inside icon"
        onClick={() => setOpen(false)}
        onKeyDown={() => setOpen(false)}
      />
      <Modal.Header>
        Create a New Dataset
      </Modal.Header>
      <Modal.Content>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <Form.Field required>
                <label htmlFor="name">Dataset Name</label>
                <Field name="name" type="text" id="name" autoFocus="true" />
              </Form.Field>
              <Form.Field>
                <label htmlFor="project">Project</label>
                <Field name="project" type="text" id="project" />
              </Form.Field>
              <Attributes />
              <Form.Button positive type="submit">Submit</Form.Button>
            </Form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  )
}

export default AddDatasetFormModal
