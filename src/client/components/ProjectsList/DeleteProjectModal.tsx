import React, { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import {
  Modal, Button, Input, Message
} from 'semantic-ui-react'
import { deleteProject } from 'Utilities/services/projects'
import { AxiosError } from 'axios'

type DeleteProjectModalType = {
  itemKey: string,
  displayName: string,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteProjectModal = ({
  itemKey, displayName, open, setOpen
}: DeleteProjectModalType) => {
  const queryClient = useQueryClient()
  const [disabled, setDisabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const mutation = useMutation(deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
      setOpen(false)
    },
    onError: (error: AxiosError) => {
      if (error.response) { setErrorMessage(error.response.data) }
    }
  })

  return (
    <Modal
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      size="mini"
      closeIcon
    >
      <Modal.Header>Delete Project</Modal.Header>
      {
        errorMessage && (
          <Message error>
            <Message.Header>Submission Error</Message.Header>
            <Message.Content>{errorMessage}</Message.Content>
          </Message>
        )
      }
      <Modal.Content>
        <p>Are you sure you want to delete {displayName}? This will delete all subprojects and any associated datasets!</p>
        <p>Please type <b>{displayName}</b> to confirm.</p>
        <Input
          placeholder={displayName}
          onChange={(e) => {
            if (e.target.value === displayName) setDisabled(false)
            else setDisabled(true)
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          content="Delete"
          disabled={disabled}
          onClick={() => {
            if (!disabled) mutation.mutate(itemKey)
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default DeleteProjectModal
