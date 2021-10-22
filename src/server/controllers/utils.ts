import { UserInputError } from '@util/errors'
import {
  Attribute, DatasetRawData, NewProjectType, Option as DatasetOption, ProjectType
} from '@util/types'
import { validate as uuidValidate } from 'uuid'

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String

const isNumber = (digits: unknown): digits is number => typeof digits === 'number' || digits instanceof Number

const isObject = (item: unknown): item is Record<string, unknown> => typeof item === 'object' || item instanceof Object

const parseUUID = (uuid: unknown): string => {
  if (!uuid) {
    throw new UserInputError('Missing dataset id')
  } else if (!isString(uuid)) {
    throw new UserInputError(`Dataset id ${uuid} is not a string. Type is ${typeof uuid}`)
  } else if (!uuidValidate(uuid)) {
    throw new UserInputError(`Invalid UUID: ${uuid}`)
  }
  return uuid
}

const parseName = (name: unknown): string => {
  if (!name) {
    throw new UserInputError('Missing dataset name')
  } else if (!isString(name)) {
    throw new UserInputError(`Dataset name ${name} is not a string. Type is ${typeof name}`)
  }
  return name
}

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new UserInputError(`Dataset description ${description} is not a string. Type is ${typeof description}`)
  }
  return description
}

const parseNotes = (notes: unknown): string => {
  if (!isString(notes)) {
    throw new UserInputError(`Dataset notes ${notes} is not a string. Type if ${typeof notes}`)
  }
  return notes
}

const parseProject = (project: unknown): string => {
  if (isObject(project)) {
    if (project.id && isString(project.id)) {
      return project.id
    }
  }

  if (!isString(project)) {
    throw new UserInputError(`Dataset project ${project} is not a string. Type is ${typeof project}`)
  }
  return project
}

type OptionProps = {name: unknown, quantity: unknown}

const parseOption = ({ name, quantity }: OptionProps): DatasetOption => {
  if (!name) {
    throw new UserInputError('Option name is required')
  } else if (quantity === undefined) {
    throw new UserInputError('Option quantity is required')
  } else if (!isString(name)) {
    throw new UserInputError(`Option name ${name} is not a string. Type is ${typeof name}`)
  } else if (!isNumber(quantity)) {
    throw new UserInputError(`Option quantity ${quantity} is not a number. Type is ${typeof quantity}`)
  }
  return { name, quantity }
}

const parseOptions = (options: unknown): DatasetOption[] => {
  if (!(options instanceof Array)) {
    throw new UserInputError(`Options ${options} needs to be an array. Type is ${typeof options}`)
  }
  options.forEach((option: OptionProps) => {
    parseOption(option)
  })
  return options
}

type AttributeProps = {name: unknown, options: unknown}

const parseAttribute = ({ name, options }: AttributeProps): Attribute => {
  if (!isString(name)) {
    throw new UserInputError(`Attribute name ${name} is not a string. Type is ${typeof name}`)
  }
  return { name, options: parseOptions(options) }
}

const parseAttributes = (attributes: unknown): Attribute[] => {
  if (!(attributes instanceof Array)) {
    throw new UserInputError(`Dataset attributes ${attributes} needs to be an array. Type is ${typeof attributes}`)
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

const toDataset = ({
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

const parseProjectName = (name: unknown): string => {
  if (!name) {
    throw new UserInputError('Missing project name')
  } else if (!isString(name)) {
    throw new UserInputError(`Project name ${name} is not a string. Type is ${typeof name}`)
  }
  return name
}

const parseParentProject = (parentProject: unknown): string | null => {
  if (!isString(parentProject)) {
    throw new UserInputError(`Project parent ID ${parentProject} is not a string. Type is ${typeof parentProject}`)
  }
  if (parentProject === '') return null
  return parentProject
}

type ValidateNewProjectFields = {
  name: unknown,
  parentProject: unknown
}

const toNewProject = ({ name, parentProject }: ValidateNewProjectFields): NewProjectType => (
  {
    name: parseProjectName(name),
    ...(parentProject !== undefined && { parentProject: parseParentProject(parentProject) }) as Record<string, unknown>
  }
)

interface ProjectWithSubProjects extends Omit<ProjectType, 'parentProject'> {
  subProjects?: ProjectWithSubProjects[]
}

const getAllSubProjects = (project: ProjectWithSubProjects) => {
  const subProjects: string[] = []

  const getNestedProjects = (project: ProjectWithSubProjects) => {
    subProjects.push(project.id)
    if (project.subProjects) {
      project.subProjects.forEach((subProject) => getNestedProjects(subProject))
    }
  }

  getNestedProjects(project)
  return subProjects
}

export default {
  toDataset,
  toNewProject,
  getAllSubProjects,
  parseUUID
}
