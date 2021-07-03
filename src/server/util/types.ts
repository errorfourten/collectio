export interface Option {
  name: string,
  quantity: number
}

export interface Attribute {
  name: string,
  options?: Option[]
}

export interface Dataset {
  id: string,
  name: string,
  project?: string,
  description?: string,
  notes?: string,
  attributes?: Attribute[],
  dateCreated: Date,
}

export type DatasetRawData = Omit<Dataset, 'id' | 'dateCreated'>

export interface ProjectType {
  id: string,
  name: string,
  parentProject?: ProjectType['id']
  createdAt: Date,
  modifiedAt: Date
}

export type NewProjectType = {
  name: string,
  parentProject?: ProjectType['id']
}
