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
  dateCreated: Date,
  project?: string,
  description?: string,
  notes?: string,
  attributes?: Attribute[]
}

export type DatasetRawData = Omit<Dataset, 'id' | 'dateCreated'>

export type ProjectsType = {
  name: string
  subProjects?: ProjectsType[]
}
