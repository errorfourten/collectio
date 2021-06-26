import {
  Attribute, Dataset, DatasetRawData, NewProjectType, Option as DatasetOption
} from '@util/types'
import { validate as uuidValidate } from 'uuid'

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String

const isNumber = (digits: unknown): digits is number => typeof digits === 'number' || digits instanceof Number

const parseUUID = (uuid: unknown): string => {
  if (!uuid) {
    throw new Error('Missing dataset id')
  } else if (!isString(uuid)) {
    throw new Error(`Dataset id ${uuid} is not a string. Type is ${typeof uuid}`)
  } else if (!uuidValidate(uuid)) {
    throw new Error(`Invalid UUID: ${uuid}`)
  }
  return uuid
}

const parseDate = (date: unknown): Date => {
  if (!date) {
    throw new Error('Missing dataset date')
  } else if (!isString(date)) {
    throw new Error(`Dataset date ${date} is not a string. Type is ${typeof date}`)
  } else if (Number.isNaN(Date.parse(date))) {
    throw new Error(`Invalid date: ${date}`)
  }
  return new Date(date)
}

const parseName = (name: unknown): string => {
  if (!name) {
    throw new Error('Missing dataset name')
  } else if (!isString(name)) {
    throw new Error(`Dataset name ${name} is not a string. Type is ${typeof name}`)
  }
  return name
}

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error(`Dataset description ${description} is not a string. Type is ${typeof description}`)
  }
  return description
}

const parseNotes = (notes: unknown): string => {
  if (!isString(notes)) {
    throw new Error(`Dataset notes ${notes} is not a string. Type if ${typeof notes}`)
  }
  return notes
}

const parseProject = (project: unknown): string => {
  if (!isString(project)) {
    throw new Error(`Dataset project ${project} is not a string. Type is ${typeof project}`)
  }
  return project
}

type OptionProps = {name: unknown, quantity: unknown}

const parseOption = ({ name, quantity }: OptionProps): DatasetOption => {
  if (!name) {
    throw new Error('Option name is required')
  } else if (quantity === undefined) {
    throw new Error('Option quantity is required')
  } else if (!isString(name)) {
    throw new Error(`Option name ${name} is not a string. Type is ${typeof name}`)
  } else if (!isNumber(quantity)) {
    throw new Error(`Option quantity ${quantity} is not a number. Type is ${typeof quantity}`)
  }
  return { name, quantity }
}

const parseOptions = (options: unknown): DatasetOption[] => {
  if (!(options instanceof Array)) {
    throw new Error(`Options ${options} needs to be an array. Type is ${typeof options}`)
  }
  options.forEach((option: OptionProps) => {
    parseOption(option)
  })
  return options
}

type AttributeProps = {name: unknown, options: unknown}

const parseAttribute = ({ name, options }: AttributeProps): Attribute => {
  if (!isString(name)) {
    throw new Error(`Attribute name ${name} is not a string. Type is ${typeof name}`)
  }
  return { name, options: parseOptions(options) }
}

const parseAttributes = (attributes: unknown): Attribute[] => {
  if (!(attributes instanceof Array)) {
    throw new Error(`Dataset attributes ${attributes} needs to be an array. Type is ${typeof attributes}`)
  }
  attributes.forEach((attribute) => {
    parseAttribute(attribute)
  })
  return attributes
}

interface RawDatasetFields {
  name: unknown,
  project: unknown,
  description: unknown,
  notes: unknown
  attributes: unknown
}

const toNewDataset = ({
  name, project, description, notes, attributes
}: RawDatasetFields): DatasetRawData => (
  {
    name: parseName(name),
    ...(description && { description: parseDescription(description) }) as Record<string, unknown>,
    ...(notes && { notes: parseNotes(notes) }) as Record<string, unknown>,
    ...(project && { project: parseProject(project) }) as Record<string, unknown>,
    ...(attributes && { attributes: parseAttributes(attributes) }) as Record<string, unknown>
  }
)

interface ValidateDatasetFields extends RawDatasetFields {
  id: unknown,
  dateCreated: unknown
}

const toDataset = ({
  id, dateCreated, name, project, description, notes, attributes
}: ValidateDatasetFields): Dataset => (
  {
    id: parseUUID(id),
    dateCreated: parseDate(dateCreated),
    name: parseName(name),
    ...(description && { description: parseDescription(description) }) as Record<string, unknown>,
    ...(notes && { notes: parseNotes(notes) }) as Record<string, unknown>,
    ...(project && { project: parseProject(project) }) as Record<string, unknown>,
    ...(attributes && { attributes: parseAttributes(attributes) }) as Record<string, unknown>
  }
)

const parseProjectName = (name: unknown): string => {
  if (!name) {
    throw new Error('Missing project name')
  } else if (!isString(name)) {
    throw new Error(`Project name ${name} is not a string. Type is ${typeof name}`)
  }
  return name
}

const parseParentProject = (parentProject: unknown): string => {
  if (!isString(parentProject)) {
    throw new Error(`Project parent ID ${parentProject} is not a string. Type is ${typeof parentProject}`)
  }
  return parentProject
}

type ValidateNewProjectFields = {
  name: unknown,
  parentProject: unknown
}

const toNewProject = ({ name, parentProject }: ValidateNewProjectFields): NewProjectType => (
  {
    name: parseProjectName(name),
    ...(parentProject && { parentProject: parseParentProject(parentProject) }) as Record<string, unknown>
  }
)

export default {
  toNewDataset,
  toDataset,
  toNewProject,
  parseUUID
}
