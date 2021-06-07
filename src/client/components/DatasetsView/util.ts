import {
  Attribute, DatasetRawData, DatasetRawDataForm, Option
} from 'Utilities/types'

const processFormData = (formData: DatasetRawDataForm): DatasetRawData => {
  // Takes in form data with IDs in attributes and options and removes them

  const cleanData: DatasetRawData = {
    name: formData.name,
    project: formData.project
  }

  if (formData.attributes.length) {
    const newAttributes: Attribute[] = []
    formData.attributes.forEach((attribute) => {
      const newAttribute: Attribute = {
        name: attribute.name,
        options: []
      }

      attribute.options.forEach((option) => {
        const newOption: Option = {
          name: option.name,
          quantity: option.quantity
        }

        newAttribute.options.push(newOption)
      })
      newAttributes.push(newAttribute)
    })
    cleanData.attributes = newAttributes
  }

  return cleanData
}

export default {
  processFormData
}
