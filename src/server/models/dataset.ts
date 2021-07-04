/* eslint-disable no-param-reassign */

import mongoose, { Schema, Model } from 'mongoose'
import { Option, Attribute, Dataset } from '@util/types'

const OptionSchema = new Schema<Option, Model<Option>, Option>({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { _id: false })

const AttributeSchema = new Schema<Attribute, Model<Attribute>, Attribute>({
  name: {
    type: String,
    required: true
  },
  options: {
    type: [OptionSchema]
  }
}, { _id: false })

const DatasetSchema = new Schema<Dataset, Model<Dataset>, Dataset>({
  name: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  description: {
    type: String
  },
  notes: {
    type: String
  },
  attributes: {
    type: [AttributeSchema]
  }
}, { timestamps: true })

DatasetSchema.set('toJSON', {
  getters: true,
  versionKey: false,
  transform: (_doc: Dataset, ret: Dataset) => {
    // @ts-expect-error _id gets automatically delcared by Mongoose and not in type
    delete ret._id
    // @ts-expect-error subProjects exists
    if (ret.project) delete ret.project.subProjects
  }
})

DatasetSchema.pre(/find/i, function populate() {
  this.populate('project', 'name')
})

mongoose.model('Dataset', DatasetSchema)
