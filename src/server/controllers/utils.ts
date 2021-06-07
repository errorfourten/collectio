import { Attribute, DatasetRawData, Option as DatasetOption } from '@util/types'

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String
}

const isNumber = (digits: unknown): digits is number => {
  return typeof digits === 'number' || digits instanceof Number
}

const parseName = (name: unknown): string => {
  if (!name) {
    throw new Error('Missing dataset name')
  } else if (!isString(name)) {
    throw new Error(`Dataset name ${name} is not a string. Type is ${typeof name}`)
  }
  return name
}

const parseProject = (project: unknown): string => {
  if (!isString(project)) {
    throw new Error(`Dataset project ${project} is not a string. Type is ${typeof project}`)
  }
  return project
}

type OptionProps = {name: any, quantity: any}

const parseOption = ({name, quantity}: OptionProps): DatasetOption => {
  if (!name) {
    throw new Error (`Option name is required`)
  } else if (!quantity) {
    throw new Error(`Option quantity is required`)
  } else if (!isString(name)) {
    throw new Error(`Option name ${name} is not a string. Type is ${typeof name}`)
  } else if (!isNumber(quantity)) {
    throw new Error(`Option quantity ${quantity} is not a number. Type is ${typeof quantity}`)
  }
  return {name, quantity}
}

const parseOptions = (options: any): DatasetOption[] => {
  if (!(options instanceof Array)) {
    throw new Error (`Options ${options} needs to be an array. Type is ${typeof options}`)
  }
  options.map((option: any) => {
    parseOption(option)
  })
  return options
}

type AttributeProps = {name: any, options: any}

const parseAttribute = ({name, options}: AttributeProps): Attribute => {
  if (!isString(name)) {
    throw new Error(`Attribute name ${name} is not a string. Type is ${typeof name}`)
  }
  return {name, options: parseOptions(options)}
}

const parseAttributes = (attributes: unknown): Attribute[] => {
  if (!(attributes instanceof Array)) {
    throw new Error (`Dataset attributes ${attributes} needs to be an array. Type is ${typeof attributes}`)
  }
  attributes.map((attribute) => {
    parseAttribute(attribute)
  })
  return attributes
}

type RawDatasetFields = {
  name: unknown,
  project: unknown,
  attributes: unknown
}

const toNewDataset = ({ name, project, attributes }: RawDatasetFields): DatasetRawData => {
  const newDataset: DatasetRawData = {
    name: parseName(name),
    ...(project && {project: parseProject(project)}) as {},
    ...(attributes && {attributes: parseAttributes(attributes)}) as {}
  }
  return newDataset
}

export default {
  toNewDataset
}
