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
  updatedAt: string
  project?: {
    id: ProjectType['id'],
    name: string
  },
  description?: string,
  notes?: string,
  attributes?: Attribute[]
}

export interface DatasetRawData extends Omit<Dataset, 'id' | 'createdAt' | 'updatedAt' | 'project'> {
  project?: string
}

export interface ProjectType {
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string,
  subProjects: ProjectType[]
}

export type NewProjectType = {
  name: string,
  parentProject: ProjectType['id']
}
