export interface Option {
  name: string,
  quantity: number
}

export interface Attribute {
  name: string,
  options: Option[]
}

export interface Dataset {
  id: string,
  name: string,
  createdAt: string,
  modifiedAt: string
  project?: {
    id: ProjectType['id'],
    name: string
  },
  description?: string,
  notes?: string,
  attributes?: Attribute[]
}

export interface DatasetRawData extends Omit<Dataset, 'id' | 'createdAt' | 'modifiedAt' | 'project'> {
  project?: string
}

export interface ProjectType {
  id: string,
  name: string,
  createdAt: string,
  modifiedAt: string,
  subProjects: ProjectType[]
}

export type NewProjectType = {
  name: string,
  parentProject: ProjectType['id']
}
