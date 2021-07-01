import React, { useEffect } from 'react'
import {
  Header, Segment, Form, Message, DropdownProps
} from 'semantic-ui-react'
import { DatasetRawData, Attribute, ProjectType } from 'Utilities/types'
import {
  Formik, FieldArray, useFormikContext, FormikProps, FormikHelpers
} from 'formik'
import * as Yup from 'yup'
import { useQuery } from 'react-query'
import { getProjects } from 'Utilities/services/projects'

interface OptionsProps {
  attributeIndex: number,
  formikProps: FormikProps<DatasetRawData>
}

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

const Options = ({ attributeIndex, formikProps }: OptionsProps) => {
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
                    <Form.Input
                      name={`attributes.${attributeIndex}.options.${index}.name`}
                      aria-label={`Attributes #${attributeIndex} Options #${index} Name`}
                      placeholder="Option"
                      autoFocus={index !== 0}
                      value={formikProps.values.attributes && formikProps.values.attributes[attributeIndex]?.options[index]?.name}
                      error={formikProps.errors.attributes
                        && formikProps.touched.attributes
                        && (formikProps.touched.attributes as unknown as boolean[])[attributeIndex]
                        && ((formikProps.touched.attributes as unknown as boolean[])[attributeIndex] as unknown as Attribute).options
                        && ((formikProps.touched.attributes as unknown as boolean[])[attributeIndex] as unknown as Attribute).options[index]?.name
                        && formikProps.errors.attributes[attributeIndex]
                        ? (formikProps.errors.attributes[attributeIndex] as unknown as Attribute).options
                        && (formikProps.errors.attributes[attributeIndex] as unknown as Attribute).options[index]
                        && (formikProps.errors.attributes[attributeIndex] as unknown as Attribute).options[index].name
                        : false}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      onSubmit={formikProps.handleSubmit}
                      onReset={formikProps.handleReset}
                    />
                  </Form.Field>
                  <Form.Field width={5}>
                    <Form.Input
                      name={`attributes.${attributeIndex}.options.${index}.quantity`}
                      aria-label={`Attributes #${attributeIndex} Options #${index} Quantity`}
                      placeholder="Quantity"
                      type="number"
                      value={formikProps.values.attributes && formikProps.values.attributes[attributeIndex]?.options[index]?.quantity}
                      error={formikProps.errors.attributes
                        && formikProps.touched.attributes
                        && (formikProps.touched.attributes as unknown as boolean[])[attributeIndex]
                        && ((formikProps.touched.attributes as unknown as boolean[])[attributeIndex] as unknown as Attribute).options
                        && ((formikProps.touched.attributes as unknown as boolean[])[attributeIndex] as unknown as Attribute).options[index]?.quantity
                        && formikProps.errors.attributes[attributeIndex]
                        ? (formikProps.errors.attributes[attributeIndex] as unknown as Attribute).options
                        && (formikProps.errors.attributes[attributeIndex] as unknown as Attribute).options[index]
                        && (formikProps.errors.attributes[attributeIndex] as unknown as Attribute).options[index].quantity
                        : false}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      onSubmit={formikProps.handleSubmit}
                      onReset={formikProps.handleReset}
                    />
                  </Form.Field>
                  {
                    index !== 0 && <Form.Button icon="cancel" type="button" aria-label={`Remove Attributes #${attributeIndex} Options #${index}`} onClick={() => arrayHelpers.remove(index)} />
                  }
                </Form.Group>
              ))}
              <Form.Button type="button" aria-label={`Attributes #${attributeIndex} Add Option`} onClick={() => arrayHelpers.push({ name: '', quantity: '' })}>Add Option</Form.Button>
            </div>
          )
        )
      }
    />
  )
}

const Attributes = ({ formikProps }: {formikProps: FormikProps<DatasetRawData>}) => {
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
                      <Form.Input
                        name={`attributes.${index}.name`}
                        aria-label={`Attributes #${index} Name`}
                        placeholder="Attribute"
                        value={formikProps.values.attributes && formikProps.values.attributes[index].name}
                        error={formikProps.errors.attributes
                          && formikProps.touched.attributes
                          && (formikProps.touched.attributes as unknown as boolean[])[index]
                          && ((formikProps.touched.attributes as unknown as boolean[])[index] as unknown as Attribute).name
                          && formikProps.errors.attributes[index] ? (formikProps.errors.attributes[index] as unknown as Attribute).name : false}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        onSubmit={formikProps.handleSubmit}
                        onReset={formikProps.handleReset}
                        autoFocus
                      />
                    </Form.Field>
                    <Form.Button negative icon="cancel" type="button" aria-label={`Remove Attributes #${index}`} onClick={() => arrayHelpers.remove(index)} />
                  </Form.Group>
                  <Options attributeIndex={index} formikProps={formikProps} />
                </Segment>
              ))}
              <Form.Button primary size="small" type="button" onClick={() => arrayHelpers.push({ name: '', options: [{ name: '', quantity: '' }] })}>Add Attribute</Form.Button>
            </div>
          )
        )
      }
    />
  )
}

type ModalProps = {
  initialValues: DatasetRawData,
  errorMessage: string,
  formRef: React.RefObject<FormikProps<DatasetRawData>>
  submitAction: (values: DatasetRawData, setSubmitting: FormikHelpers<DatasetRawData>['setSubmitting']) => void
}

const DatasetForm = ({
  initialValues, errorMessage, formRef, submitAction
}: ModalProps) => {
  const projectsQuery = useQuery<ProjectType[], Error>('projects', getProjects)
  const projects = (Array.isArray(projectsQuery.data) && projectsQuery.data.length > 0) ? projectsQuery.data : null

  useEffect(() => {
    projectOptions = []
    if (projects) projects.map((project) => createDropdown(project, ''))
  }, [])

  const handleDropdownChange = (data: DropdownProps, formikProps: FormikProps<DatasetRawData>) => {
    formikProps.setFieldValue('project', data.value)
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => submitAction(values, setSubmitting)}
      innerRef={formRef}
      validationSchema={Yup.object({
        name: Yup.string().required('Required').trim(),
        project: Yup.string().trim(),
        description: Yup.string().trim(),
        notes: Yup.string().trim(),
        attributes: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required('Required').trim(),
              options: Yup.array()
                .of(
                  Yup.object().shape({
                    name: Yup.string().required('Required').trim(),
                    quantity: Yup.number()
                      .required('Required')
                      .min(0, 'Must be at least 0')
                      .integer('Must be an integer')
                  })
                )
            })
          )
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
            <label htmlFor="name">Dataset Name</label>
            <Form.Input
              name="name"
              type="text"
              id="name"
              value={formikProps.values.name}
              error={formikProps.errors.name}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              onSubmit={formikProps.handleSubmit}
              onReset={formikProps.handleReset}
              autoFocus
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="project">Project</label>
            <Form.Dropdown
              name="parentProject"
              type="text"
              id="parentProject"
              placeholder={projects ? 'Select Parent Project' : 'Create a Project First!'}
              fluid
              selection
              clearable
              search
              options={projectOptions}
              value={formikProps.values.project}
              error={projects ? formikProps.errors.project : true}
              onChange={(_e, data) => handleDropdownChange(data, formikProps)}
              onBlur={formikProps.handleBlur('parentProject')}
            />
          </Form.Field>
          <Form.TextArea
            name="description"
            label="Description"
            id="description"
            rows="1"
            placeholder="A short description of this dataset"
            value={formikProps.values.description}
            error={formikProps.errors.description}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            onSubmit={formikProps.handleSubmit}
            onReset={formikProps.handleReset}
          />
          <Attributes formikProps={formikProps} />
          <Form.TextArea
            name="notes"
            label="Notes"
            id="notes"
            rows="4"
            placeholder="Any additional notes"
            value={formikProps.values.notes}
            error={formikProps.errors.notes}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            onSubmit={formikProps.handleSubmit}
            onReset={formikProps.handleReset}
          />
        </Form>
      )}
    </Formik>
  )
}

export default DatasetForm
