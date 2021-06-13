import React, { useRef, useState } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { useQueryClient, useMutation } from 'react-query'
import { AxiosError } from 'axios'
import { FormikHelpers, FormikProps } from 'formik'
import { putDataset } from 'Utilities/services/dataset'
import { Dataset, DatasetRawData } from 'Utilities/types'
import DatasetForm from './DatasetForm'

const EditDatasetModal = ({ originalValues }: {originalValues: Dataset}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { id, dateCreated, ...initialValues } = originalValues

  const mutation = useMutation(putDataset, {
    onSuccess: (data) => {
      queryClient.setQueryData<Dataset[]>('datasets', (oldData) => {
        if (oldData) { return oldData.map((od) => (od.id === data.id ? data : od)) }
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

  const formRef = useRef<FormikProps<DatasetRawData>>(null)
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  const submitAction = (values: DatasetRawData, setSubmitting: FormikHelpers<DatasetRawData>['setSubmitting']) => {
    const fullValues = { id, dateCreated, ...values } as Dataset
    mutation.mutate(fullValues)
    setSubmitting(false)
  }

  return (
    <Modal
      size="tiny"
      onClose={handleClose}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button icon="cog" content="Edit" />}
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
        Edit Dataset
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
        <Button positive type="submit" onClick={handleSubmit}>Save</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default EditDatasetModal
