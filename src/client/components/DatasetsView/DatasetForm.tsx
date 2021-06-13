import React from 'react'
import {
  Header, Segment, Form, Message
} from 'semantic-ui-react'
import { DatasetRawData, Attribute } from 'Utilities/types'
import {
  Formik, FieldArray, useFormikContext, FormikProps, FormikHelpers
} from 'formik'
import * as Yup from 'yup'

interface OptionsProps {
  attributeIndex: number,
  formikProps: FormikProps<DatasetRawData>
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
                    <Form.Button negative icon="cancel" type="button" onClick={() => arrayHelpers.remove(index)} />
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
  handleSubmit: (values: DatasetRawData, setSubmitting: FormikHelpers<DatasetRawData>['setSubmitting']) => void
}

const AddDatasetFormModal = ({ initialValues, errorMessage, handleSubmit }: ModalProps) => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
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
            header="Submission Error"
            content={errorMessage}
            style={{ minHeight: '0px' }}
          />
        )}
        <Form.Field required>
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
          <Form.Input
            name="project"
            type="text"
            id="project"
            value={formikProps.values.project}
            error={formikProps.errors.project}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            onSubmit={formikProps.handleSubmit}
            onReset={formikProps.handleReset}
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
        <Form.Button positive type="submit">Submit</Form.Button>
      </Form>
    )}
  </Formik>
)

export default AddDatasetFormModal
