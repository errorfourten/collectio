/* eslint-disable max-classes-per-file */

export class UserInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserInputError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}
