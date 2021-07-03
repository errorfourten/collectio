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
  dateCreated: string,
  project?: string,
  description?: string,
  notes?: string,
  attributes?: Attribute[]
}

export type DatasetRawData = Omit<Dataset, 'id' | 'dateCreated'>

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
