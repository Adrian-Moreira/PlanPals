import { StatusCodes } from 'http-status-codes'
import { BaseException } from './BaseException'

export class MalformedRequestException extends BaseException {
  constructor({
    requestType,
    requestBody,
    message = `The request is badly formatted. Request Type: ${requestType}. Request Body: ${requestBody}`,
  }: {
    requestType: string
    requestBody?: any
    message?: string
  }) {
    super({
      name: 'MalformedRequestException',
      message,
      status: StatusCodes.BAD_REQUEST,
    })
  }
}
