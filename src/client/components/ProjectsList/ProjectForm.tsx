import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { DropdownProps, Form, Message } from 'semantic-ui-react'
import { Formik, FormikHelpers, FormikProps } from 'formik'
import { ProjectType, NewProjectType } from 'Utilities/types'
import { useQuery } from 'react-query'
import { getProjects } from 'Utilities/services/projects'

type ProjectOptions = {
  key: ProjectType['id'],
  value: ProjectType['id'],
  text: ProjectType['name']
}

let projectOptions: ProjectOptions[] = []
const createDropdown = (project: ProjectType, parentName: string): void => {
  if (!parentName) {
    projectOptions.push({ key: project.name, value: project.id, text: project.name })
    if (project.subProjects) {
      project.subProjects.map((p) => createDropdown(p, `${project.name}`))
    }
  } else {
    projectOptions.push({ key: `${parentName} / ${project.name}`, value: project.id, text: `${parentName} / ${project.name}` })
    if (project.subProjects) {
      project.subProjects.map((p) => createDropdown(p, `${parentName} / ${project.name}`))
    }
  }
}

type ModalProps = {
  initialValues: NewProjectType,
  errorMessage: string,
  formRef: React.RefObject<FormikProps<NewProjectType>>
  submitAction: (values: NewProjectType, setSubmitting: FormikHelpers<NewProjectType>['setSubmitting']) => void
}

const ProjectForm = ({
  initialValues, errorMessage, formRef, submitAction
}: ModalProps) => {
  const projectsQuery = useQuery<ProjectType[], Error>('projects', getProjects)
  const projects = (Array.isArray(projectsQuery.data) && projectsQuery.data.length > 0) ? projectsQuery.data : null

  useEffect(() => {
    projectOptions = []
    if (projects) projects.map((project) => createDropdown(project, ''))
  }, [])

  const handleDropdownChange = (data: DropdownProps, formikProps: FormikProps<NewProjectType>) => {
    formikProps.setFieldValue('parentProject', data.value)
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => submitAction(values, setSubmitting)}
      innerRef={formRef}
      validationSchema={Yup.object({
        name: Yup.string().required('Required').trim()
      })}
    >
      {(formikProps) => (
        <Form
          onSubmit={formikProps.handleSubmit}
          loading={formikProps.isSubmitting}
          error={errorMessage !== ''}
        >
          {errorMessage && (
            <Message
              error
            >
              <Message.Header>Submission Error</Message.Header>
              <Message.Content>{errorMessage}</Message.Content>
            </Message>
          )}
          <Form.Field required name="name">
            <label htmlFor="name">Project Name</label>
            <Form.Input
              name="name"
              type="text"
              id="name"
              value={formikProps.values.name}
              error={formikProps.errors.name}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              autoFocus
            />
          </Form.Field>
          {projects
            && (
            <Form.Field>
              <label htmlFor="parentProject">Parent Project</label>
              <Form.Dropdown
                name="parentProject"
                type="text"
                id="parentProject"
                placeholder="Select Parent Project"
                fluid
                selection
                clearable
                search
                options={projectOptions}
                value={formikProps.values.parentProject}
                error={formikProps.errors.parentProject}
                onChange={(_e, data) => handleDropdownChange(data, formikProps)}
                onBlur={formikProps.handleBlur('parentProject')}
              />
            </Form.Field>
            )}
        </Form>
      )}
    </Formik>
  )
}

export default ProjectForm
