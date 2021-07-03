/* eslint-disable no-param-reassign */

import mongoose, { Schema, Model } from 'mongoose'
import { ProjectType } from '@util/types'

const ProjectSchema = new Schema<ProjectType, Model<ProjectType>, ProjectType>({
  name: {
    type: String,
    required: true
  },
  parentProject: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true,
  toObject: { virtuals: true }
})

ProjectSchema.virtual('subProjects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'parentProject'
})

ProjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc: ProjectType, ret: ProjectType) {
    // @ts-expect-error _id gets automatically delcared by Mongoose and not in type
    delete ret._id
  }
})

ProjectSchema.pre(/find/, function populate() {
  this.populate('subProjects')
})

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function recursiveDelete() {
  // @ts-expect-error subProjects exists on document
  await this.subProjects.forEach((subproject) => subproject.deleteOne())
})

mongoose.model<ProjectType>('Project', ProjectSchema)
