/* eslint-disable no-param-reassign */

import mongoose, { Schema, Model } from 'mongoose'
import {
  Option, Attribute, Dataset, ProjectType
} from '@util/types'
import { UserInputError } from '@util/errors'

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

DatasetSchema.index({ name: 1, project: 1 }, { unique: true })

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

// eslint-disable-next-line prefer-arrow-callback, @typescript-eslint/no-explicit-any
DatasetSchema.post('save', function errorHandling(error: any, _doc: Dataset, next: (error?: Error) => void) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new UserInputError('Dataset name is a duplicate for the same project'))
  } else {
    next()
  }
})

DatasetSchema.path('project').validate(async (v: Dataset['project']) => {
  const Project = mongoose.model<ProjectType>('Project')

  const project = await Project.findById(v)
  if (!project) {
    throw new Error('Project ID does not exist')
  }

  return true
}, 'Project `{VALUE}` is not valid')

mongoose.model('Dataset', DatasetSchema)
