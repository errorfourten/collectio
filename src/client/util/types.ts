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

export interface ProjectsType {
  id: string,
  name: string
  subProjects?: ProjectsType[]
}

export interface SubPanelType extends ProjectsType {
  subProjects: ProjectsType[]
}
