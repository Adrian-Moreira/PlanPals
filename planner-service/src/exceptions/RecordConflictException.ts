import { StatusCodes } from 'http-status-codes'
import { BaseException } from './BaseException'

export class RecordConflictException extends BaseException {
  constructor({
    requestType,
    conflict,
    message = `The record already exists. Request Type: ${requestType} Cause: ${conflict}`,
  }: {
    requestType: string
    conflict?: any
    message?: string
  }) {
    super({
      name: 'RecordConflictException',
      message,
      status: StatusCodes.CONFLICT,
    })

    console.error(this.message)
  }
}
