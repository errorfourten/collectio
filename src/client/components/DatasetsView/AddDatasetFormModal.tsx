import React, { useState, MouseEvent, FormEvent } from 'react'
import {
  Modal, Button, Header, Form, Segment
} from 'semantic-ui-react'
import { OptionWithId, AttributeWithId, DatasetRawDataForm } from 'Types'

type AttributesProps = {
  formData: DatasetRawDataForm,
  setFormData: (newData: DatasetRawDataForm) => void
}

type AttributeProps = {
  attribute: AttributeWithId,
  handleRemoveAttribute: (id: number) => void,
  formData: DatasetRawDataForm,
  setFormData: (newData: DatasetRawDataForm) => void
}

type OptionProps = {
  option: OptionWithId,
  handleRemoveOption: (id: string) => void,
  handleOptionChange: (newOption: OptionWithId) => void
}

const Option = ({ option, handleRemoveOption, handleOptionChange }: OptionProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOption: OptionWithId = {...option, name: e.target.value}
    handleOptionChange(newOption)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOption: OptionWithId = {...option, quantity: Number(e.target.value)}
    handleOptionChange(newOption)
  }

  return (
    <Form.Group key={option.id}>
      <Form.Input width={7} placeholder="Option" onChange={handleNameChange}/>
      <Form.Input type="number" width={5} placeholder="Quantity" onChange={handleQuantityChange}/>
      {/* This ensures that first option cannot be deleted */}
      {
        option.id.split('-')[1] !== '0'
        && <Form.Button icon="close" onClick={() => handleRemoveOption(option.id)} />
      }
    </Form.Group>
  )
}

const Attribute = ({
  attribute,
  handleRemoveAttribute,
  formData,
  setFormData
}: AttributeProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAttribute = { ...attribute, name: e.target.value }
    const newAttributes = formData.attributes.map((a) => (a.id === attribute.id ? newAttribute : a))
    setFormData({ ...formData, attributes: newAttributes })
  }

  const changeOptionsInFormData = (newOptions: OptionWithId[]) => {
    const newAttribute: AttributeWithId = {...attribute, options: newOptions}
    const newAttributes = formData.attributes.map((a) => a.id === newAttribute.id ? newAttribute : a)
    const newFormData = {...formData, attributes: newAttributes}
    setFormData(newFormData)
  }

  const handleAddOption = (event: MouseEvent) => {
    event.preventDefault()
    const newOption: OptionWithId = {
      id: `${attribute.id}-${attribute.options.length}`,
      name: '',
      quantity: 0
    }
    
    const newOptions: OptionWithId[] = [...attribute.options, newOption]
    changeOptionsInFormData(newOptions)
  }

  const handleRemoveOption = (id: string) => {
    const newOptions = attribute.options.filter((o) => o.id !== id)
    changeOptionsInFormData(newOptions)
  }

  const handleChangeOption = (newOption: OptionWithId) => {
    const newOptions = attribute.options.map((o) => o.id === newOption.id ? newOption : o)
    changeOptionsInFormData(newOptions)
  }

  return (
    <>
      <Segment key={attribute.id} style={{ marginBottom: '2em' }}>
        <Form.Group>
          <Form.Input
            width={9}
            placeholder="Attribute"
            onChange={handleInputChange}
          />
          <Form.Button negative icon="close" onClick={() => handleRemoveAttribute(attribute.id)} />
        </Form.Group>
        <Segment>
        <Header as="h4">Options</Header>
        {
          attribute.options.map((option) => (
            <Option
              option={option}
              handleRemoveOption={handleRemoveOption}
              handleOptionChange={handleChangeOption}
            />
          ))
        }
        <Form.Button onClick={handleAddOption}>Add Option</Form.Button>
      </Segment>
      </Segment>
    </>
  )
}

const Attributes = ({ formData, setFormData }: AttributesProps) => {
  const handleAddAttribute = (event: MouseEvent) => {
    event.preventDefault()

    if (formData.attributes.length) {
      const newAttribute: AttributeWithId = {
        // Finds the next id for indexedAttributes
        id: Math.max(...formData.attributes.map((a) => a.id)) + 1,
        name: '',
        options: []
      }
      const attributes = [...formData.attributes, newAttribute]

      setFormData({ ...formData, attributes })
    } else {
      setFormData({
        ...formData,
        attributes: [{
          id: 1,
          name: '',
          options: []
        }]
      })
    }
  }

  const handleRemoveAttribute = (id: number) => {
    if (!formData.attributes) {return}
    const attributes = formData.attributes.filter((a) => a.id !== id)
    setFormData({ ...formData, attributes })
  }

  return (
    <>
      <Header dividing as="h4">Attributes</Header>
      {formData.attributes
        && formData.attributes.map((attribute) => (
          <Attribute
            key={attribute.id}
            attribute={attribute}
            handleRemoveAttribute={handleRemoveAttribute}
            formData={formData}
            setFormData={setFormData}
          />
        ))}
      <Form.Button primary onClick={handleAddAttribute}>Add Attribute</Form.Button>
    </>
  )
}

const AddDatasetFormModal = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<DatasetRawDataForm>({
    name: '',
    project: '',
    attributes: []
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // submit form data...
    setFormData({
      name: '',
      project: '',
      attributes: []
    })
    setOpen(false)
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
        <Form onSubmit={handleSubmit}>
          <Form.Input
            required
            label="Dataset Name"
            name="dataset"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Form.Input
            label="Project"
            name="project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          />
          <Attributes
            formData={formData}
            setFormData={setFormData}
          />
          <Form.Button positive>Submit</Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AddDatasetFormModal
