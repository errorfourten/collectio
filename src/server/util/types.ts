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
  attributes?: Attribute[]
}

export type DatasetRawData = Omit<Dataset, 'id' | 'dateCreated'>
