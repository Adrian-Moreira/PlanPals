import { StatusCodes } from 'http-status-codes'
import { BaseException } from './BaseException'

export class RecordNotFoundException extends BaseException {
  constructor({
    recordType,
    recordId,
    message = `The requested record couldn't be found. Record Type: ${recordType}; Record ID: ${recordId}`,
  }: {
    recordType: string
    recordId?: string
    message?: string
  }) {
    super({
      name: 'RecordNotFoundException',
      message,
      status: StatusCodes.NOT_FOUND,
    })
  }
}
