import React, { useRef, useState } from 'react'
import { FormikHelpers, FormikProps } from 'formik'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { NewProjectType } from 'Utilities/types'
import ProjectForm from 'Components/ProjectsList/ProjectForm'
import { useMutation, useQueryClient } from 'react-query'
import { postProject } from 'Utilities/services/projects'
import { AxiosError } from 'axios'

const initialValues: NewProjectType = {
  name: '',
  parentProject: ''
}

const AddProjectModal = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const mutation = useMutation(postProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
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

  const formRef = useRef<FormikProps<NewProjectType>>(null)
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  const submitAction = (values: NewProjectType, setSubmitting: FormikHelpers<NewProjectType>['setSubmitting']) => {
    mutation.mutate(values)
    setSubmitting(false)
  }

  return (
    <Modal
      size="mini"
      onClose={handleClose}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button primary icon size="mini"><Icon name="add" /></Button>}
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
        New Project
      </Modal.Header>
      <Modal.Content>
        <ProjectForm
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

export default AddProjectModal
