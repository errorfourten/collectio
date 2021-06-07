export interface Option {
  name: string,
  quantity: number
}

export interface OptionWithId extends Option {
  id: string
}

export interface Attribute {
  name: string,
  options: Option[]
}

export interface AttributeWithId extends Attribute {
  id: number,
  options: OptionWithId[]
}

export interface Dataset {
  id: string,
  name: string,
  dateCreated: Date,
  project?: string,
  attributes?: Attribute[]
}

export type DatasetRawData = Omit<Dataset, 'id' | 'dateCreated'>

export interface DatasetRawDataForm extends DatasetRawData {
  attributes: AttributeWithId[]
}
