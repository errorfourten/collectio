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
  project?: ProjectType['id'],
  description?: string,
  notes?: string,
  attributes?: Attribute[],
  createdAt: Date,
  updatedAt: Date
}

export type DatasetRawData = Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>

export interface ProjectType {
  id: string,
  name: string,
  parentProject?: ProjectType['id']
  createdAt: Date,
  updatedAt: Date
}

export type NewProjectType = {
  name: string,
  parentProject?: ProjectType['id']
}
