import React, { useState } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { useQueryClient, useMutation } from 'react-query'
import { AxiosError } from 'axios'
import { FormikHelpers } from 'formik'
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
      if (error.response) { setErrorMessage(error.response.data) }
    }
  })

  const handleClose = () => {
    setOpen(false)
    setErrorMessage('')
  }

  const handleSubmit = (values: DatasetRawData, setSubmitting: FormikHelpers<DatasetRawData>['setSubmitting']) => {
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
          handleSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  )
}

export default AddDatasetModal