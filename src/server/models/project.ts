/* eslint-disable no-param-reassign */

import mongoose, { Schema, Model, Document } from 'mongoose'
import { ProjectType } from '@util/types'

const ProjectSchema = new Schema<ProjectType, Model<ProjectType>, ProjectType>({
  name: {
    type: String,
    required: true
  },
  top: {
    type: Boolean,
    default: false
  },
  subProjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, { timestamps: true })

ProjectSchema.set('toJSON', {
  versionKey: false,
  transform: (_document: Document<ProjectType>, returnedObject: Document<ProjectType>) => {
    if (returnedObject._id) returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // @ts-expect-error Need to remove 'top' attribute
    delete returnedObject.top
  }
})

ProjectSchema.pre('find', function populate() {
  this.populate('subProjects')
})

mongoose.model<ProjectType>('Project', ProjectSchema)
