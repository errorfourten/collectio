interface Attribute {
  [type: string]: {
    [option: string]: number
  }
}

export interface Dataset {
  id: string,
  name: string,
  dateCreated: Date,
  project: string,
  attributes?: Attribute
}
