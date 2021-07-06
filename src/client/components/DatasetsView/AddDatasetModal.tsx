import React, { useRef, useState } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { useQueryClient, useMutation } from 'react-query'
import { AxiosError } from 'axios'
import { FormikHelpers, FormikProps } from 'formik'
import { postDataset } from 'Utilities/services/dataset'
import { Dataset, DatasetRawData } from 'Utilities/types'
import DatasetForm from './DatasetForm'

const initialValues: DatasetRawData = {
  name: '',
  project: '',
  description: '',
  attributes: [],
  notes: ''
}

const AddDatasetModal = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const mutation = useMutation(postDataset, {
    onSuccess: (data) => {
      queryClient.setQueryData<Dataset[]>('datasets', (oldData) => {
        if (oldData) { return [...oldData, data] }
        return [data]
      })
      setOpen(false)
    },
    onError: (error: AxiosError) => {
      if (error.response) { setErrorMessage(error.response.data.error) }
    }
  })

  const handleClose = () => {
    setOpen(false)
    setErrorMessage('')
  }

  const formRef = useRef<FormikProps<DatasetRawData>>(null)
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  const submitAction = (values: DatasetRawData, setSubmitting: FormikHelpers<DatasetRawData>['setSubmitting']) => {
    mutation.mutate(values)
    setSubmitting(false)
  }

  return (
    <Modal
      size="tiny"
      onClose={handleClose}
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
        <DatasetForm
          initialValues={initialValues}
          errorMessage={errorMessage}
          formRef={formRef}
          submitAction={submitAction}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button positive type="submit" onClick={handleSubmit}>Submit</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default AddDatasetModal
